package com.emailservice.dto;

public record EmailRecebimentoMoedaEvent(

        String alunoNome,

        String alunoEmail,

        String professorNome,

        Double valor,

        String mensagem

) {}