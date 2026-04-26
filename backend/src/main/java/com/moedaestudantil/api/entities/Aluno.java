package com.moedaestudantil.api.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "alunos")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
public class Aluno extends Usuario {
    
    @Column(nullable = false, unique = true, length = 14)
    private String cpf;
    
    @Column(nullable = false, length = 12)
    private String rg;
    
    @Column(nullable = false, length = 255)
    private String endereco;
    
    @Column(nullable = false, length = 100)
    private String curso;
    
    @Column(nullable = false)
    private Double saldoMoedas = 0.0;
}
