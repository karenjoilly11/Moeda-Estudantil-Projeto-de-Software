package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.ProfessorLoginDTO;
import com.moedaestudantil.api.dto.ProfessorLoginResponseDTO;
import com.moedaestudantil.api.dto.ProfessorResponseDTO;
import com.moedaestudantil.api.entities.Professor;
import com.moedaestudantil.api.enums.TipoUsuario;
import com.moedaestudantil.api.repositories.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
@RequiredArgsConstructor
public class ProfessorService {
    
    private final ProfessorRepository professorRepository;
    
    public ProfessorResponseDTO toResponseDTO(Professor professor) {
        ProfessorResponseDTO dto = new ProfessorResponseDTO();
        dto.setId(professor.getId());
        dto.setNome(professor.getNome());
        dto.setEmail(professor.getEmail());
        dto.setCpf(professor.getCpf());
        dto.setDepartamento(professor.getDepartamento());
        dto.setInstituicaoNome(professor.getInstituicao() != null ? professor.getInstituicao().getNome() : null);
        dto.setSaldoMoedas(professor.getSaldoMoedas());
        return dto;
    }
    
    public ProfessorLoginResponseDTO login(ProfessorLoginDTO dto) {
        Professor professor = professorRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos!"));
        
        String senhaCodificada = Base64.getEncoder().encodeToString(dto.getSenha().getBytes());
        if (!professor.getSenha().equals(senhaCodificada)) {
            throw new RuntimeException("Email ou senha inválidos!");
        }
        
        String token = Base64.getEncoder().encodeToString(
            (professor.getEmail() + ":" + System.currentTimeMillis()).getBytes()
        );
        
        return new ProfessorLoginResponseDTO(token, toResponseDTO(professor));
    }
}
