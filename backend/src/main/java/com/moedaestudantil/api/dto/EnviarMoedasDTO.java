package com.moedaestudantil.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class EnviarMoedasDTO {
    @NotNull(message = "alunoId é obrigatório")
    private Long alunoId;

    @NotNull(message = "valor é obrigatório")
    @Positive(message = "valor deve ser maior que zero")
    private Double valor;

    @NotBlank(message = "mensagem é obrigatória")
    private String mensagem;
}