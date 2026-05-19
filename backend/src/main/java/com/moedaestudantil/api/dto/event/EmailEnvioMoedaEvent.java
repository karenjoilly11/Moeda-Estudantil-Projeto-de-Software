package com.moedaestudantil.api.dto.event;

public record EmailEnvioMoedaEvent(

        String professorNome,

        String professorEmail,

        String alunoNome,

        Double valor,

        String mensagem,

        Double saldoRestante

) {}