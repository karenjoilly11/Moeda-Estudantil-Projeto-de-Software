package com.moedaestudantil.api.dto.event;

public record EmailRecebimentoMoedaEvent(

        String alunoNome,
        String alunoEmail,

        String professorNome,

        Double valor,

        String mensagem

) {}