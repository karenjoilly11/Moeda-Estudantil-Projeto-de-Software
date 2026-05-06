package com.moedaestudantil.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmpresaLoginResponseDTO {
    private String token;
    private EmpresaResponseDTO empresa;
}
