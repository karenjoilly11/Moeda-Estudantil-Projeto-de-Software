package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.AlunoResponseDTO;
import com.moedaestudantil.api.dto.EnvioMoedasResponseDTO;
import com.moedaestudantil.api.dto.EnviarMoedasDTO;
import com.moedaestudantil.api.dto.ProfessorLoginDTO;
import com.moedaestudantil.api.dto.ProfessorLoginResponseDTO;
import com.moedaestudantil.api.dto.ProfessorResponseDTO;
import com.moedaestudantil.api.dto.TransacaoResponseDTO;
import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Professor;
import com.moedaestudantil.api.entities.Transacao;
import com.moedaestudantil.api.enums.TipoTransacao;
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
    private final NotificacaoService notificacaoService;
    
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
    public EnvioMoedasResponseDTO enviarMoedas(Long professorId, EnviarMoedasDTO dto) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        // Validar valor positivo (P0-3)
        if (dto.getValor() == null || dto.getValor() <= 0) {
            throw new RuntimeException("Valor deve ser maior que zero");
        }

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

        Transacao salva = transacaoRepository.save(transacao);

        // Lab04S01: notificar aluno (recebeu) e professor (confirmacao)
        notificacaoService.notificarRecebimentoMoeda(aluno, professor, dto.getValor(), dto.getMensagem());
        notificacaoService.notificarEnvioMoeda(professor, aluno, dto.getValor(), dto.getMensagem(), professor.getSaldoMoedas());

        return new EnvioMoedasResponseDTO(
                salva.getId(),
                aluno.getNome(),
                salva.getValor(),
                professor.getSaldoMoedas(),
                salva.getData() != null ? salva.getData().toString() : null
        );
    }
    
    // Consultar extrato de transações (retorna DTO sem senha — P0-2)
    public List<TransacaoResponseDTO> extrato(Long professorId) {
        return transacaoRepository.findByProfessorId(professorId).stream()
                .map(this::toTransacaoDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    private TransacaoResponseDTO toTransacaoDTO(Transacao t) {
        TransacaoResponseDTO dto = new TransacaoResponseDTO();
        dto.setId(t.getId());
        dto.setData(t.getData());
        dto.setTipo(t.getTipo());
        dto.setValor(t.getValor());
        dto.setMensagem(t.getMensagem());
        dto.setAlunoNome(t.getAluno() != null ? t.getAluno().getNome() : null);
        dto.setProfessorNome(t.getProfessor() != null ? t.getProfessor().getNome() : null);
        dto.setCodigoCupom(t.getCodigoCupom());
        dto.setStatus(t.getStatus());
        return dto;
    }
    
    // Consultar saldo atual
    public Double saldo(Long professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        return professor.getSaldoMoedas();
    }
    
   
    // P2-N02: retorna DTO sem CPF/RG/saldo
    public List<AlunoResponseDTO> listarAlunosPorInstituicao(Long professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        return alunoRepository.findByInstituicaoId(professor.getInstituicao().getId())
                .stream().map(this::toAlunoDTO).toList();
    }

    public List<AlunoResponseDTO> buscarAlunosPorNome(Long professorId, String nome) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        return alunoRepository.findByInstituicaoIdAndNomeContainingIgnoreCase(
                professor.getInstituicao().getId(),
                nome
        ).stream().map(this::toAlunoDTO).toList();
    }

    private AlunoResponseDTO toAlunoDTO(Aluno a) {
        AlunoResponseDTO dto = new AlunoResponseDTO();
        dto.setId(a.getId());
        dto.setNome(a.getNome());
        dto.setEmail(a.getEmail());
        dto.setCurso(a.getCurso());
        dto.setInstituicaoNome(a.getInstituicao() != null ? a.getInstituicao().getNome() : null);
        // P2-N02: não expor CPF, RG, endereço, saldo, tipo, createdAt
        return dto;
    }
    
    

}
