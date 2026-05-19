package com.emailservice.dto;

public record EmailEnvioMoedaEvent(

        String professorNome,

        String professorEmail,

        String alunoNome,

        Double valor,

        String mensagem,

        Double saldoRestante

) {}