package br.com.pakmatic.checkinterface.controller;

import br.com.pakmatic.checkinterface.helper.MarcaSQLiteHelper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    @Autowired
    private MarcaSQLiteHelper helper;

    @PostMapping("/salvar")
    public Map<String, String> salvar(@RequestBody String body) {
        JSONArray array = new JSONArray(body);
        helper.limparMarcacoes();
        for (int i = 0; i < array.length(); i++) {
            JSONObject marca = array.getJSONObject(i);
            int lista = marca.getInt("lista");
            int linha = marca.getInt("linha");
            int coluna = marca.getInt("coluna");
            String cor = marca.optString("cor", "");
            String obs = marca.optString("observacao", "");
            helper.salvarMarcacao(lista, linha, coluna, cor, obs);
        }
        return Map.of("status", "ok");
    }

    @GetMapping("/carregar")
    public JSONArray carregar() {
        JSONArray lista = new JSONArray();
        try {
            ResultSet rs = helper.carregarMarcacoes();
            while (rs.next()) {
                JSONObject obj = new JSONObject();
                obj.put("lista", rs.getInt("lista"));
                obj.put("linha", rs.getInt("linha"));
                obj.put("coluna", rs.getInt("coluna"));
                obj.put("cor", rs.getString("cor"));
                obj.put("observacao", rs.getString("observacao"));
                lista.put(obj);
            }
            rs.getStatement().getConnection().close(); // fechar conexão
        } catch (Exception e) {
            e.printStackTrace();
        }
        return lista;
    }

    @DeleteMapping("/resetar")
    public Map<String, String> resetar() {
        helper.limparMarcacoes();
        return Map.of("status", "limpo");
    }
}
