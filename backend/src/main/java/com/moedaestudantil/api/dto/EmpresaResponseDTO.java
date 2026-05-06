package com.moedaestudantil.api.dto;

import lombok.Data;

@Data
public class EmpresaResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String cnpj;
    private String descricao;
    private String instituicaoNome;
}
