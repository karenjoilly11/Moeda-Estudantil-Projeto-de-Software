package com.moedaestudantil.api.services;

import com.moedaestudantil.api.config.RabbitMQConfig;
import com.moedaestudantil.api.dto.event.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailProducerService {

    private final RabbitTemplate rabbitTemplate;

    // =====================================================
    // RECEBIMENTO
    // =====================================================

    public void publicarRecebimento(
            EmailRecebimentoMoedaEvent event
    ) {

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.RECEBIMENTO_QUEUE,
                event
        );

        log.info(
                "Evento recebimento enviado para {}",
                event.alunoEmail()
        );
    }

    // =====================================================
    // ENVIO
    // =====================================================

    public void publicarEnvio(
            EmailEnvioMoedaEvent event
    ) {

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ENVIO_QUEUE,
                event
        );

        log.info(
                "Evento envio enviado para {}",
                event.professorEmail()
        );
    }

    // =====================================================
    // RESGATE ALUNO
    // =====================================================

    public void publicarResgateAluno(
            EmailResgateAlunoEvent event
    ) {

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.RESGATE_ALUNO_QUEUE,
                event
        );

        log.info(
                "Evento resgate aluno enviado para {}",
                event.alunoEmail()
        );
    }

    // =====================================================
    // RESGATE EMPRESA
    // =====================================================

    public void publicarResgateEmpresa(
            EmailResgateEmpresaEvent event
    ) {

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.RESGATE_EMPRESA_QUEUE,
                event
        );

        log.info(
                "Evento resgate empresa enviado para {}",
                event.empresaEmail()
        );
    }
}