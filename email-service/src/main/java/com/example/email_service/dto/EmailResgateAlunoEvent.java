package com.example.email_service.dto;

public record EmailResgateAlunoEvent(
    String alunoEmail,
    String alunoNome,
    String vantagemNome,
    String codigoCupom,
    Double custoMoedas,
    Double saldoRestante,
    String empresaNome
) {}