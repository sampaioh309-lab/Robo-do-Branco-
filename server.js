const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

let browser;
let page;
let ultimoNumero = null;

// inicia navegador UMA vez
(async () => {
    try{
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"]
        });

        page = await browser.newPage();

        await page.goto("https://blaze.bet.br/pt/games/double", {
            waitUntil: "domcontentloaded"
        });

        console.log("🟢 Blaze carregando...");

        // espera aparecer histórico
        await page.waitForSelector("div[class*=entries]", { timeout: 0 });

        console.log("🟢 Blaze pronta");

    }catch(e){
        console.log("Erro ao iniciar:", e);
    }
})();

app.get("/blaze", async (req, res) => {
    try{

        const numero = await page.evaluate(() => {

            const elementos = document.querySelectorAll("div[class*=entries] div");

            for (let el of elementos) {
                let texto = el.innerText.trim();

                if (texto !== "" && !isNaN(texto)) {
                    return parseInt(texto);
                }
            }

            return null;
        });

        if(numero === null){
            return res.json([]);
        }

        if(numero === ultimoNumero){
            return res.json([]);
        }

        ultimoNumero = numero;

        console.log("Novo resultado:", numero);

        res.json([
            {
                id: Date.now(),
                roll: numero
            }
        ]);

    }catch(e){
        console.log("Erro leitura:", e.message);
        res.status(500).json({ erro: "falha leitura" });
    }
});

app.listen(3000, () => {
    console.log("🟢 Servidor rodando em http://localhost:3000");
});
