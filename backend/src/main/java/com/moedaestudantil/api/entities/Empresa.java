package com.moedaestudantil.api.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "empresas")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
public class Empresa extends Usuario {

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(length = 500)
    private String descricao;
}
