package com.emailservice.consumer;

import com.emailservice.config.RabbitMQConfig;
import com.emailservice.dto.EmailResgateEmpresaEvent;
import com.emailservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResgateEmpresaConsumer {

    private final EmailService emailService;

    @RabbitListener(
            queues = RabbitMQConfig.RESGATE_EMPRESA_QUEUE
    )
    public void consumir(
            EmailResgateEmpresaEvent event
    ) {

        log.info(
                "Consumindo resgate empresa para {}",
                event.empresaEmail()
        );

        emailService
                .enviarResgateEmpresa(event);
    }
}