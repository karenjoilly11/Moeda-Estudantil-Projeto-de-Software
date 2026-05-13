package com.moedaestudantil.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnvioMoedasResponseDTO {
    private Long transacaoId;
    private String alunoNome;
    private Double valor;
    private Double saldoRestanteProfessor;
    private String dataEnvio;
}
