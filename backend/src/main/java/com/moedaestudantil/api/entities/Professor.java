package com.moedaestudantil.api.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "professores")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
public class Professor extends Usuario {
    
    @Column(nullable = false, unique = true, length = 14)
    private String cpf;
    
    @Column(nullable = false, length = 100)
    private String departamento;
    
    @Column(nullable = false)
    private Double saldoMoedas = 1000.0; // 1000 moedas por semestre
}
