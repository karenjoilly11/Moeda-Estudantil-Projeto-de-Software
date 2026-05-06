package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.EmpresaCadastroDTO;
import com.moedaestudantil.api.dto.EmpresaLoginResponseDTO;
import com.moedaestudantil.api.dto.EmpresaResponseDTO;
import com.moedaestudantil.api.dto.LoginRequestDTO;
import com.moedaestudantil.api.entities.Empresa;
import com.moedaestudantil.api.entities.Instituicao;
import com.moedaestudantil.api.enums.TipoUsuario;
import com.moedaestudantil.api.repositories.EmpresaRepository;
import com.moedaestudantil.api.repositories.InstituicaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final InstituicaoRepository instituicaoRepository;

    public EmpresaResponseDTO cadastrar(EmpresaCadastroDTO dto) {
        if (empresaRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado!");
        }
        if (empresaRepository.existsByCnpj(dto.getCnpj())) {
            throw new RuntimeException("CNPJ já cadastrado!");
        }

        Empresa empresa = new Empresa();
        empresa.setNome(dto.getNome());
        empresa.setEmail(dto.getEmail());
        empresa.setSenha(Base64.getEncoder().encodeToString(dto.getSenha().getBytes()));
        empresa.setTipo(TipoUsuario.EMPRESA);
        empresa.setCnpj(dto.getCnpj());
        empresa.setDescricao(dto.getDescricao());

        if (dto.getInstituicaoId() != null) {
            Instituicao instituicao = instituicaoRepository.findById(dto.getInstituicaoId())
                    .orElseThrow(() -> new RuntimeException("Instituição não encontrada!"));
            empresa.setInstituicao(instituicao);
        }

        Empresa salva = empresaRepository.save(empresa);
        return toResponseDTO(salva);
    }

    public EmpresaLoginResponseDTO login(LoginRequestDTO dto) {
        Empresa empresa = empresaRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos!"));

        String senhaCodificada = Base64.getEncoder().encodeToString(dto.getSenha().getBytes());
        if (!empresa.getSenha().equals(senhaCodificada)) {
            throw new RuntimeException("Email ou senha inválidos!");
        }

        String token = Base64.getEncoder().encodeToString(
                (empresa.getEmail() + ":" + System.currentTimeMillis()).getBytes()
        );

        return new EmpresaLoginResponseDTO(token, toResponseDTO(empresa));
    }

    public EmpresaResponseDTO buscarPorId(Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada!"));
        return toResponseDTO(empresa);
    }

    public List<EmpresaResponseDTO> listar() {
        return empresaRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public EmpresaResponseDTO toResponseDTO(Empresa empresa) {
        EmpresaResponseDTO dto = new EmpresaResponseDTO();
        dto.setId(empresa.getId());
        dto.setNome(empresa.getNome());
        dto.setEmail(empresa.getEmail());
        dto.setCnpj(empresa.getCnpj());
        dto.setDescricao(empresa.getDescricao());
        dto.setInstituicaoNome(empresa.getInstituicao() != null ? empresa.getInstituicao().getNome() : null);
        return dto;
    }
}
