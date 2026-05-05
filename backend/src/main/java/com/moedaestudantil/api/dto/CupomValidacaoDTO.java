package com.moedaestudantil.api.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CupomValidacaoDTO {
    private String codigoCupom;
    private String alunoNome;
    private String vantagemNome;
    private Double custoMoedas;
    private String status;
    private LocalDateTime dataResgate;
}
