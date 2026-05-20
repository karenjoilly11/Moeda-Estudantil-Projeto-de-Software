package com.example.email_service.dto;

public record EmailResgateEmpresaEvent(

        String empresaNome,

        String empresaEmail,

        String alunoNome,

        String alunoEmail,

        String vantagemNome,

        String codigoCupom,

        Double custoMoedas

) {}