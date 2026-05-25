package com.example.email_service.dto;

public record EmailEnvioMoedaEvent(
    String professorEmail,
    String professorNome,
    String alunoNome,
    Double valor,
    String mensagem,
    Double saldoRestante
) {}