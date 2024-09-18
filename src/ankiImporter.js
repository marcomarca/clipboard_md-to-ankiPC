// src/ankiImporter.js
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import crypto from "crypto";

class AnkiImporter {
  constructor() {
    console.log("[ankiImporter] - Módulo de importación a Anki iniciado.");
    this.ankiConnectURL = "http://localhost:8765"; // URL por defecto de AnkiConnect
  }

  // Función para generar un nombre aleatorio de 4 caracteres para el mazo
  generateDeckName() {
    return crypto.randomBytes(2).toString("hex").toUpperCase();
  }

  // Función para crear un mazo en Anki
  async createDeck(deckName) {
    try {
      console.log(`[ankiImporter] - Creando mazo con el nombre: ${deckName}`);
      const response = await axios.post(this.ankiConnectURL, {
        action: "createDeck",
        version: 6,
        params: {
          deck: deckName,
        },
      });
      console.log(`[ankiImporter] - Mazo creado: ${response.data}`);
    } catch (error) {
      console.error("[ankiImporter] - Error al crear el mazo:", error.message);
      throw new Error("No se pudo crear el mazo en Anki.");
    }
  }

  // Función para leer el contenido HTML de un archivo
  async readHTMLFile(filePath) {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      console.error(
        `[ankiImporter] - Error al leer el archivo: ${filePath}`,
        error.message
      );
      throw new Error("No se pudo leer el archivo HTML.");
    }
  }

  // Función para añadir una tarjeta a Anki (con opción de versión inversa)
  async addCardToAnki(deckName, front, back) {
    try {
      console.log("[ankiImporter] - Añadiendo tarjeta a Anki...");
      const response = await axios.post(this.ankiConnectURL, {
        action: "addNotes",
        version: 6,
        params: {
          notes: [
            {
              deckName: deckName,
              modelName: "Basic",
              fields: {
                Front: front,
                Back: back,
              },
              options: {
                allowDuplicate: false,
              },
              tags: [],
            },
            {
              deckName: deckName,
              modelName: "Basic (and reversed card)",
              fields: {
                Front: back, // Inversión de front y back para tarjeta inversa
                Back: front,
              },
              options: {
                allowDuplicate: false,
              },
              tags: [],
            },
          ],
        },
      });
      console.log(
        "[ankiImporter] - Tarjeta añadida exitosamente.",
        response.data
      );
    } catch (error) {
      console.error(
        "[ankiImporter] - Error al añadir la tarjeta:",
        error.message
      );
      throw new Error("No se pudo añadir la tarjeta a Anki.");
    }
  }

  // Función para procesar todos los archivos HTML y añadir las tarjetas a Anki
  async importCardsToAnki() {
    const deckName = this.generateDeckName();
    await this.createDeck(deckName);

    const folderPath = path.join("output", "cards-html");
    const files = await fs.readdir(folderPath);

    const totalQuestions = files.length / 2; // Asumimos que hay un front y back para cada pregunta

    console.log(
      `[ankiImporter] - Se encontraron ${totalQuestions} preguntas para importar.`
    );

    for (let i = 1; i <= totalQuestions; i++) {
      const frontFilePath = path.join(folderPath, `pregunta-${i}-front.html`);
      const backFilePath = path.join(folderPath, `pregunta-${i}-back.html`);

      const frontHTML = await this.readHTMLFile(frontFilePath);
      const backHTML = await this.readHTMLFile(backFilePath);

      // Añadir tarjeta a Anki
      await this.addCardToAnki(deckName, frontHTML, backHTML);
    }

    console.log(
      "[ankiImporter] - Todas las tarjetas se han importado exitosamente a Anki."
    );
  }
}

export default new AnkiImporter();
