package com.moedaestudantil.api.dto;

import lombok.Data;

@Data
public class ProfessorResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String departamento;
    private String instituicaoNome;
    private Double saldoMoedas;
}
