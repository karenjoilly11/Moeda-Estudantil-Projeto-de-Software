package com.example.email_service.dto;

public record EmailResgateAlunoEvent(

        String alunoNome,

        String alunoEmail,

        String vantagemNome,

        String codigoCupom,

        Double custoMoedas,

        Double saldoRestante,

        String empresaNome

) {}