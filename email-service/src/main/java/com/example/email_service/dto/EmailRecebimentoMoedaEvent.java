package com.example.email_service.dto;

public record EmailRecebimentoMoedaEvent(
    String alunoEmail,
    String alunoNome,
    String professorNome,
    Integer valor,
    String mensagem
) {}