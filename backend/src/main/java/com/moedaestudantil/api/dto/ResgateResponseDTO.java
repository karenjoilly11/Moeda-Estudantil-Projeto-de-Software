package com.moedaestudantil.api.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResgateResponseDTO {
    private String codigoCupom;
    private String vantagemNome;
    private Double custoMoedas;
    private Double saldoRestante;
    private LocalDateTime dataResgate;
}
