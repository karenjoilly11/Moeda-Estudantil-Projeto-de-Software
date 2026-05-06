package com.moedaestudantil.api.repositories;

import com.moedaestudantil.api.entities.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByAlunoId(Long alunoId);
    List<Transacao> findByProfessorId(Long professorId);
    List<Transacao> findByAlunoIdOrderByDataDesc(Long alunoId);
    Optional<Transacao> findByCodigoCupom(String codigoCupom);

    @Query("SELECT t FROM Transacao t " +
           "WHERE t.vantagem.empresa.id = :empresaId " +
           "AND t.tipo = com.moedaestudantil.api.enums.TipoTransacao.RESGATE " +
           "ORDER BY t.data DESC")
    List<Transacao> findCuponsByEmpresaId(@Param("empresaId") Long empresaId);
}