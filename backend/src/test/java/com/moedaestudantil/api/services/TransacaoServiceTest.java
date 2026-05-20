package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.CupomValidacaoDTO;
import com.moedaestudantil.api.dto.ResgateRequestDTO;
import com.moedaestudantil.api.dto.ResgateResponseDTO;
import com.moedaestudantil.api.dto.event.EmailResgateAlunoEvent;
import com.moedaestudantil.api.dto.event.EmailResgateEmpresaEvent;
import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Empresa;
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
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransacaoServiceTest {

    @Mock private TransacaoRepository transacaoRepository;
    @Mock private AlunoRepository alunoRepository;
    @Mock private VantagemRepository vantagemRepository;
    @Mock private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private TransacaoService service;

    private static final Long ALUNO_ID = 1L;
    private static final Long VANTAGEM_ID = 10L;
    private static final Long EMPRESA_ID = 50L;

    private Aluno aluno;
    private Vantagem vantagem;
    private Empresa empresa;

    @BeforeEach
    void setup() {
        aluno = new Aluno();
        aluno.setId(ALUNO_ID);
        aluno.setNome("Aluno Teste");
        aluno.setEmail("aluno@teste.com");
        aluno.setSaldoMoedas(100.0);

        empresa = new Empresa();
        empresa.setId(EMPRESA_ID);
        empresa.setNome("Empresa Teste");
        empresa.setEmail("empresa@teste.com");

        vantagem = new Vantagem();
        vantagem.setId(VANTAGEM_ID);
        vantagem.setNome("Caderno");
        vantagem.setCustoMoedas(50.0);
        vantagem.setEstoque(10);
        vantagem.setEmpresa(empresa);
    }

    @Test
    void resgatar_comSaldoSuficiente_descontaSaldoEGeraCupom() {
        when(alunoRepository.findById(ALUNO_ID)).thenReturn(Optional.of(aluno));
        when(vantagemRepository.findById(VANTAGEM_ID)).thenReturn(Optional.of(vantagem));
        when(transacaoRepository.findByCodigoCupom(anyString())).thenReturn(Optional.empty());
        when(transacaoRepository.save(any(Transacao.class))).thenAnswer(invocation -> {
            Transacao t = invocation.getArgument(0);
            t.setId(99L);
            t.setData(LocalDateTime.now());
            return t;
        });

        ResgateRequestDTO dto = new ResgateRequestDTO();
        dto.setAlunoId(ALUNO_ID);
        dto.setVantagemId(VANTAGEM_ID);

        ResgateResponseDTO resp = service.resgatar(dto, ALUNO_ID);

        assertThat(resp.getCodigoCupom()).hasSize(8);
        assertThat(resp.getSaldoRestante()).isEqualTo(50.0);
        assertThat(resp.getVantagemNome()).isEqualTo("Caderno");
        assertThat(resp.getCustoMoedas()).isEqualTo(50.0);

        verify(alunoRepository).save(argThat(a -> a.getSaldoMoedas() == 50.0));
        verify(transacaoRepository).save(any(Transacao.class));
        verify(eventPublisher).publishEvent(any(EmailResgateAlunoEvent.class));
        verify(eventPublisher).publishEvent(any(EmailResgateEmpresaEvent.class));
    }

    @Test
    void resgatar_emNomeDeOutroAluno_lancaSecurityException() {
        ResgateRequestDTO dto = new ResgateRequestDTO();
        dto.setAlunoId(ALUNO_ID);
        dto.setVantagemId(VANTAGEM_ID);

        assertThatThrownBy(() -> service.resgatar(dto, 999L))
                .isInstanceOf(SecurityException.class)
                .hasMessageContaining("outro aluno");

        verify(transacaoRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void resgatar_comSaldoInsuficiente_lancaIllegalStateException() {
        aluno.setSaldoMoedas(10.0);

        when(alunoRepository.findById(ALUNO_ID)).thenReturn(Optional.of(aluno));
        when(vantagemRepository.findById(VANTAGEM_ID)).thenReturn(Optional.of(vantagem));

        ResgateRequestDTO dto = new ResgateRequestDTO();
        dto.setAlunoId(ALUNO_ID);
        dto.setVantagemId(VANTAGEM_ID);

        assertThatThrownBy(() -> service.resgatar(dto, ALUNO_ID))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Saldo insuficiente");

        verify(transacaoRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void resgatar_alunoInexistente_lancaEntityNotFoundException() {
        when(alunoRepository.findById(999L)).thenReturn(Optional.empty());

        ResgateRequestDTO dto = new ResgateRequestDTO();
        dto.setAlunoId(999L);
        dto.setVantagemId(VANTAGEM_ID);

        assertThatThrownBy(() -> service.resgatar(dto, 999L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Aluno");
    }

    @Test
    void resgatar_vantagemInexistente_lancaEntityNotFoundException() {
        when(alunoRepository.findById(ALUNO_ID)).thenReturn(Optional.of(aluno));
        when(vantagemRepository.findById(999L)).thenReturn(Optional.empty());

        ResgateRequestDTO dto = new ResgateRequestDTO();
        dto.setAlunoId(ALUNO_ID);
        dto.setVantagemId(999L);

        assertThatThrownBy(() -> service.resgatar(dto, ALUNO_ID))
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
        t.setData(LocalDateTime.now());

        when(transacaoRepository.findByCodigoCupom("ABC12345")).thenReturn(Optional.of(t));

        CupomValidacaoDTO dto = service.validarCupom("ABC12345", EMPRESA_ID);

        assertThat(dto.getCodigoCupom()).isEqualTo("ABC12345");
        assertThat(dto.getStatus()).isEqualTo("PENDENTE");
        assertThat(dto.getAlunoNome()).isEqualTo("Aluno Teste");
        assertThat(dto.getVantagemNome()).isEqualTo("Caderno");
    }

    @Test
    void validarCupom_deOutraEmpresa_lancaSecurityException() {
        Transacao t = new Transacao();
        t.setCodigoCupom("ABC12345");
        t.setStatus("PENDENTE");
        t.setAluno(aluno);
        t.setVantagem(vantagem);

        when(transacaoRepository.findByCodigoCupom("ABC12345")).thenReturn(Optional.of(t));

        assertThatThrownBy(() -> service.validarCupom("ABC12345", 999L))
                .isInstanceOf(SecurityException.class)
                .hasMessageContaining("não pertence");
    }

    @Test
    void validarCupom_inexistente_lancaEntityNotFoundException() {
        when(transacaoRepository.findByCodigoCupom("XXXXXXXX")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validarCupom("XXXXXXXX", EMPRESA_ID))
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
        t.setData(LocalDateTime.now());

        when(transacaoRepository.findByCodigoCupom("ABC12345")).thenReturn(Optional.of(t));
        when(transacaoRepository.save(any(Transacao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CupomValidacaoDTO dto = service.utilizarCupom("ABC12345", EMPRESA_ID);

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

        assertThatThrownBy(() -> service.utilizarCupom("ABC12345", EMPRESA_ID))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cupom")
                .hasMessageContaining("pendente");

        verify(transacaoRepository, never()).save(any());
    }
}
