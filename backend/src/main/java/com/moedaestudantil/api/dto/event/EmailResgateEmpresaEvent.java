package com.moedaestudantil.api.dto.event;

public record EmailResgateEmpresaEvent(

        String empresaNome,

        String empresaEmail,

        String alunoNome,

        String alunoEmail,

        String vantagemNome,

        String codigoCupom,

        Double custoMoedas

) {}