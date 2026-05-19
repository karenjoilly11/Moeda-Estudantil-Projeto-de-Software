package com.emailservice.consumer;

import com.emailservice.dto.EmailRecebimentoMoedaEvent;
import com.emailservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailConsumer {

    private final EmailService emailService;

    @RabbitListener(queues = "email.queue")
    public void consumir(
            EmailRecebimentoMoedaEvent event
    ) {

        log.info(
                "Mensagem recebida para {}",
                event.alunoEmail()
        );

        emailService
                .enviarRecebimentoMoeda(event);
    }
}