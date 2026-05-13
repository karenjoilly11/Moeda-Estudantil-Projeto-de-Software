package com.moedaestudantil.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class VantagemCadastroDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100)
    private String nome;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 255)
    private String descricao;

    private String foto;

    @NotNull(message = "Custo em moedas é obrigatório")
    @Positive(message = "Custo deve ser maior que zero")
    private Double custoMoedas;

    private Integer estoque;

    private String categoria;

    // Vínculo: instituicaoId OU empresaId (pelo menos um obrigatório, validado no service)
    private Long instituicaoId;
    private Long empresaId;
}
