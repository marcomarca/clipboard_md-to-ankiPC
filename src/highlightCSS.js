// src/highlightCSS.js
import fs from "fs/promises";

// Este archivo contiene el CSS de Highlight.js en una constante
export const highlightCSS = `
/* CSS de highlight.js */
${await fs.readFile("src/styles/highlight.css", "utf-8")}
`;
