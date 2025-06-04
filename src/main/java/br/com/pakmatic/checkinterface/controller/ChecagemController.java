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

    @PostMapping("/marcar")
    public void salvarMarcacoes(@RequestBody List<CelulaMarcadaDTO> marcacoes) {
        checagemService.salvarMarcacoes(marcacoes);
    }

    @GetMapping("/marcacoes")
    public List<CelulaMarcadaDTO> obterMarcacoes() {
        return checagemService.obterMarcacoes();
    }

    @DeleteMapping("/resetar")
    public void resetarMarcacoes() {
        checagemService.resetarMarcacoes();
    }

    @PostMapping("/estado")
    public void salvarEstado(@RequestBody ChecagemEstadoDTO estado) {
        checagemService.salvarEstado(estado);
    }

    @GetMapping("/estado")
    public ChecagemEstadoDTO obterEstado() {
        return checagemService.obterEstado();
    }
}
