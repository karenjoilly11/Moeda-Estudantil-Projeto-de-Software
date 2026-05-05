package com.moedaestudantil.api.repositories;

import com.moedaestudantil.api.entities.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByAlunoId(Long alunoId);
    List<Transacao> findByProfessorId(Long professorId);
    List<Transacao> findByAlunoIdOrderByDataDesc(Long alunoId);
    Optional<Transacao> findByCodigoCupom(String codigoCupom);
}