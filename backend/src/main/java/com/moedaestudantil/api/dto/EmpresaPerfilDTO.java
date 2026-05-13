package com.moedaestudantil.api.dto;

import lombok.Data;

@Data
public class EmpresaPerfilDTO {
    private String nome;
    private String email;
    private String telefone;
    private String endereco;
    private String descricao;
}