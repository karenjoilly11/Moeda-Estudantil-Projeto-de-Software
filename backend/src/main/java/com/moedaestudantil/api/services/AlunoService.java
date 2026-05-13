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
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final InstituicaoRepository instituicaoRepository;

    public AlunoResponseDTO cadastrar(AlunoCadastroDTO dto) {
        // Verificar se email já existe
        if (alunoRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado!");
        }

        // Buscar instituição
        Instituicao instituicao = instituicaoRepository.findById(dto.getInstituicaoId())
                .orElseThrow(() -> new RuntimeException("Instituição não encontrada!"));

        // Criar aluno
        Aluno aluno = new Aluno();
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setSenha(Base64.getEncoder().encodeToString(dto.getSenha().getBytes())); // SIMPLES - use BCrypt em
                                                                                       // produção
        aluno.setTipo(TipoUsuario.ALUNO);
        aluno.setInstituicao(instituicao);
        aluno.setCpf(dto.getCpf());
        aluno.setRg(dto.getRg());
        aluno.setEndereco(dto.getEndereco());
        aluno.setCurso(dto.getCurso());
        aluno.setSaldoMoedas(0.0);

        Aluno salvo = alunoRepository.save(aluno);

        return toResponseDTO(salvo);
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Aluno aluno = alunoRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos!"));

        String senhaCodificada = Base64.getEncoder().encodeToString(dto.getSenha().getBytes());
        if (!aluno.getSenha().equals(senhaCodificada)) {
            throw new RuntimeException("Email ou senha inválidos!");
        }

        String token = Base64.getEncoder().encodeToString(
                (aluno.getEmail() + ":" + System.currentTimeMillis()).getBytes());

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
        System.out.println("🔍 Buscando aluno com ID: " + alunoId);

        // Deve encontrar o aluno com o ID que veio do frontend
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(
                        () -> new RuntimeException("Aluno com ID " + alunoId + " não encontrado no banco de dados"));

        System.out.println("✅ Aluno encontrado: " + aluno.getNome() + " (ID: " + aluno.getId() + ")");

        // Atualiza os dados
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setEndereco(dto.getEndereco() != null ? dto.getEndereco() : "");
        aluno.setCurso(dto.getCurso());

        Aluno atualizado = alunoRepository.save(aluno);
        System.out.println("✅ Perfil atualizado com sucesso!");

        return toResponseDTO(atualizado);
    }

    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        return toResponseDTO(aluno);
    }

    @Transactional // 🆕 Adicione esta anotação
    public void excluirConta(Long id) {
        System.out.println("🔍 Verificando existência do aluno ID: " + id);
        
        Aluno aluno = alunoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        System.out.println("🗑️ Excluindo aluno: " + aluno.getNome());
        
        alunoRepository.delete(aluno);
        System.out.println("✅ Aluno excluído com sucesso!");
    }
}
