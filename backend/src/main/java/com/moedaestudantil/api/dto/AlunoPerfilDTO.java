package com.moedaestudantil.api.dto;

import lombok.Data;

@Data
public class AlunoPerfilDTO {
    private String nome;
    private String email;
    private String endereco;
    private String curso;
}