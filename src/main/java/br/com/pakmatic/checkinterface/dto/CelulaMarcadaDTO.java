// CelulaMarcadaDTO.java
package br.com.pakmatic.checkinterface.dto;

/**
 * Representa uma célula marcada pelo usuário para persistência.
 */
public class CelulaMarcadaDTO {
    private int tabela;
    private int linha;
    private int coluna;
    private String cor;

    public CelulaMarcadaDTO() {}

    public CelulaMarcadaDTO(int tabela, int linha, int coluna, String cor) {
        this.tabela = tabela;
        this.linha = linha;
        this.coluna = coluna;
        this.cor = cor;
    }

    public int getTabela() {
        return tabela;
    }

    public void setTabela(int tabela) {
        this.tabela = tabela;
    }

    public int getLinha() {
        return linha;
    }

    public void setLinha(int linha) {
        this.linha = linha;
    }

    public int getColuna() {
        return coluna;
    }

    public void setColuna(int coluna) {
        this.coluna = coluna;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }
}
