package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.CupomValidacaoDTO;
import com.moedaestudantil.api.dto.ResgateRequestDTO;
import com.moedaestudantil.api.dto.ResgateResponseDTO;
import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Transacao;
import com.moedaestudantil.api.entities.Vantagem;
import com.moedaestudantil.api.repositories.AlunoRepository;
import com.moedaestudantil.api.repositories.TransacaoRepository;
import com.moedaestudantil.api.repositories.VantagemRepository;
import jakarta.persistence.EntityNotFoundException;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransacaoServiceTest {

    @Mock private TransacaoRepository transacaoRepository;
    @Mock private AlunoRepository alunoRepository;
    @Mock private VantagemRepository vantagemRepository;
    @Mock private NotificacaoService notificacaoService;

    @InjectMocks
    private TransacaoService service;

    private Aluno aluno;
    private Vantagem vantagem;

    @BeforeEach
    void setup() {
        aluno = new Aluno();
        aluno.setId(1L);
        aluno.setNome("Aluno Teste");
        aluno.setEmail("aluno@teste.com");
        aluno.setSaldoMoedas(100.0);

        vantagem = new Vantagem();
        vantagem.setId(10L);
        vantagem.setNome("Caderno");
        vantagem.setCustoMoedas(50.0);
    }

    @Test
    void resgatar_comSaldoSuficiente_descontaSaldoEGeraCupom() {
        when(alunoRepository.findById(1L)).thenReturn(Optional.of(aluno));
        when(vantagemRepository.findById(10L)).thenReturn(Optional.of(vantagem));
        when(transacaoRepository.findByCodigoCupom(anyString())).thenReturn(Optional.empty());
        when(transacaoRepository.save(any(Transacao.class))).thenAnswer(inv -> {
            Transacao t = inv.getArgument(0);
            t.setId(99L);
            return t;
        });

        ResgateRequestDTO dto = new ResgateRequestDTO();
        dto.setAlunoId(1L);
        dto.setVantagemId(10L);

        ResgateResponseDTO resp = service.resgatar(dto);

        assertThat(resp.getCodigoCupom()).hasSize(8);
        assertThat(resp.getSaldoRestante()).isEqualTo(50.0);
        assertThat(resp.getVantagemNome()).isEqualTo("Caderno");
        assertThat(resp.getCustoMoedas()).isEqualTo(50.0);

        verify(alunoRepository).save(argThat(a -> a.getSaldoMoedas().equals(50.0)));
        verify(transacaoRepository).save(any(Transacao.class));
        verify(notificacaoService).notificarResgateAluno(eq(aluno), eq(vantagem), anyString(), eq(50.0));
        verify(notificacaoService).notificarResgateEmpresa(eq(vantagem), eq(aluno), anyString());
    }

    @Test
    void resgatar_comSaldoInsuficiente_lancaIllegalStateException() {
        aluno.setSaldoMoedas(10.0); // menor que custo 50
        when(alunoRepository.findById(1L)).thenReturn(Optional.of(aluno));
        when(vantagemRepository.findById(10L)).thenReturn(Optional.of(vantagem));

        ResgateRequestDTO dto = new ResgateRequestDTO();
        dto.setAlunoId(1L);
        dto.setVantagemId(10L);

        assertThatThrownBy(() -> service.resgatar(dto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Saldo insuficiente");

        verify(transacaoRepository, never()).save(any());
        verify(notificacaoService, never()).notificarResgateAluno(any(), any(), anyString(), anyDouble());
    }

    @Test
    void resgatar_alunoInexistente_lancaEntityNotFoundException() {
        when(alunoRepository.findById(999L)).thenReturn(Optional.empty());

        ResgateRequestDTO dto = new ResgateRequestDTO();
        dto.setAlunoId(999L);
        dto.setVantagemId(10L);

        assertThatThrownBy(() -> service.resgatar(dto))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Aluno");
    }

    @Test
    void resgatar_vantagemInexistente_lancaEntityNotFoundException() {
        when(alunoRepository.findById(1L)).thenReturn(Optional.of(aluno));
        when(vantagemRepository.findById(999L)).thenReturn(Optional.empty());

        ResgateRequestDTO dto = new ResgateRequestDTO();
        dto.setAlunoId(1L);
        dto.setVantagemId(999L);

        assertThatThrownBy(() -> service.resgatar(dto))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Vantagem");
    }

    @Test
    void validarCupom_pendente_retornaDTO() {
        Transacao t = new Transacao();
        t.setCodigoCupom("ABC12345");
        t.setStatus("PENDENTE");
        t.setAluno(aluno);
        t.setVantagem(vantagem);
        t.setValor(50.0);

        when(transacaoRepository.findByCodigoCupom("ABC12345")).thenReturn(Optional.of(t));

        CupomValidacaoDTO dto = service.validarCupom("ABC12345");

        assertThat(dto.getCodigoCupom()).isEqualTo("ABC12345");
        assertThat(dto.getStatus()).isEqualTo("PENDENTE");
        assertThat(dto.getAlunoNome()).isEqualTo("Aluno Teste");
        assertThat(dto.getVantagemNome()).isEqualTo("Caderno");
    }

    @Test
    void validarCupom_inexistente_lancaEntityNotFoundException() {
        when(transacaoRepository.findByCodigoCupom("XXXXXXXX")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validarCupom("XXXXXXXX"))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Cupom");
    }

    @Test
    void utilizarCupom_pendente_mudaParaUtilizado() {
        Transacao t = new Transacao();
        t.setCodigoCupom("ABC12345");
        t.setStatus("PENDENTE");
        t.setAluno(aluno);
        t.setVantagem(vantagem);
        t.setValor(50.0);

        when(transacaoRepository.findByCodigoCupom("ABC12345")).thenReturn(Optional.of(t));
        when(transacaoRepository.save(any(Transacao.class))).thenAnswer(inv -> inv.getArgument(0));

        CupomValidacaoDTO dto = service.utilizarCupom("ABC12345");

        assertThat(dto.getStatus()).isEqualTo("UTILIZADO");
        verify(transacaoRepository).save(argThat(tr -> "UTILIZADO".equals(tr.getStatus())));
    }

    @Test
    void utilizarCupom_jaUtilizado_lancaIllegalState() {
        Transacao t = new Transacao();
        t.setCodigoCupom("ABC12345");
        t.setStatus("UTILIZADO");
        t.setAluno(aluno);
        t.setVantagem(vantagem);

        when(transacaoRepository.findByCodigoCupom("ABC12345")).thenReturn(Optional.of(t));

        assertThatThrownBy(() -> service.utilizarCupom("ABC12345"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContainingAll("Cupom", "pendente");

        verify(transacaoRepository, never()).save(any());
    }
}
