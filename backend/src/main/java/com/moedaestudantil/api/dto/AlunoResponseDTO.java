package com.moedaestudantil.api.dto;

import lombok.Data;

@Data
public class AlunoResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String curso;
    private String instituicaoNome;
    private Double saldoMoedas;
}
