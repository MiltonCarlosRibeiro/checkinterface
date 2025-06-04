package br.com.pakmatic.checkinterface.helper;

import org.springframework.stereotype.Component;

import java.sql.*;

@Component
public class MarcaSQLiteHelper {

    private static final String DB_URL = "jdbc:sqlite:marcações.db";

    public MarcaSQLiteHelper() {
        criarTabelaSeNaoExistir();
    }

    private void criarTabelaSeNaoExistir() {
        String sql = "CREATE TABLE IF NOT EXISTS marcacoes (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "lista INTEGER NOT NULL," +
                "linha INTEGER NOT NULL," +
                "coluna INTEGER NOT NULL," +
                "cor TEXT," +
                "observacao TEXT" +
                ");";
        try (Connection conn = DriverManager.getConnection(DB_URL);
             Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void salvarMarcacao(int lista, int linha, int coluna, String cor, String observacao) {
        String sql = "INSERT INTO marcacoes (lista, linha, coluna, cor, observacao) VALUES (?, ?, ?, ?, ?);";
        try (Connection conn = DriverManager.getConnection(DB_URL);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, lista);
            pstmt.setInt(2, linha);
            pstmt.setInt(3, coluna);
            pstmt.setString(4, cor);
            pstmt.setString(5, observacao);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public ResultSet carregarMarcacoes() throws SQLException {
        String sql = "SELECT * FROM marcacoes;";
        Connection conn = DriverManager.getConnection(DB_URL);
        return conn.createStatement().executeQuery(sql);
    }

    public void limparMarcacoes() {
        String sql = "DELETE FROM marcacoes;";
        try (Connection conn = DriverManager.getConnection(DB_URL);
             Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
