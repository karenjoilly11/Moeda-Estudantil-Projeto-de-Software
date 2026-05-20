package com.example.email_service.dto;

public record EmailEnvioMoedaEvent(
    String professorEmail,
    String professorNome,
    String alunoNome,
    Integer valor,
    String mensagem,
    Integer saldoRestante
) {}