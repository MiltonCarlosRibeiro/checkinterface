package br.com.pakmatic.checkinterface.dto;

/**
 * DTO para retorno da existência e caminho de um desenho técnico.
 * Usado na API de busca de desenhos (PDF / SW).
 *
 * @param existe true se o arquivo foi encontrado
 * @param caminho caminho absoluto do arquivo (para uso local)
 */
public record DesenhoDTO(boolean existe, String caminho) {}
