package com.moedaestudantil.api.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EMAIL_QUEUE = "email.queue";

    public static final String EMAIL_EXCHANGE = "email.exchange";

    public static final String EMAIL_ROUTING_KEY = "email.routing-key";

    @Bean
    public Queue emailQueue() {
        return QueueBuilder
                .durable(EMAIL_QUEUE)
                .build();
    }

    @Bean
    public DirectExchange emailExchange() {
        return new DirectExchange(EMAIL_EXCHANGE);
    }

    @Bean
    public Binding emailBinding(
            Queue emailQueue,
            DirectExchange emailExchange
    ) {

        return BindingBuilder
                .bind(emailQueue)
                .to(emailExchange)
                .with(EMAIL_ROUTING_KEY);
    }
}