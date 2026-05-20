package com.moedaestudantil.api.listeners;

import com.moedaestudantil.api.dto.event.EmailEnvioMoedaEvent;
import com.moedaestudantil.api.dto.event.EmailRecebimentoMoedaEvent;
import com.moedaestudantil.api.dto.event.EmailResgateAlunoEvent;
import com.moedaestudantil.api.dto.event.EmailResgateEmpresaEvent;
import com.moedaestudantil.api.services.EmailProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Escuta eventos de email publicados via ApplicationEventPublisher dentro
 * de uma transação. Só publica no RabbitMQ APÓS o commit — garante que a
 * transação de banco já foi persistida antes de notificar o consumidor.
 *
 * EmailProducerService internamente já captura AmqpException, então broker
 * offline não derruba nada — apenas loga warning.
 */
@Component
@RequiredArgsConstructor
public class EmailEventListener {

    private final EmailProducerService emailProducerService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onRecebimento(EmailRecebimentoMoedaEvent event) {
        emailProducerService.publicarRecebimento(event);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onEnvio(EmailEnvioMoedaEvent event) {
        emailProducerService.publicarEnvio(event);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onResgateAluno(EmailResgateAlunoEvent event) {
        emailProducerService.publicarResgateAluno(event);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onResgateEmpresa(EmailResgateEmpresaEvent event) {
        emailProducerService.publicarResgateEmpresa(event);
    }
}
