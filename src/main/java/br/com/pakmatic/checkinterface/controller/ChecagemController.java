// ChecagemController.java
package br.com.pakmatic.checkinterface.controller;

import br.com.pakmatic.checkinterface.dto.CelulaMarcadaDTO;
import br.com.pakmatic.checkinterface.dto.ChecagemEstadoDTO;
import br.com.pakmatic.checkinterface.service.ChecagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller responsável pelas operações de marcação e checagem de planilhas.
 */
@RestController
@RequestMapping("/api/checagem")
public class ChecagemController {

    @Autowired
    private ChecagemService checagemService;

    /**
     * Endpoint para salvar uma lista de marcações recebidas do frontend.
     * @param marcacoes Lista de células marcadas
     */
    @PostMapping("/marcar")
    public void salvarMarcacoes(@RequestBody List<CelulaMarcadaDTO> marcacoes) {
        checagemService.salvarMarcacoes(marcacoes);
    }

    /**
     * Endpoint para obter as marcações salvas anteriormente.
     * @return Lista de células marcadas
     */
    @GetMapping("/marcacoes")
    public List<CelulaMarcadaDTO> obterMarcacoes() {
        return checagemService.obterMarcacoes();
    }

    /**
     * Endpoint para deletar todas as marcações salvas.
     */
    @DeleteMapping("/resetar")
    public void resetarMarcacoes() {
        checagemService.resetarMarcacoes();
    }

    /**
     * Endpoint para salvar o estado da checagem atual.
     * @param estado objeto contendo dados como número de linhas ou status
     */
    @PostMapping("/estado")
    public void salvarEstado(@RequestBody ChecagemEstadoDTO estado) {
        checagemService.salvarEstado(estado);
    }

    /**
     * Endpoint para recuperar o estado da checagem anterior.
     * @return estado salvo
     */
    @GetMapping("/estado")
    public ChecagemEstadoDTO obterEstado() {
        return checagemService.obterEstado();
    }
}
