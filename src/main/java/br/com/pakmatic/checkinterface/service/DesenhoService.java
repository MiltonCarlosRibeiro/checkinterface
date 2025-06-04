package br.com.pakmatic.checkinterface.service;

import br.com.pakmatic.checkinterface.dto.DesenhoDTO;
import org.springframework.stereotype.Service;

import java.io.File;

/**
 * Serviço para busca de arquivos técnicos (PDF ou SW).
 */
@Service
public class DesenhoService {

    // Caminhos UNC reais dos servidores
    private final String CAMINHO_MAPOTECA = "\\\\PKM-DC1\\Departamental\\Mapoteca\\";
    private final String CAMINHO_SW = "\\\\PKM-DC1\\Engenharia\\Desenhos SW\\";

    public DesenhoDTO buscarCaminho(String tipo, String codigoDigitado) {
        String basePath;

        if ("pdf".equalsIgnoreCase(tipo)) {
            basePath = CAMINHO_MAPOTECA;
        } else if ("sw".equalsIgnoreCase(tipo)) {
            basePath = CAMINHO_SW;
        } else {
            return new DesenhoDTO(false, "❌ Tipo inválido (use 'pdf' ou 'sw')");
        }

        File arquivo = new File(basePath + codigoDigitado + ".pdf"); // ou .sldprt, conforme necessário

        if (arquivo.exists()) {
            return new DesenhoDTO(true, arquivo.getAbsolutePath());
        }

        return new DesenhoDTO(false, "❌ Arquivo não encontrado: " + codigoDigitado);
    }
}
