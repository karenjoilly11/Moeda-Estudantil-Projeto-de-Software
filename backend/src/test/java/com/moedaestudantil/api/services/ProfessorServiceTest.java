package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.EnviarMoedasDTO;
import com.moedaestudantil.api.dto.EnvioMoedasResponseDTO;
import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Professor;
import com.moedaestudantil.api.entities.Transacao;
import com.moedaestudantil.api.repositories.AlunoRepository;
import com.moedaestudantil.api.repositories.ProfessorRepository;
import com.moedaestudantil.api.repositories.TransacaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfessorServiceTest {

    @Mock private ProfessorRepository professorRepository;
    @Mock private AlunoRepository alunoRepository;
    @Mock private TransacaoRepository transacaoRepository;
    @Mock private NotificacaoService notificacaoService;

    @InjectMocks
    private ProfessorService service;

    private Professor professor;
    private Aluno aluno;

    @BeforeEach
    void setup() {
        professor = new Professor();
        professor.setId(1L);
        professor.setNome("Prof Teste");
        professor.setEmail("prof@teste.com");
        professor.setSaldoMoedas(1000.0);

        aluno = new Aluno();
        aluno.setId(2L);
        aluno.setNome("Aluno Teste");
        aluno.setEmail("aluno@teste.com");
        aluno.setSaldoMoedas(0.0);
    }

    @Test
    void enviarMoedas_saldoSuficienteEMensagemValida_descontaSaldoESalvaTransacao() {
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));
        when(alunoRepository.findById(2L)).thenReturn(Optional.of(aluno));
        when(transacaoRepository.save(any(Transacao.class))).thenAnswer(inv -> {
            Transacao t = inv.getArgument(0);
            t.setId(99L);
            return t;
        });

        EnviarMoedasDTO dto = new EnviarMoedasDTO();
        dto.setAlunoId(2L);
        dto.setValor(50.0);
        dto.setMensagem("Excelente trabalho");

        EnvioMoedasResponseDTO result = service.enviarMoedas(1L, dto);

        assertThat(result.getTransacaoId()).isEqualTo(99L);
        assertThat(result.getValor()).isEqualTo(50.0);
        assertThat(result.getAlunoNome()).isEqualTo("Aluno Teste");
        assertThat(result.getSaldoRestanteProfessor()).isEqualTo(950.0);

        verify(professorRepository).save(argThat(p -> p.getSaldoMoedas().equals(950.0)));
        verify(alunoRepository).save(argThat(a -> a.getSaldoMoedas().equals(50.0)));
        verify(notificacaoService).notificarRecebimentoMoeda(eq(aluno), eq(professor), eq(50.0), eq("Excelente trabalho"));
        verify(notificacaoService).notificarEnvioMoeda(eq(professor), eq(aluno), eq(50.0), eq("Excelente trabalho"), anyDouble());
    }

    @Test
    void enviarMoedas_saldoInsuficiente_lancaErro() {
        professor.setSaldoMoedas(10.0);
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));
        when(alunoRepository.findById(2L)).thenReturn(Optional.of(aluno));

        EnviarMoedasDTO dto = new EnviarMoedasDTO();
        dto.setAlunoId(2L);
        dto.setValor(500.0);
        dto.setMensagem("teste");

        assertThatThrownBy(() -> service.enviarMoedas(1L, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Saldo insuficiente");

        verify(transacaoRepository, never()).save(any());
        verify(notificacaoService, never()).notificarRecebimentoMoeda(any(), any(), anyDouble(), anyString());
    }

    @Test
    void enviarMoedas_mensagemVazia_lancaErro() {
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));
        when(alunoRepository.findById(2L)).thenReturn(Optional.of(aluno));

        EnviarMoedasDTO dto = new EnviarMoedasDTO();
        dto.setAlunoId(2L);
        dto.setValor(10.0);
        dto.setMensagem("   ");

        assertThatThrownBy(() -> service.enviarMoedas(1L, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Mensagem");

        verify(transacaoRepository, never()).save(any());
    }

    @Test
    void enviarMoedas_alunoInexistente_lancaErro() {
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));
        when(alunoRepository.findById(999L)).thenReturn(Optional.empty());

        EnviarMoedasDTO dto = new EnviarMoedasDTO();
        dto.setAlunoId(999L);
        dto.setValor(10.0);
        dto.setMensagem("teste");

        assertThatThrownBy(() -> service.enviarMoedas(1L, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContainingAll("Aluno", "encontrado");
    }
}
