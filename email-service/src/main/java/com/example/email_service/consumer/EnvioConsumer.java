package com.emailservice.consumer;

import com.emailservice.config.RabbitMQConfig;
import com.emailservice.dto.EmailEnvioMoedaEvent;
import com.emailservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EnvioConsumer {

    private final EmailService emailService;

    @RabbitListener(
            queues = RabbitMQConfig.ENVIO_QUEUE
    )
    public void consumir(
            EmailEnvioMoedaEvent event
    ) {

        log.info(
                "Consumindo confirmação para {}",
                event.professorEmail()
        );

        emailService
                .enviarConfirmacaoEnvio(event);
    }
}