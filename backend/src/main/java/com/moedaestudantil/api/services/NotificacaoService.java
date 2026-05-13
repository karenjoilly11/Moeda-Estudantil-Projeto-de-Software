package com.moedaestudantil.api.services;

import com.moedaestudantil.api.entities.Aluno;
import com.moedaestudantil.api.entities.Empresa;
import com.moedaestudantil.api.entities.Professor;
import com.moedaestudantil.api.entities.Vantagem;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class NotificacaoService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired(required = false)
    private TemplateEngine templateEngine;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${app.email.from:noreply@moedaestudantil.local}")
    private String from;

    // ============================================================
    // ALUNO recebeu moeda (Lab04S01)
    // ============================================================
    public void notificarRecebimentoMoeda(Aluno aluno, Professor professor, Double valor, String mensagem) {
        log.info("[EMAIL→{}] Voce recebeu {} moedas de {}. Motivo: {}",
                aluno.getEmail(), valor, professor.getNome(), mensagem);

        if (!emailEnabled || mailSender == null || templateEngine == null) return;

        try {
            Context ctx = new Context();
            ctx.setVariable("alunoNome", aluno.getNome());
            ctx.setVariable("professorNome", professor.getNome());
            ctx.setVariable("valor", valor);
            ctx.setVariable("mensagem", mensagem != null ? mensagem : "");

            enviarHtml(aluno.getEmail(),
                    "Voce recebeu moedas estudantis!",
                    templateEngine.process("email-recebimento-moeda", ctx));
        } catch (Exception e) {
            log.warn("Falha ao enviar email de recebimento pra {}: {}", aluno.getEmail(), e.getMessage());
        }
    }

    // ============================================================
    // PROFESSOR confirma envio (Lab04S01)
    // ============================================================
    public void notificarEnvioMoeda(Professor professor, Aluno aluno, Double valor, String mensagem, Double saldoRestante) {
        log.info("[EMAIL→{}] Confirmacao: voce enviou {} moedas para {}. Saldo: {}",
                professor.getEmail(), valor, aluno.getNome(), saldoRestante);

        if (!emailEnabled || mailSender == null || templateEngine == null) return;

        try {
            Context ctx = new Context();
            ctx.setVariable("professorNome", professor.getNome());
            ctx.setVariable("alunoNome", aluno.getNome());
            ctx.setVariable("valor", valor);
            ctx.setVariable("mensagem", mensagem != null ? mensagem : "");
            ctx.setVariable("saldoRestante", saldoRestante);

            enviarHtml(professor.getEmail(),
                    "Confirmacao de envio de moedas",
                    templateEngine.process("email-envio-moeda", ctx));
        } catch (Exception e) {
            log.warn("Falha ao enviar email de confirmacao pra {}: {}", professor.getEmail(), e.getMessage());
        }
    }

    // ============================================================
    // ALUNO recebe cupom de resgate (Lab04S03)
    // ============================================================
    public void notificarResgateAluno(Aluno aluno, Vantagem vantagem, String codigoCupom, Double saldoRestante) {
        log.info("[EMAIL→{}] Cupom '{}' gerado para a vantagem '{}'. Saldo: {}",
                aluno.getEmail(), codigoCupom, vantagem.getNome(), saldoRestante);

        if (!emailEnabled || mailSender == null || templateEngine == null) return;

        try {
            Context ctx = new Context();
            ctx.setVariable("alunoNome", aluno.getNome());
            ctx.setVariable("vantagemNome", vantagem.getNome());
            ctx.setVariable("codigoCupom", codigoCupom);
            ctx.setVariable("custoMoedas", vantagem.getCustoMoedas());
            ctx.setVariable("saldoRestante", saldoRestante);
            ctx.setVariable("empresaNome", nomeEmpresaOuInstituicao(vantagem));

            enviarHtml(aluno.getEmail(),
                    "Seu cupom de resgate - " + vantagem.getNome(),
                    templateEngine.process("email-resgate-aluno", ctx));
        } catch (Exception e) {
            log.warn("Falha ao enviar email de cupom pra {}: {}", aluno.getEmail(), e.getMessage());
        }
    }

    // ============================================================
    // EMPRESA recebe notificacao de resgate (Lab04S03)
    // ============================================================
    public void notificarResgateEmpresa(Vantagem vantagem, Aluno aluno, String codigoCupom) {
        String empresaNome = nomeEmpresaOuInstituicao(vantagem);
        String empresaEmail = emailEmpresaOuFallback(vantagem);

        log.info("[EMAIL→{}] Aluno '{}' resgatou '{}'. Codigo: {}",
                empresaEmail, aluno.getNome(), vantagem.getNome(), codigoCupom);

        if (!emailEnabled || mailSender == null || templateEngine == null) return;

        try {
            Context ctx = new Context();
            ctx.setVariable("empresaNome", empresaNome);
            ctx.setVariable("alunoNome", aluno.getNome());
            ctx.setVariable("alunoEmail", aluno.getEmail());
            ctx.setVariable("vantagemNome", vantagem.getNome());
            ctx.setVariable("codigoCupom", codigoCupom);
            ctx.setVariable("custoMoedas", vantagem.getCustoMoedas());

            enviarHtml(empresaEmail,
                    "Novo resgate de cupom - " + vantagem.getNome(),
                    templateEngine.process("email-resgate-empresa", ctx));
        } catch (Exception e) {
            log.warn("Falha ao enviar email de resgate pra empresa {}: {}", empresaEmail, e.getMessage());
        }
    }

    // ============================================================
    // helpers
    // ============================================================
    private void enviarHtml(String para, String assunto, String htmlBody) throws Exception {
        MimeMessage mime = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mime, true, StandardCharsets.UTF_8.name());
        helper.setFrom(from);
        helper.setTo(para);
        helper.setSubject(assunto);
        helper.setText(htmlBody, true);
        mailSender.send(mime);
        log.info("Email enviado para {} (assunto: {})", para, assunto);
    }

    private String nomeEmpresaOuInstituicao(Vantagem v) {
        Empresa e = v.getEmpresa();
        if (e != null) return e.getNome();
        if (v.getInstituicao() != null) return v.getInstituicao().getNome();
        return "Empresa Parceira";
    }

    private String emailEmpresaOuFallback(Vantagem v) {
        Empresa e = v.getEmpresa();
        if (e != null && e.getEmail() != null) return e.getEmail();
        // fallback (apenas em log)
        return "empresa-sem-cadastro@moedaestudantil.local";
    }
}
