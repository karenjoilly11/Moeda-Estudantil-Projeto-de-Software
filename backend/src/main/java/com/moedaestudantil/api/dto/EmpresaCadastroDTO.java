package com.moedaestudantil.api.dto;

import lombok.Data;

@Data
public class EmpresaCadastroDTO {
    private String nome;
    private String email;
    private String cnpj;
    private String descricao;
    private String senha;
    private Long instituicaoId;
}
