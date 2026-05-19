package com.emailservice.consumer;

import com.emailservice.config.RabbitMQConfig;
import com.emailservice.dto.EmailRecebimentoMoedaEvent;
import com.emailservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RecebimentoConsumer {

    private final EmailService emailService;

    @RabbitListener(
            queues = RabbitMQConfig.RECEBIMENTO_QUEUE
    )
    public void consumir(
            EmailRecebimentoMoedaEvent event
    ) {

        log.info(
                "Consumindo email de recebimento para {}",
                event.alunoEmail()
        );

        emailService
                .enviarRecebimentoMoeda(event);
    }
}