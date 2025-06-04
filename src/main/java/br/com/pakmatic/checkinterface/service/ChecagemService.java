package br.com.pakmatic.checkinterface.service;

import br.com.pakmatic.checkinterface.dto.ChecagemEstadoDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChecagemService {

    private final List<ChecagemEstadoDTO> marcacoes = new ArrayList<>();

    public void salvarMarcacao(ChecagemEstadoDTO dto) {
        marcacoes.add(dto);
    }

    public List<ChecagemEstadoDTO> getTodasMarcacoes() {
        return marcacoes;
    }

    public void resetarTudo() {
        marcacoes.clear();
    }
}
