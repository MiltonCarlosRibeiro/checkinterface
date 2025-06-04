package br.com.pakmatic.checkinterface.controller;

import br.com.pakmatic.checkinterface.dto.DesenhoDTO;
import br.com.pakmatic.checkinterface.service.DesenhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para consulta de desenhos técnicos (PDF e SW).
 */
@RestController
@RequestMapping("/api/desenhos")
public class DesenhoController {

    @Autowired
    private DesenhoService desenhoService;

    /**
     * Endpoint para buscar um desenho técnico conforme o tipo (pdf ou sw) e o código informado.
     * @param tipo "pdf" ou "sw"
     * @param codigo Código do desenho (ex: F2-5346 R0)
     * @return DTO contendo status e caminho
     */
    @GetMapping("/{tipo}/{codigo}")
    public DesenhoDTO buscarDesenho(@PathVariable String tipo, @PathVariable String codigo) {
        return desenhoService.buscarCaminho(tipo, codigo);
    }
}
