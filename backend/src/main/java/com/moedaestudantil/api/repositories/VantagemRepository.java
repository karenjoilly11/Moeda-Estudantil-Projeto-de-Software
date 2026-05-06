package com.moedaestudantil.api.repositories;

import com.moedaestudantil.api.entities.Vantagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VantagemRepository extends JpaRepository<Vantagem, Long> {
    List<Vantagem> findByEmpresaIdOrderByCustoMoedasAsc(Long empresaId);
}
