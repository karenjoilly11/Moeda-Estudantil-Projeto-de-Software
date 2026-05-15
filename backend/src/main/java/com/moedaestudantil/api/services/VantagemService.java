package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.VantagemCadastroDTO;
import com.moedaestudantil.api.dto.VantagemResponseDTO;
import com.moedaestudantil.api.entities.Empresa;
import com.moedaestudantil.api.entities.Instituicao;
import com.moedaestudantil.api.entities.Vantagem;
import com.moedaestudantil.api.repositories.EmpresaRepository;
import com.moedaestudantil.api.repositories.InstituicaoRepository;
import com.moedaestudantil.api.repositories.VantagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VantagemService {

    private final VantagemRepository vantagemRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final EmpresaRepository empresaRepository;

    public VantagemResponseDTO cadastrar(VantagemCadastroDTO dto) {
        if (dto.getInstituicaoId() == null && dto.getEmpresaId() == null) {
            throw new RuntimeException("Vantagem precisa de instituicaoId ou empresaId");
        }

        Vantagem vantagem = new Vantagem();
        aplicarDados(vantagem, dto);

        Vantagem salva = vantagemRepository.save(vantagem);
        return toResponseDTO(salva);
    }

    public VantagemResponseDTO atualizar(Long id, VantagemCadastroDTO dto) {
        Vantagem vantagem = vantagemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada!"));
        aplicarDados(vantagem, dto);
        Vantagem salva = vantagemRepository.save(vantagem);
        return toResponseDTO(salva);
    }

    public void remover(Long id) {
        if (!vantagemRepository.existsById(id)) {
            throw new RuntimeException("Vantagem não encontrada!");
        }
        vantagemRepository.deleteById(id);
    }

    public List<VantagemResponseDTO> listar() {
        return vantagemRepository.findAll(Sort.by("custoMoedas").ascending())
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public VantagemResponseDTO buscarPorId(Long id) {
        Vantagem vantagem = vantagemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada!"));
        return toResponseDTO(vantagem);
    }

    public List<VantagemResponseDTO> listarPorEmpresa(Long empresaId) {
        return vantagemRepository.findByEmpresaIdOrderByCustoMoedasAsc(empresaId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private void aplicarDados(Vantagem vantagem, VantagemCadastroDTO dto) {
        vantagem.setNome(dto.getNome());
        vantagem.setDescricao(dto.getDescricao());
        vantagem.setFoto(dto.getFoto());
        vantagem.setCustoMoedas(dto.getCustoMoedas());
        vantagem.setEstoque(dto.getEstoque());
        vantagem.setCategoria(dto.getCategoria());

        if (dto.getInstituicaoId() != null) {
            Instituicao instituicao = instituicaoRepository.findById(dto.getInstituicaoId())
                    .orElseThrow(() -> new RuntimeException("Instituição não encontrada!"));
            vantagem.setInstituicao(instituicao);
        } else {
            vantagem.setInstituicao(null);
        }

        if (dto.getEmpresaId() != null) {
            Empresa empresa = empresaRepository.findById(dto.getEmpresaId())
                    .orElseThrow(() -> new RuntimeException("Empresa não encontrada!"));
            vantagem.setEmpresa(empresa);
        } else {
            vantagem.setEmpresa(null);
        }
    }

    private VantagemResponseDTO toResponseDTO(Vantagem vantagem) {
        VantagemResponseDTO dto = new VantagemResponseDTO();
        dto.setId(vantagem.getId());
        dto.setNome(vantagem.getNome());
        dto.setDescricao(vantagem.getDescricao());
        dto.setFoto(vantagem.getFoto());
        dto.setCustoMoedas(vantagem.getCustoMoedas());
        dto.setEstoque(vantagem.getEstoque());
        dto.setCategoria(vantagem.getCategoria());

        // Prioriza nome da empresa quando vinculada; senão usa instituição
        if (vantagem.getEmpresa() != null) {
            dto.setInstituicaoNome(vantagem.getEmpresa().getNome());
            dto.setEmpresaId(vantagem.getEmpresa().getId());
        } else if (vantagem.getInstituicao() != null) {
            dto.setInstituicaoNome(vantagem.getInstituicao().getNome());
            dto.setInstituicaoId(vantagem.getInstituicao().getId());
        }

        return dto;
    }
}
