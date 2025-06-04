package br.com.pakmatic.checkinterface.dto;

/**
 * DTO para representar uma célula marcada pelo usuário com cor e tooltip.
 */
public class CelulaMarcadaDTO {
    private String lista;   // "lista1" ou "lista2"
    private String celula;  // Ex: "B5"
    private String cor;     // Ex: "green", "orange", "blue"
    private String tooltip; // Texto de observação

    public String getLista() {
        return lista;
    }

    public void setLista(String lista) {
        this.lista = lista;
    }

    public String getCelula() {
        return celula;
    }

    public void setCelula(String celula) {
        this.celula = celula;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public String getTooltip() {
        return tooltip;
    }

    public void setTooltip(String tooltip) {
        this.tooltip = tooltip;
    }
}
