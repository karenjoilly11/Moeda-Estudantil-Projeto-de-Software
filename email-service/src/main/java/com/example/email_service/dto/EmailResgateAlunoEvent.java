package com.example.email_service.dto;

public record EmailResgateAlunoEvent(
    String alunoEmail,
    String alunoNome,
    String vantagemNome,
    String codigoCupom,
    Integer custoMoedas,
    Integer saldoRestante,
    String empresaNome
) {}