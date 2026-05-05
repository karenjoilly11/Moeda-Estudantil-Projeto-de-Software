package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.EnviarMoedasDTO;
import com.moedaestudantil.api.dto.ProfessorLoginDTO;
import com.moedaestudantil.api.dto.ProfessorLoginResponseDTO;
import com.moedaestudantil.api.dto.ProfessorResponseDTO;
import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Professor;
import com.moedaestudantil.api.entities.Transacao;
import com.moedaestudantil.api.enums.TipoTransacao;
import com.moedaestudantil.api.enums.TipoUsuario;
import com.moedaestudantil.api.repositories.AlunoRepository;
import com.moedaestudantil.api.repositories.ProfessorRepository;
import com.moedaestudantil.api.repositories.TransacaoRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfessorService {
    
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final TransacaoRepository transacaoRepository;
    
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

    public Professor findByEmail(String email) {
        return professorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
    }

    // Enviar moedas para um aluno
    public Transacao enviarMoedas(Long professorId, EnviarMoedasDTO dto) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        
        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        // Validar saldo
        if (professor.getSaldoMoedas() < dto.getValor()) {
            throw new RuntimeException("Saldo insuficiente");
        }
        
        // Validar mensagem obrigatória
        if (dto.getMensagem() == null || dto.getMensagem().isBlank()) {
            throw new RuntimeException("Mensagem de reconhecimento é obrigatória");
        }
        
        // Atualizar saldos
        professor.setSaldoMoedas(professor.getSaldoMoedas() - dto.getValor());
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + dto.getValor());
        
        // Registrar transação
        Transacao transacao = new Transacao();
        transacao.setProfessor(professor);
        transacao.setAluno(aluno);
        transacao.setValor(dto.getValor());
        transacao.setTipo(TipoTransacao.ENVIO);
        transacao.setMensagem(dto.getMensagem());
        transacao.setData(LocalDateTime.now());
        
        professorRepository.save(professor);
        alunoRepository.save(aluno);
        
        return transacaoRepository.save(transacao);
    }
    
    // Consultar extrato de transações
    public List<Transacao> extrato(Long professorId) {
        return transacaoRepository.findByProfessorId(professorId);
    }
    
    // Consultar saldo atual
    public Double saldo(Long professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        return professor.getSaldoMoedas();
    }
    
   
    // Listar alunos da mesma instituição
    public List<Aluno> listarAlunosPorInstituicao(Long professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        return alunoRepository.findByInstituicaoId(professor.getInstituicao().getId());
    }
    
    
    

}
