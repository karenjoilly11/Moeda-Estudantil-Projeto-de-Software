package com.moedaestudantil.api.repositories;

import com.moedaestudantil.api.entities.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Optional<Aluno> findByEmail(String email);
    Optional<Aluno> findByCpf(String cpf);
    boolean existsByEmail(String email);
}
