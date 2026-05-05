package com.moedaestudantil.api.dto;

import com.moedaestudantil.api.enums.TipoTransacao;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransacaoResponseDTO {
    private Long id;
    private LocalDateTime data;
    private TipoTransacao tipo;
    private Double valor;
    private String mensagem;
    private String alunoNome;
    private String professorNome;
    private String codigoCupom;
    private String status;
}
