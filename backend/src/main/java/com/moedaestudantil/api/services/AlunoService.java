package com.moedaestudantil.api.services;

import com.moedaestudantil.api.dto.AlunoCadastroDTO;
import com.moedaestudantil.api.dto.AlunoPerfilDTO;
import com.moedaestudantil.api.dto.AlunoResponseDTO;
import com.moedaestudantil.api.dto.LoginRequestDTO;
import com.moedaestudantil.api.dto.LoginResponseDTO;
import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Instituicao;
import com.moedaestudantil.api.enums.TipoUsuario;
import com.moedaestudantil.api.repositories.AlunoRepository;
import com.moedaestudantil.api.repositories.InstituicaoRepository;
import com.moedaestudantil.api.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final PasswordEncoder passwordEncoder;

    public AlunoResponseDTO cadastrar(AlunoCadastroDTO dto) {
        if (alunoRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado!");
        }

        Instituicao instituicao = instituicaoRepository.findById(dto.getInstituicaoId())
                .orElseThrow(() -> new RuntimeException("Instituição não encontrada!"));

        Aluno aluno = new Aluno();
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setSenha(passwordEncoder.encode(dto.getSenha()));
        aluno.setTipo(TipoUsuario.ALUNO);
        aluno.setInstituicao(instituicao);
        aluno.setCpf(dto.getCpf());
        aluno.setRg(dto.getRg());
        aluno.setEndereco(dto.getEndereco());
        aluno.setCurso(dto.getCurso());
        aluno.setSaldoMoedas(0.0);

        try {
            Aluno salvo = alunoRepository.save(aluno);
            return toResponseDTO(salvo);
        } catch (DataIntegrityViolationException e) {
            String causa = e.getMostSpecificCause() != null ? e.getMostSpecificCause().getMessage() : "";
            if (causa != null && causa.toLowerCase().contains("cpf")) {
                throw new RuntimeException("CPF já cadastrado");
            }
            if (causa != null && causa.toLowerCase().contains("email")) {
                throw new RuntimeException("Email já cadastrado");
            }
            throw new RuntimeException("Dados inválidos ou já existentes");
        }
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Aluno aluno = alunoRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos!"));

        if (!passwordEncoder.matches(dto.getSenha(), aluno.getSenha())) {
            throw new RuntimeException("Email ou senha inválidos!");
        }

        String token = TokenUtil.generate(aluno.getEmail(), TipoUsuario.ALUNO);
        return new LoginResponseDTO(token, toResponseDTO(aluno));
    }

    private AlunoResponseDTO toResponseDTO(Aluno aluno) {
        AlunoResponseDTO dto = new AlunoResponseDTO();
        dto.setId(aluno.getId());
        dto.setNome(aluno.getNome());
        dto.setEmail(aluno.getEmail());
        dto.setEndereco(aluno.getEndereco());
        dto.setCurso(aluno.getCurso());
        dto.setInstituicaoNome(aluno.getInstituicao() != null ? aluno.getInstituicao().getNome() : null);
        dto.setSaldoMoedas(aluno.getSaldoMoedas());
        return dto;
    }

    public AlunoResponseDTO atualizarPerfil(Long alunoId, AlunoPerfilDTO dto) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(
                        () -> new RuntimeException("Aluno com ID " + alunoId + " não encontrado no banco de dados"));

        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setEndereco(dto.getEndereco() != null ? dto.getEndereco() : "");
        aluno.setCurso(dto.getCurso());

        try {
            Aluno atualizado = alunoRepository.save(aluno);
            return toResponseDTO(atualizado);
        } catch (DataIntegrityViolationException e) {
            String causa = e.getMostSpecificCause() != null ? e.getMostSpecificCause().getMessage() : "";
            if (causa != null && causa.toLowerCase().contains("email")) {
                throw new RuntimeException("Email já em uso por outro usuário");
            }
            throw new RuntimeException("Não foi possível atualizar: dados conflitam com outro cadastro");
        }
    }

    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        return toResponseDTO(aluno);
    }

    public Aluno findByEmail(String email) {
        return alunoRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

    @Transactional
    public void alterarSenha(Long alunoId, String senhaAtual, String novaSenha) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        if (!passwordEncoder.matches(senhaAtual, aluno.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        if (novaSenha == null || novaSenha.length() < 4) {
            throw new RuntimeException("Nova senha deve ter pelo menos 4 caracteres");
        }

        aluno.setSenha(passwordEncoder.encode(novaSenha));
        alunoRepository.save(aluno);
    }

    @Transactional
    public void excluirConta(Long id) {
        Aluno aluno = alunoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        alunoRepository.delete(aluno);
    }
}
