const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/blaze", async (req, res) => {
    try {
        const response = await fetch(
            "https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/history/1?page=1&limit=5",
            {
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const data = await response.json();
        res.json(data);

    } catch (e) {
        res.status(500).json({ erro: "falha na API" });
    }
});

app.listen(3000, () => console.log("🟢 Servidor rodando em http://localhost:3000"));
