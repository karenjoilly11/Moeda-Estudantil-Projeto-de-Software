package com.moedaestudantil.api.dto;

import lombok.Data;

@Data
public class VantagemResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
    private String foto;
    private Double custoMoedas;
    private String instituicaoNome;
}