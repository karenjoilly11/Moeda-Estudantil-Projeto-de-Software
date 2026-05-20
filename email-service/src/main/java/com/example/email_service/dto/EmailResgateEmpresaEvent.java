package com.example.email_service.dto;

public record EmailResgateEmpresaEvent(
    String empresaEmail,
    String empresaNome,
    String alunoNome,
    String alunoEmail,
    String vantagemNome,
    String codigoCupom,
    Integer custoMoedas
) {}