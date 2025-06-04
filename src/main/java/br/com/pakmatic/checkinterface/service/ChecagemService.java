package br.com.pakmatic.checkinterface.service;

import br.com.pakmatic.checkinterface.dto.CelulaMarcadaDTO;
import br.com.pakmatic.checkinterface.dto.ChecagemEstadoDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Serviço responsável por gerenciar as marcações e o estado da checagem.
 */
@Service
public class ChecagemService {

    private final List<CelulaMarcadaDTO> marcacoes = new ArrayList<>();
    private ChecagemEstadoDTO estadoAtual;

    public void salvarMarcacoes(List<CelulaMarcadaDTO> novasMarcacoes) {
        marcacoes.clear();
        marcacoes.addAll(novasMarcacoes);
    }

    public List<CelulaMarcadaDTO> obterMarcacoes() {
        return marcacoes;
    }

    public void resetarMarcacoes() {
        marcacoes.clear();
    }

    public void salvarEstado(ChecagemEstadoDTO estado) {
        this.estadoAtual = estado;
    }

    public ChecagemEstadoDTO obterEstado() {
        return this.estadoAtual != null ? this.estadoAtual : new ChecagemEstadoDTO();
    }
}
