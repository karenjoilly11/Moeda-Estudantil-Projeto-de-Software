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

    @NotBlank(message = "Foto é obrigatória")
    private String foto;

    @NotNull(message = "Custo em moedas é obrigatório")
    @Positive(message = "Custo deve ser maior que zero")
    private Double custoMoedas;

    @NotNull(message = "Instituição é obrigatória")
    private Long instituicaoId;
}