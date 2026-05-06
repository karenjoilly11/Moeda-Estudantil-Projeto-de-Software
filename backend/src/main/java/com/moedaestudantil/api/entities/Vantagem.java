package com.moedaestudantil.api.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vantagens")
@Data
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 255)
    private String descricao;

    @Column(nullable = false)
    private String foto;

    @Column(nullable = false)
    private Double custoMoedas;

    @ManyToOne
    @JoinColumn(name = "instituicao_id", nullable = true)
    private Instituicao instituicao;

    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = true)
    private Empresa empresa;
}