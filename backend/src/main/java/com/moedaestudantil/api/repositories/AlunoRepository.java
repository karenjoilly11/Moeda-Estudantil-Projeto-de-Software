package com.moedaestudantil.api.repositories;

import com.moedaestudantil.api.entities.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    List<Aluno> findByInstituicaoId(Long instituicaoId);
    Optional<Aluno> findByEmail(String email);
    Optional<Aluno> findByCpf(String cpf);
    boolean existsByEmail(String email);
    List<Aluno> findByInstituicaoIdAndNomeContainingIgnoreCase(Long instituicaoId, String nome);
    
}
