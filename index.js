// index.js
import clipboardHandler from "./src/clipboardHandler.js";

async function main() {
  try {
    console.log("[index] - Iniciando proceso...");
    const clipboardContent = await clipboardHandler.getClipboardContent();
    console.log(
      "[index] - Contenido obtenido del portapapeles:\n",
      clipboardContent
    );
  } catch (error) {
    console.error("[index] - Error durante el proceso:", error.message);
  }
}

main();
