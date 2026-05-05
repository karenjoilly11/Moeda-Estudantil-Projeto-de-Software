package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.VantagemCadastroDTO;
import com.moedaestudantil.api.dto.VantagemResponseDTO;
import com.moedaestudantil.api.entities.Instituicao;
import com.moedaestudantil.api.entities.Vantagem;
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

    public VantagemResponseDTO cadastrar(VantagemCadastroDTO dto) {

        Instituicao instituicao = instituicaoRepository.findById(dto.getInstituicaoId())
                .orElseThrow(() -> new RuntimeException("Instituição não encontrada!"));

        Vantagem vantagem = new Vantagem();
        vantagem.setNome(dto.getNome());
        vantagem.setDescricao(dto.getDescricao());
        vantagem.setFoto(dto.getFoto());
        vantagem.setCustoMoedas(dto.getCustoMoedas());
        vantagem.setInstituicao(instituicao);

        Vantagem salva = vantagemRepository.save(vantagem);

        return toResponseDTO(salva);
    }

    public List<VantagemResponseDTO> listar() {
        return vantagemRepository.findAll(Sort.by("custoMoedas").ascending())
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private VantagemResponseDTO toResponseDTO(Vantagem vantagem) {
        VantagemResponseDTO dto = new VantagemResponseDTO();

        dto.setId(vantagem.getId());
        dto.setNome(vantagem.getNome());
        dto.setDescricao(vantagem.getDescricao());
        dto.setFoto(vantagem.getFoto());
        dto.setCustoMoedas(vantagem.getCustoMoedas());
        dto.setInstituicaoNome(vantagem.getInstituicao().getNome());

        return dto;
    }
}