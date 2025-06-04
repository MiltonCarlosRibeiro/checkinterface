// ChecagemEstadoDTO.java
package br.com.pakmatic.checkinterface.dto;

/**
 * DTO para salvar e recuperar o estado da checagem.
 * Pode conter número de linhas de cada lista e timestamp, por exemplo.
 */
public class ChecagemEstadoDTO {
    private int linhasLista1;
    private int linhasLista2;
    private String timestamp;

    public ChecagemEstadoDTO() {}

    public ChecagemEstadoDTO(int linhasLista1, int linhasLista2, String timestamp) {
        this.linhasLista1 = linhasLista1;
        this.linhasLista2 = linhasLista2;
        this.timestamp = timestamp;
    }

    public int getLinhasLista1() {
        return linhasLista1;
    }

    public void setLinhasLista1(int linhasLista1) {
        this.linhasLista1 = linhasLista1;
    }

    public int getLinhasLista2() {
        return linhasLista2;
    }

    public void setLinhasLista2(int linhasLista2) {
        this.linhasLista2 = linhasLista2;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
