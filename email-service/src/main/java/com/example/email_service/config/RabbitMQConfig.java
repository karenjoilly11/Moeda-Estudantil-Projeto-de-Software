package com.emailservice.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String RECEBIMENTO_QUEUE =
            "email.recebimento.queue";

    public static final String ENVIO_QUEUE =
            "email.envio.queue";

    public static final String RESGATE_ALUNO_QUEUE =
            "email.resgate.aluno.queue";

    public static final String RESGATE_EMPRESA_QUEUE =
            "email.resgate.empresa.queue";

    @Bean
    public Queue recebimentoQueue() {
        return QueueBuilder
                .durable(RECEBIMENTO_QUEUE)
                .build();
    }

    @Bean
    public Queue envioQueue() {
        return QueueBuilder
                .durable(ENVIO_QUEUE)
                .build();
    }

    @Bean
    public Queue resgateAlunoQueue() {
        return QueueBuilder
                .durable(RESGATE_ALUNO_QUEUE)
                .build();
    }

    @Bean
    public Queue resgateEmpresaQueue() {
        return QueueBuilder
                .durable(RESGATE_EMPRESA_QUEUE)
                .build();
    }
}