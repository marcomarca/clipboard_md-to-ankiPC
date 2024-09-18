// src/highlighter.js
import fs from "fs/promises";
import path from "path";
import hljs from "highlight.js";

class Highlighter {
  constructor() {
    console.log("[highlighter] - Módulo de preprocesamiento de HTML iniciado.");
  }

  async highlightHTML(inputFile, outputFile) {
    try {
      console.log(`[highlighter] - Leyendo contenido del archivo ${inputFile}`);
      let htmlContent = await fs.readFile(inputFile, "utf-8");

      // Usar una expresión regular para encontrar todos los bloques <pre><code> y resaltarlos
      htmlContent = htmlContent.replace(
        /<pre><code class="language-(.*?)">(.*?)<\/code><\/pre>/gs,
        (match, lang, code) => {
          const validLanguage = hljs.getLanguage(lang) ? lang : "plaintext";
          const highlightedCode = hljs.highlight(code, {
            language: validLanguage,
          }).value;
          return `<pre><code class="hljs language-${validLanguage}">${highlightedCode}</code></pre>`;
        }
      );

      console.log(
        `[highlighter] - Guardando archivo con resaltado en ${outputFile}`
      );
      await fs.writeFile(outputFile, htmlContent, "utf-8");
      console.log(
        `[highlighter] - Resaltado de código completado y guardado en ${outputFile}`
      );
    } catch (err) {
      console.error(
        `[highlighter] - Error al procesar el HTML: ${err.message}`
      );
    }
  }
}

export default new Highlighter();
