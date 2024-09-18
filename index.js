// index.js
import clipboardHandler from "./src/clipboardHandler.js";
import markdownToHTML from "./src/markdownToHTML.js";
import ankiImporter from "./src/ankiImporter.js";

async function main() {
  try {
    console.log("[index] - Iniciando proceso...");

    // Extraer el contenido del portapapeles
    const clipboardContent = await clipboardHandler.getClipboardContent();
    console.log(
      "[index] - Contenido obtenido del portapapeles. Longitud:",
      clipboardContent.length
    );

    // Procesar el contenido del portapapeles y convertirlo en múltiples archivos HTML
    await markdownToHTML.processMarkdownToHTML(clipboardContent);

    // Importar todas las tarjetas generadas a Anki
    await ankiImporter.importCardsToAnki();

    console.log("[index] - Proceso completado con éxito.");
  } catch (error) {
    console.error("[index] - Error durante el proceso:", error.message);
  }
}

main();
