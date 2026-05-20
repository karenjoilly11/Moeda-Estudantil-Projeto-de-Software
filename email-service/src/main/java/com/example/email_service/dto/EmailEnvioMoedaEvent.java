package com.example.email_service.dto;

public record EmailEnvioMoedaEvent(

        String professorNome,

        String professorEmail,

        String alunoNome,

        Double valor,

        String mensagem,

        Double saldoRestante

) {}