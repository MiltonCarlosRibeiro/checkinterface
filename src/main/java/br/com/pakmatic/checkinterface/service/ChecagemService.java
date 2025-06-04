// ChecagemService.java
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

    // Armazena marcações em memória (pode ser substituído por SQLite no futuro)
    private final List<CelulaMarcadaDTO> marcacoes = new ArrayList<>();

    // Estado salvo da checagem
    private ChecagemEstadoDTO estadoAtual = new ChecagemEstadoDTO();

    /**
     * Salva uma lista de marcações recebidas do frontend.
     * @param novasMarcacoes Lista de células marcadas
     */
    public void salvarMarcacoes(List<CelulaMarcadaDTO> novasMarcacoes) {
        marcacoes.clear();
        marcacoes.addAll(novasMarcacoes);
    }

    /**
     * Retorna todas as marcações salvas.
     * @return lista de CelulaMarcadaDTO
     */
    public List<CelulaMarcadaDTO> obterMarcacoes() {
        return new ArrayList<>(marcacoes);
    }

    /**
     * Reseta todas as marcações salvas.
     */
    public void resetarMarcacoes() {
        marcacoes.clear();
    }

    /**
     * Salva o estado da checagem atual.
     * @param estado ChecagemEstadoDTO
     */
    public void salvarEstado(ChecagemEstadoDTO estado) {
        this.estadoAtual = estado;
    }

    /**
     * Retorna o estado da checagem salvo.
     * @return ChecagemEstadoDTO
     */
    public ChecagemEstadoDTO obterEstado() {
        return this.estadoAtual;
    }
}
