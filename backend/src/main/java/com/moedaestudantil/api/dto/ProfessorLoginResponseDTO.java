package com.moedaestudantil.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfessorLoginResponseDTO {
    private String token;
    private ProfessorResponseDTO professor;
}
