package com.moedaestudantil.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransacaoDTO {
    private Long id;
    private String alunoNome;
    private String professorNome;
    private Double valor;
    private String tipo;
    private String mensagem;
    private LocalDateTime data;
    private String codigoCupom;
}