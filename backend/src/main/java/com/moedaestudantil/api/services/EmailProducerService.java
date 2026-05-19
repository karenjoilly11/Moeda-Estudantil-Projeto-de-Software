package com.moedaestudantil.api.services;

import com.moedaestudantil.api.config.RabbitMQConfig;
import com.moedaestudantil.api.dto.event.EmailRecebimentoMoedaEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailProducerService {

    private final RabbitTemplate rabbitTemplate;

    public void enviarEmailRecebimento(
            EmailRecebimentoMoedaEvent event
    ) {

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EMAIL_EXCHANGE,
                RabbitMQConfig.EMAIL_ROUTING_KEY,
                event
        );

        log.info(
                "Evento de email enviado para fila: {}",
                event.alunoEmail()
        );
    }
}