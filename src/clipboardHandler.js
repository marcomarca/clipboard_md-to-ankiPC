// src/clipboardHandler.js
import clipboardy from "clipboardy";

class ClipboardHandler {
  constructor() {
    console.log(
      "[clipboardHandler] - Iniciando módulo de manejo del portapapeles."
    );
  }

  async getClipboardContent() {
    try {
      console.log(
        "[clipboardHandler] - Intentando extraer contenido del portapapeles..."
      );
      const content = await clipboardy.read();
      console.log("[clipboardHandler] - Contenido extraído exitosamente.");
      return content;
    } catch (error) {
      console.error(
        "[clipboardHandler] - Error al extraer el contenido del portapapeles:",
        error
      );
      throw new Error("No se pudo extraer el contenido del portapapeles.");
    }
  }
}

export default new ClipboardHandler();
