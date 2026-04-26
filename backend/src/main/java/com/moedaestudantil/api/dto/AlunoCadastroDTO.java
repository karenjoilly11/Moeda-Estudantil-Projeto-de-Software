package com.moedaestudantil.api.dto;

import lombok.Data;

@Data
public class AlunoCadastroDTO {
    private String nome;
    private String email;
    private String cpf;
    private String rg;
    private String endereco;
    private Long instituicaoId;
    private String curso;
    private String senha;
}
