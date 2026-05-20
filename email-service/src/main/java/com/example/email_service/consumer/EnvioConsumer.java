package com.example.email_service.consumer;

import com.example.email_service.config.RabbitMQConfig;
import com.example.email_service.dto.EmailEnvioMoedaEvent;
import com.example.email_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EnvioConsumer {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.ENVIO_QUEUE)
    public void consumir(EmailEnvioMoedaEvent event) {
        log.info("Consumindo confirmação de envio para: {}", event.professorEmail());
        emailService.enviarConfirmacaoEnvio(event);
    }
}