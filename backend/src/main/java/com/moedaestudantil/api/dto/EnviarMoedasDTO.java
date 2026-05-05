package com.moedaestudantil.api.dto;

import lombok.Data;

@Data
public class EnviarMoedasDTO {
    private Long alunoId;
    private Double valor;
    private String mensagem;  
}