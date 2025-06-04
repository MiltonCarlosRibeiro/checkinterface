package br.com.pakmatic.checkinterface.controller;

import br.com.pakmatic.checkinterface.dto.ChecagemEstadoDTO;
import br.com.pakmatic.checkinterface.service.ChecagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checagem")
public class ChecagemController {

    @Autowired
    private ChecagemService checagemService;

    @PostMapping("/marcar")
    public void marcarCelula(@RequestBody ChecagemEstadoDTO dto) {
        checagemService.salvarMarcacao(dto);
    }

    @GetMapping("/marcacoes")
    public List<ChecagemEstadoDTO> obterMarcacoes() {
        return checagemService.getTodasMarcacoes();
    }

    @DeleteMapping("/resetar")
    public void resetarMarcacoes() {
        checagemService.resetarTudo();
    }
}
