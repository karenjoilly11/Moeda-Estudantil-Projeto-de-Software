package com.moedaestudantil.api.dto.event;

public record EmailResgateAlunoEvent(

        String alunoNome,

        String alunoEmail,

        String vantagemNome,

        String codigoCupom,

        Double custoMoedas,

        Double saldoRestante,

        String empresaNome

) {}