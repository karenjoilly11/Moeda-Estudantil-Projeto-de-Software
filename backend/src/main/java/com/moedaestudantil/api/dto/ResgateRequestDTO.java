package com.moedaestudantil.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResgateRequestDTO {

    @NotNull
    private Long alunoId;

    @NotNull
    private Long vantagemId;
}
