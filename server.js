const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

let ultimoNumero = null;

// inicia navegador só uma vez
let browser;
let page;

(async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"]
    });

    page = await browser.newPage();

    await page.goto("https://blaze.bet.br/pt/games/double", {
        waitUntil: "networkidle2"
    });

    console.log("🟢 Blaze carregada");
})();

app.get("/blaze", async (req, res) => {
    try {

        const numero = await page.evaluate(() => {
            const el = document.querySelector(".recent-entries .entry");

            if (!el) return null;

            return parseInt(el.innerText);
        });

        if (numero === null) {
            return res.json([]);
        }

        // evita repetir
        if (numero === ultimoNumero) {
            return res.json([]);
        }

        ultimoNumero = numero;

        res.json([
            {
                id: Date.now(),
                roll: numero
            }
        ]);

    } catch (e) {
        res.status(500).json({ erro: "falha leitura" });
    }
});

app.listen(3000, () => console.log("🟢 Servidor rodando"));
