package com.moedaestudantil.api.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String RECEBIMENTO_QUEUE     = "email.recebimento.queue";
    public static final String ENVIO_QUEUE           = "email.envio.queue";
    public static final String RESGATE_ALUNO_QUEUE   = "email.resgate.aluno.queue";
    public static final String RESGATE_EMPRESA_QUEUE = "email.resgate.empresa.queue";
    public static final String DEAD_LETTER_QUEUE     = "email.dead-letter.queue";

    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable(DEAD_LETTER_QUEUE).build();
    }

    @Bean
    public Queue recebimentoQueue() {
        return QueueBuilder.durable(RECEBIMENTO_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", DEAD_LETTER_QUEUE)
                .build();
    }

    @Bean
    public Queue envioQueue() {
        return QueueBuilder.durable(ENVIO_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", DEAD_LETTER_QUEUE)
                .build();
    }

    @Bean
    public Queue resgateAlunoQueue() {
        return QueueBuilder.durable(RESGATE_ALUNO_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", DEAD_LETTER_QUEUE)
                .build();
    }

    @Bean
    public Queue resgateEmpresaQueue() {
        return QueueBuilder.durable(RESGATE_EMPRESA_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", DEAD_LETTER_QUEUE)
                .build();
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}