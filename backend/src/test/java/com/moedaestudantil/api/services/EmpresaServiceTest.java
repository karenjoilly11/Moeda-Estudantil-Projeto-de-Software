package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.EmpresaCadastroDTO;
import com.moedaestudantil.api.dto.EmpresaLoginResponseDTO;
import com.moedaestudantil.api.dto.EmpresaResponseDTO;
import com.moedaestudantil.api.dto.LoginRequestDTO;
import com.moedaestudantil.api.entities.Empresa;
import com.moedaestudantil.api.repositories.EmpresaRepository;
import com.moedaestudantil.api.repositories.InstituicaoRepository;
import com.moedaestudantil.api.util.TokenUtil;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmpresaServiceTest {

    @Mock private EmpresaRepository empresaRepository;
    @Mock private InstituicaoRepository instituicaoRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmpresaService service;

    @BeforeAll
    static void initTokenUtil() {
        // Inicializa a signing key estática do TokenUtil pra que os logins consigam gerar JWT.
        String secret = "test-secret-com-pelo-menos-32-bytes-aqui-xx";
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        ReflectionTestUtils.setField(TokenUtil.class, "signingKey", key);
        ReflectionTestUtils.setField(TokenUtil.class, "expirationMs", 8L * 3600_000L);
    }

    private EmpresaCadastroDTO validDto() {
        EmpresaCadastroDTO dto = new EmpresaCadastroDTO();
        dto.setNome("Livraria X");
        dto.setEmail("contato@livraria.com");
        dto.setCnpj("12.345.678/0001-99");
        dto.setSenha("senha123");
        dto.setDescricao("loja teste");
        return dto;
    }

    @Test
    void cadastrar_dadosValidos_persisteEMudaSenhaParaHash() {
        when(empresaRepository.existsByEmail("contato@livraria.com")).thenReturn(false);
        when(empresaRepository.existsByCnpj("12.345.678/0001-99")).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("$2a$10$hash-fake");
        when(empresaRepository.save(any(Empresa.class))).thenAnswer(inv -> {
            Empresa e = inv.getArgument(0);
            e.setId(5L);
            return e;
        });

        EmpresaResponseDTO resp = service.cadastrar(validDto());

        assertThat(resp.getId()).isEqualTo(5L);
        assertThat(resp.getNome()).isEqualTo("Livraria X");
        assertThat(resp.getCnpj()).isEqualTo("12.345.678/0001-99");

        verify(empresaRepository).save(argThat(e -> "$2a$10$hash-fake".equals(e.getSenha())));
    }

    @Test
    void cadastrar_emailDuplicado_lancaErro() {
        when(empresaRepository.existsByEmail("contato@livraria.com")).thenReturn(true);

        assertThatThrownBy(() -> service.cadastrar(validDto()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContainingAll("Email", "cadastrado");

        verify(empresaRepository, never()).save(any());
    }

    @Test
    void login_credenciaisCorretas_retornaToken() {
        Empresa e = new Empresa();
        e.setId(5L);
        e.setNome("Livraria X");
        e.setEmail("contato@livraria.com");
        e.setCnpj("12.345.678/0001-99");
        e.setSenha("$2a$10$hash-correto");

        when(empresaRepository.findByEmail("contato@livraria.com")).thenReturn(Optional.of(e));
        when(passwordEncoder.matches("senha123", "$2a$10$hash-correto")).thenReturn(true);

        LoginRequestDTO dto = new LoginRequestDTO();
        dto.setEmail("contato@livraria.com");
        dto.setSenha("senha123");

        EmpresaLoginResponseDTO resp = service.login(dto);

        assertThat(resp.getToken()).isNotBlank();
        assertThat(resp.getEmpresa()).isNotNull();
        assertThat(resp.getEmpresa().getId()).isEqualTo(5L);
        assertThat(resp.getEmpresa().getEmail()).isEqualTo("contato@livraria.com");
    }
}
