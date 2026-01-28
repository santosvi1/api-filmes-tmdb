const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config()

const app = express();
//
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.TMDB_API_KEY;

// Rota GET para listar os filmes
app.get("/filmes", async (req, res) => {
  const { nome, ano } = req.query;
 
  if (!nome ) {
    return res.status(400).json({ erro: "Nome é obrigatório" });
  }

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(nome)}&language=pt-BR`;
  
  if(ano){
    url += `&year=${ano}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const dados = await response.json();

    if (!dados.results || dados.results.length === 0) {
      return res.status(404).json({ erro: "Nenhum filme encontrado" });
    }

    return res.json(dados.results[0]);
  } catch (erro) {
    return res
      .status(500)
      .json({ erro: "Erro ao buscar os dados da API " + erro.message });
  }
});

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
