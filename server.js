const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

let browser;
let page;
let ultimoNumero = null;

(async () => {
    browser = await puppeteer.launch({
        headless: false, // 👈 deixa visível pra você ver se abriu
        args: ["--no-sandbox"]
    });

    page = await browser.newPage();

    await page.goto("https://blaze.bet.br/pt/games/double", {
        waitUntil: "domcontentloaded"
    });

    console.log("🟢 Página aberta, aguardando carregar...");

    // espera o histórico aparecer (mais seguro)
    await page.waitForSelector("div[class*=entries]", { timeout: 0 });

    console.log("🟢 Blaze carregada e pronta");
})();

app.get("/blaze", async (req, res) => {
    try {

        const numero = await page.evaluate(() => {

            // pega TODOS os resultados visíveis
            const itens = document.querySelectorAll("div[class*=entries] div");

            for (let el of itens) {
                let texto = el.innerText.trim();

                if (texto !== "" && !isNaN(texto)) {
                    return parseInt(texto);
                }
            }

            return null;
        });

        if (numero === null) {
            return res.json([]);
        }

        if (numero === ultimoNumero) {
            return res.json([]);
        }

        ultimoNumero = numero;

        console.log("Novo número:", numero);

        res.json([
            {
                id: Date.now(),
                roll: numero
            }
        ]);

    } catch (e) {
        console.log("ERRO:", e.message);
        res.status(500).json({ erro: "falha leitura" });
    }
});

app.listen(3000, () => console.log("🟢 Servidor rodando"));
