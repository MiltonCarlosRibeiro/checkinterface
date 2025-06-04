package br.com.pakmatic.checkinterface.dto;

public class ChecagemEstadoDTO {
    private int totalLinhasLista1;
    private int totalLinhasLista2;

    public ChecagemEstadoDTO() {}

    public ChecagemEstadoDTO(int totalLinhasLista1, int totalLinhasLista2) {
        this.totalLinhasLista1 = totalLinhasLista1;
        this.totalLinhasLista2 = totalLinhasLista2;
    }

    public int getTotalLinhasLista1() {
        return totalLinhasLista1;
    }

    public void setTotalLinhasLista1(int totalLinhasLista1) {
        this.totalLinhasLista1 = totalLinhasLista1;
    }

    public int getTotalLinhasLista2() {
        return totalLinhasLista2;
    }

    public void setTotalLinhasLista2(int totalLinhasLista2) {
        this.totalLinhasLista2 = totalLinhasLista2;
    }
}
