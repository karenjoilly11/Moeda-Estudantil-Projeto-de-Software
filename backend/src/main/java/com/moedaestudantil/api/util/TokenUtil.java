package com.moedaestudantil.api.util;

import com.moedaestudantil.api.enums.TipoUsuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

/**
 * Geração e validação de JWT (HS256).
 *
 * Mantém um método estático {@link #extractEmail(String)} pra não quebrar os
 * controllers existentes (eles chamam direto a classe). O bean é injetado via
 * {@link #ensureSecret(String, long)} no @PostConstruct.
 */
@Component
public class TokenUtil {

    private static SecretKey signingKey;
    private static long expirationMs;

    @Value("${app.jwt.secret:dev-secret-trocar-em-prod-com-pelo-menos-32-caracteres-aqui}")
    private String secret;

    @Value("${app.jwt.expiration-hours:8}")
    private long expirationHours;

    @PostConstruct
    void init() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException(
                    "app.jwt.secret deve ter ao menos 32 bytes (256 bits) pra HS256"
            );
        }
        signingKey = Keys.hmacShaKeyFor(keyBytes);
        expirationMs = expirationHours * 3600_000L;
    }

    public static String generate(String email, TipoUsuario tipo) {
        if (signingKey == null) {
            throw new IllegalStateException("TokenUtil não inicializado");
        }
        Instant now = Instant.now();
        Instant exp = now.plus(expirationMs, ChronoUnit.MILLIS);
        return Jwts.builder()
                .subject(email)
                .claim("tipo", tipo != null ? tipo.name() : null)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(signingKey)
                .compact();
    }

    public static String extractEmail(String authorizationHeader) {
        Claims claims = parse(authorizationHeader);
        String email = claims.getSubject();
        if (email == null || email.isBlank()) {
            throw new TokenException("Token sem subject");
        }
        return email;
    }

    public static TipoUsuario extractTipo(String authorizationHeader) {
        Claims claims = parse(authorizationHeader);
        Object tipo = claims.get("tipo");
        if (tipo == null) return null;
        try {
            return TipoUsuario.valueOf(tipo.toString());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private static Claims parse(String authorizationHeader) {
        if (signingKey == null) {
            throw new IllegalStateException("TokenUtil não inicializado");
        }
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new TokenException("Token ausente");
        }
        String token = authorizationHeader.startsWith("Bearer ")
                ? authorizationHeader.substring(7).trim()
                : authorizationHeader.trim();
        try {
            return Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new TokenException("Token expirado");
        } catch (JwtException | IllegalArgumentException e) {
            throw new TokenException("Token inválido");
        }
    }
}
