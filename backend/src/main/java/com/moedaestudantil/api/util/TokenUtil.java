package com.moedaestudantil.api.util;

import java.util.Base64;

/**
 * Utilitário para decodificar o token Base64 usado como autenticação simples.
 * Formato do token: Base64("email:timestamp")
 */
public class TokenUtil {

    private TokenUtil() {}

    /**
     * Extrai o email do token "Bearer <base64>" ou "<base64>".
     * Lança RuntimeException se inválido.
     */
    public static String extractEmail(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new RuntimeException("Token ausente");
        }
        String token = authorizationHeader.startsWith("Bearer ")
                ? authorizationHeader.substring(7)
                : authorizationHeader;
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            if (parts.length == 0 || parts[0].isBlank()) {
                throw new RuntimeException("Token inválido");
            }
            return parts[0];
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Token mal formado");
        }
    }
}
