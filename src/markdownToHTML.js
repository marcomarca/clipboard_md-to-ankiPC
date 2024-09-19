// src/markdownToHTML.js
import { marked } from "marked";
import fs from "fs/promises";
import path from "path";
import highlighter from "./highlighter.js";
import { highlightCSS } from "./highlightCSS.js"; // Importamos el CSS local

class MarkdownToHTML {
  constructor() {
    console.log(
      "[markdownToHTML] - Módulo de conversión de Markdown a HTML iniciado."
    );
  }

  // Método para dividir el contenido en preguntas por el marcador '# Pregunta X'
  splitIntoQuestions(markdownContent) {
    // Limpiamos cualquier texto que aparezca antes del primer '# Pregunta X'
    const questionPattern = /# Pregunta \d+/;
    const startIndex = markdownContent.search(questionPattern);

    // Si no se encuentra ninguna pregunta, lanzar una advertencia y devolver un array vacío
    if (startIndex === -1) {
      console.warn(
        "[markdownToHTML] - No se encontró ninguna pregunta en el contenido."
      );
      return [];
    }

    // Cortamos el contenido hasta la primera pregunta
    const cleanedMarkdown = markdownContent.substring(startIndex);

    // Dividimos por cada pregunta
    const questions = cleanedMarkdown.split(/\n# Pregunta \d+/).filter(Boolean);

    // Removemos el texto final después de `---` en la última pregunta, si existe
    questions[questions.length - 1] = questions[questions.length - 1]
      .split("---")[0]
      .trim();

    console.log(
      `[markdownToHTML] - Se han detectado ${questions.length} preguntas.`
    );
    return questions;
  }

  // Método para convertir una pregunta en HTML para front y back
  async convertQuestionToHTML(questionContent, questionIndex) {
    const [front, back] = questionContent.split("## back"); // Separamos front y back
    const frontHTML = marked(front.trim());
    const backHTML = marked(back.trim());

    console.log(
      `[markdownToHTML] - Generando HTML para la pregunta ${questionIndex} (front y back)...`
    );

    await this.saveHTMLFiles(frontHTML, backHTML, questionIndex);
  }

  // Guardar los archivos HTML generados en la carpeta 'cards-html'
  async saveHTMLFiles(frontHTML, backHTML, questionIndex) {
    const folderPath = path.join("output", "cards-html");
    await fs.mkdir(folderPath, { recursive: true });

    const frontFileName = path.join(
      folderPath,
      `pregunta-${questionIndex}-front.html`
    );
    const backFileName = path.join(
      folderPath,
      `pregunta-${questionIndex}-back.html`
    );

    // Crear una estructura HTML completa con el head y el body
    const fullFrontHTML = this.wrapInHTMLStructure(
      frontHTML,
      `Pregunta ${questionIndex} - Front`
    );
    const fullBackHTML = this.wrapInHTMLStructure(
      backHTML,
      `Pregunta ${questionIndex} - Back`
    );

    console.log(
      `[markdownToHTML] - Guardando front de pregunta ${questionIndex} en ${frontFileName}`
    );
    console.log(
      `[markdownToHTML] - Guardando back de pregunta ${questionIndex} en ${backFileName}`
    );

    await Promise.all([
      fs.writeFile(frontFileName, fullFrontHTML),
      fs.writeFile(backFileName, fullBackHTML),
    ]);

    console.log(
      `[markdownToHTML] - Archivos HTML para pregunta ${questionIndex} guardados exitosamente.`
    );

    // Aplicamos el resaltado de código a los archivos HTML guardados
    await highlighter.highlightHTML(frontFileName, frontFileName); // Procesar y sobrescribir
    await highlighter.highlightHTML(backFileName, backFileName); // Procesar y sobrescribir
  }

  // Método para envolver el contenido HTML en una estructura completa de HTML con un <head> y <body>
  wrapInHTMLStructure(content, title) {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          /* CSS de Highlight.js */
          ${highlightCSS}

          /* Estilos personalizados */
          body { font-family: Arial, sans-serif; margin: 20px; }
          pre { background-color: #f5f5f5; padding: 10px; border-radius: 4px; }
          code { font-size: 14px; }
          h1, h2 { color: #333; }
          .hljs { background: #f5f5f5; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
  }

  // Proceso principal para convertir Markdown a HTML por cada pregunta
  async processMarkdownToHTML(markdownContent) {
    const questions = this.splitIntoQuestions(markdownContent);

    for (let i = 0; i < questions.length; i++) {
      await this.convertQuestionToHTML(questions[i], i + 1);
    }
  }
}

export default new MarkdownToHTML();
