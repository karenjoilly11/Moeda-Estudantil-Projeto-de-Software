package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.AlunoCadastroDTO;
import com.moedaestudantil.api.dto.AlunoResponseDTO;
import com.moedaestudantil.api.dto.LoginRequestDTO;
import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Instituicao;
import com.moedaestudantil.api.repositories.AlunoRepository;
import com.moedaestudantil.api.repositories.InstituicaoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlunoServiceTest {

    @Mock private AlunoRepository alunoRepository;
    @Mock private InstituicaoRepository instituicaoRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AlunoService service;

    private AlunoCadastroDTO validDto() {
        AlunoCadastroDTO dto = new AlunoCadastroDTO();
        dto.setNome("Joao Aluno");
        dto.setEmail("joao@aluno.com");
        dto.setCpf("11122233344");
        dto.setRg("MG123456");
        dto.setEndereco("Rua X, 1");
        dto.setInstituicaoId(1L);
        dto.setCurso("Eng");
        dto.setSenha("123456");
        return dto;
    }

    @Test
    void cadastrar_dadosValidos_criaAlunoComSaldoZeroESenhaCodificada() {
        Instituicao inst = new Instituicao(1L, "PUC", "endereco", "tel");
        when(alunoRepository.existsByEmail("joao@aluno.com")).thenReturn(false);
        when(instituicaoRepository.findById(1L)).thenReturn(Optional.of(inst));
        when(passwordEncoder.encode("123456")).thenReturn("$2a$10$hash-fake");
        when(alunoRepository.save(any(Aluno.class))).thenAnswer(inv -> {
            Aluno a = inv.getArgument(0);
            a.setId(7L);
            return a;
        });

        AlunoResponseDTO resp = service.cadastrar(validDto());

        assertThat(resp.getId()).isEqualTo(7L);
        assertThat(resp.getNome()).isEqualTo("Joao Aluno");
        assertThat(resp.getSaldoMoedas()).isEqualTo(0.0);
        assertThat(resp.getInstituicaoNome()).isEqualTo("PUC");

        verify(alunoRepository).save(argThat(a ->
                "$2a$10$hash-fake".equals(a.getSenha()) && a.getSaldoMoedas().equals(0.0)
        ));
    }

    @Test
    void cadastrar_emailDuplicado_lancaErro() {
        when(alunoRepository.existsByEmail("joao@aluno.com")).thenReturn(true);

        assertThatThrownBy(() -> service.cadastrar(validDto()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContainingAll("Email", "cadastrado");

        verify(alunoRepository, never()).save(any());
    }

    @Test
    void login_credenciaisIncorretas_lancaErro() {
        Aluno a = new Aluno();
        a.setEmail("joao@aluno.com");
        a.setSenha("$2a$10$hash-correto");

        when(alunoRepository.findByEmail("joao@aluno.com")).thenReturn(Optional.of(a));
        when(passwordEncoder.matches("senha-errada", "$2a$10$hash-correto")).thenReturn(false);

        LoginRequestDTO dto = new LoginRequestDTO();
        dto.setEmail("joao@aluno.com");
        dto.setSenha("senha-errada");

        assertThatThrownBy(() -> service.login(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("inv");
    }
}
