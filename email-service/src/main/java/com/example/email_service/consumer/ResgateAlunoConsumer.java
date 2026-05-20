package com.example.email_service.consumer;

import com.example.email_service.config.RabbitMQConfig;
import com.example.email_service.dto.EmailResgateAlunoEvent;
import com.example.email_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResgateAlunoConsumer {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.RESGATE_ALUNO_QUEUE)
    public void consumir(EmailResgateAlunoEvent event) {
        log.info("Consumindo resgate aluno para: {}", event.alunoEmail());
        emailService.enviarResgateAluno(event);
    }
}