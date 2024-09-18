// src/markdownToHTML.js
import { marked } from "marked";
import highlight from "highlight.js";
import fs from "fs/promises";
import path from "path";

// Configuramos marked para usar highlight.js
marked.setOptions({
  highlight: (code, lang) => {
    return highlight.highlightAuto(code, [lang]).value;
  },
  langPrefix: "hljs language-", // Para que el CSS de highlight.js funcione correctamente.
});

class MarkdownToHTML {
  constructor() {
    console.log(
      "[markdownToHTML] - Módulo de conversión de Markdown a HTML iniciado."
    );
  }

  // Método para dividir el contenido en preguntas por el marcador '# Pregunta X'
  splitIntoQuestions(markdownContent) {
    const questions = markdownContent.split(/\n# Pregunta \d+/).filter(Boolean); // Divide el contenido por cada pregunta
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

    console.log(
      `[markdownToHTML] - Guardando front de pregunta ${questionIndex} en ${frontFileName}`
    );
    console.log(
      `[markdownToHTML] - Guardando back de pregunta ${questionIndex} en ${backFileName}`
    );

    await Promise.all([
      fs.writeFile(frontFileName, frontHTML),
      fs.writeFile(backFileName, backHTML),
    ]);

    console.log(
      `[markdownToHTML] - Archivos HTML para pregunta ${questionIndex} guardados exitosamente.`
    );
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
