package com.emailservice.service;

import com.emailservice.dto.EmailEnvioMoedaEvent;
import com.emailservice.dto.EmailRecebimentoMoedaEvent;
import com.emailservice.dto.EmailResgateAlunoEvent;
import com.emailservice.dto.EmailResgateEmpresaEvent;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    private final TemplateEngine templateEngine;

    @Value("${app.email.from}")
    private String from;

    // =========================================================
    // RECEBIMENTO DE MOEDAS
    // =========================================================

    public void enviarRecebimentoMoeda(
            EmailRecebimentoMoedaEvent event
    ) {

        Context ctx = new Context();

        ctx.setVariable(
                "alunoNome",
                event.alunoNome()
        );

        ctx.setVariable(
                "professorNome",
                event.professorNome()
        );

        ctx.setVariable(
                "valor",
                event.valor()
        );

        ctx.setVariable(
                "mensagem",
                event.mensagem()
        );

        String html =
                templateEngine.process(
                        "email-recebimento-moeda",
                        ctx
                );

        enviarHtml(
                event.alunoEmail(),
                "Você recebeu moedas estudantis!",
                html
        );
    }

    // =========================================================
    // ENVIO CONFIRMADO PROFESSOR
    // =========================================================

    public void enviarConfirmacaoEnvio(
            EmailEnvioMoedaEvent event
    ) {

        Context ctx = new Context();

        ctx.setVariable(
                "professorNome",
                event.professorNome()
        );

        ctx.setVariable(
                "alunoNome",
                event.alunoNome()
        );

        ctx.setVariable(
                "valor",
                event.valor()
        );

        ctx.setVariable(
                "mensagem",
                event.mensagem()
        );

        ctx.setVariable(
                "saldoRestante",
                event.saldoRestante()
        );

        String html =
                templateEngine.process(
                        "email-envio-moeda",
                        ctx
                );

        enviarHtml(
                event.professorEmail(),
                "Confirmação de envio de moedas",
                html
        );
    }

    // =========================================================
    // RESGATE ALUNO
    // =========================================================

    public void enviarResgateAluno(
            EmailResgateAlunoEvent event
    ) {

        Context ctx = new Context();

        ctx.setVariable(
                "alunoNome",
                event.alunoNome()
        );

        ctx.setVariable(
                "vantagemNome",
                event.vantagemNome()
        );

        ctx.setVariable(
                "codigoCupom",
                event.codigoCupom()
        );

        ctx.setVariable(
                "custoMoedas",
                event.custoMoedas()
        );

        ctx.setVariable(
                "saldoRestante",
                event.saldoRestante()
        );

        ctx.setVariable(
                "empresaNome",
                event.empresaNome()
        );

        String html =
                templateEngine.process(
                        "email-resgate-aluno",
                        ctx
                );

        enviarHtml(
                event.alunoEmail(),
                "Seu cupom de resgate",
                html
        );
    }

    // =========================================================
    // RESGATE EMPRESA
    // =========================================================

    public void enviarResgateEmpresa(
            EmailResgateEmpresaEvent event
    ) {

        Context ctx = new Context();

        ctx.setVariable(
                "empresaNome",
                event.empresaNome()
        );

        ctx.setVariable(
                "alunoNome",
                event.alunoNome()
        );

        ctx.setVariable(
                "alunoEmail",
                event.alunoEmail()
        );

        ctx.setVariable(
                "vantagemNome",
                event.vantagemNome()
        );

        ctx.setVariable(
                "codigoCupom",
                event.codigoCupom()
        );

        ctx.setVariable(
                "custoMoedas",
                event.custoMoedas()
        );

        String html =
                templateEngine.process(
                        "email-resgate-empresa",
                        ctx
                );

        enviarHtml(
                event.empresaEmail(),
                "Novo resgate de cupom",
                html
        );
    }

    // =========================================================
    // MÉTODO BASE SMTP
    // =========================================================

    private void enviarHtml(
            String para,
            String assunto,
            String html
    ) {

        try {

            MimeMessage mime =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mime,
                            true,
                            StandardCharsets.UTF_8.name()
                    );

            helper.setFrom(from);

            helper.setTo(para);

            helper.setSubject(assunto);

            helper.setText(html, true);

            mailSender.send(mime);

            log.info(
                    "Email enviado para {}",
                    para
            );

        } catch (Exception e) {

            log.error(
                    "Erro ao enviar email: {}",
                    e.getMessage()
            );

            throw new RuntimeException(e);
        }
    }
}