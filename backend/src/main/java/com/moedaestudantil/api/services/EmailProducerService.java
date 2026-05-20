package com.moedaestudantil.api.services;

import com.moedaestudantil.api.config.RabbitMQConfig;
import com.moedaestudantil.api.dto.event.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
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

        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.RECEBIMENTO_QUEUE,
                    event
            );

            log.info(
                    "Evento recebimento enviado para {}",
                    event.alunoEmail()
            );
        } catch (AmqpException e) {
            log.warn(
                    "Falha ao publicar evento recebimento para {}: {}",
                    event.alunoEmail(),
                    e.getMessage()
            );
        }
    }

    // =====================================================
    // ENVIO
    // =====================================================

    public void publicarEnvio(
            EmailEnvioMoedaEvent event
    ) {

        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.ENVIO_QUEUE,
                    event
            );

            log.info(
                    "Evento envio enviado para {}",
                    event.professorEmail()
            );
        } catch (AmqpException e) {
            log.warn(
                    "Falha ao publicar evento envio para {}: {}",
                    event.professorEmail(),
                    e.getMessage()
            );
        }
    }

    // =====================================================
    // RESGATE ALUNO
    // =====================================================

    public void publicarResgateAluno(
            EmailResgateAlunoEvent event
    ) {

        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.RESGATE_ALUNO_QUEUE,
                    event
            );

            log.info(
                    "Evento resgate aluno enviado para {}",
                    event.alunoEmail()
            );
        } catch (AmqpException e) {
            log.warn(
                    "Falha ao publicar evento resgate aluno para {}: {}",
                    event.alunoEmail(),
                    e.getMessage()
            );
        }
    }

    // =====================================================
    // RESGATE EMPRESA
    // =====================================================

    public void publicarResgateEmpresa(
            EmailResgateEmpresaEvent event
    ) {

        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.RESGATE_EMPRESA_QUEUE,
                    event
            );

            log.info(
                    "Evento resgate empresa enviado para {}",
                    event.empresaEmail()
            );
        } catch (AmqpException e) {
            log.warn(
                    "Falha ao publicar evento resgate empresa para {}: {}",
                    event.empresaEmail(),
                    e.getMessage()
            );
        }
    }
}