# Índice

1. Introducción
2. Dependencias Clave
3. Estructura del Proyecto
4. Explicación del Proceso
5. Descripción de los Módulos
6. Explicación de Cómo se Interconectan los Módulos
7. Especificaciones de Módulos
   - 7.1. Módulo `clipboardHandler`
   - 7.2. Módulo `markdownToHTML`
   - 7.3. Módulo `highlighter`
8. Caso de Uso Práctico

---

## 1. Introducción

Este proyecto está diseñado para automatizar el proceso de creación de tarjetas de Anki a partir de contenido en formato Markdown, que es extraído directamente del portapapeles. El contenido en Markdown se transforma en archivos HTML, generando dos archivos por cada pregunta: uno para el front (anverso) y otro para el back (reverso). El sistema utiliza resaltado de código con `highlight.js` y procesa el contenido para que funcione de manera 100% offline.

El desarrollo se inspiró en la necesidad de una solución modular y escalable que permitiera generar tarjetas educativas con facilidad, enfocándome en un diseño basado en componentes que facilita la reutilización y extensibilidad. Además, el sistema es capaz de lidiar con errores en la estructura del Markdown, brindando robustez al proceso.

---

## 2. Dependencias Clave

El proyecto utiliza las siguientes dependencias clave:

- **`clipboardy`**: Se utiliza para acceder al portapapeles del sistema y extraer el contenido en formato Markdown.
- **`marked`**: Para convertir el contenido Markdown a HTML.
- **`highlight.js`**: Para resaltar bloques de código en el HTML generado, tanto en el lado del cliente como en el servidor (mediante preprocesamiento).
- **`fs/promises`**: Proporciona manejo asíncrono del sistema de archivos para guardar los archivos HTML generados.
- **`path`**: Utilizada para gestionar rutas de archivos y garantizar la creación de carpetas adecuadas.

El uso de estas dependencias ayuda a asegurar que el sistema sea eficiente y robusto, ofreciendo un flujo de trabajo fluido que convierte automáticamente el contenido del portapapeles en archivos HTML listos para ser importados a Anki.

---

## 3. Estructura del Proyecto

El proyecto sigue una estructura modular que permite una fácil extensión y mantenimiento. A continuación se presenta la estructura principal del proyecto:

```plaintext
- src/
  - clipboardHandler.js
  - markdownToHTML.js
  - highlighter.js
  - highlightCSS.js
  - styles/
    - highlight.css
- output/
  - cards-html/
    - pregunta-1-front.html
    - pregunta-1-back.html
  - cards.json
- index.js
- package.json
```

### Descripción:

- **`src/`**: Contiene todos los módulos que componen la lógica del programa, organizados de manera modular.
- **`output/`**: Es la carpeta donde se guardan los archivos HTML generados para cada pregunta.
- **`index.js`**: Punto de entrada principal del sistema donde se orquesta la ejecución del flujo.
- **`package.json`**: Contiene las dependencias y scripts de configuración del proyecto.

---

## 4. Explicación del Proceso

El sistema sigue una serie de pasos bien definidos para convertir el contenido del portapapeles en archivos HTML:

1. **Extracción del contenido del portapapeles**: Utilizando `clipboardy`, el sistema lee el contenido actual del portapapeles en formato Markdown.
2. **Procesamiento y validación del contenido Markdown**: El módulo `markdownToHTML` divide el contenido en preguntas individuales, valiéndose del formato `# Pregunta X`. Además, el sistema limpia cualquier texto fuera del formato correcto (antes de la primera pregunta y después del delimitador `---`).
3. **Conversión de Markdown a HTML**: Cada pregunta es dividida en bloques `front` y `back` y convertida en HTML utilizando `marked`.
4. **Resaltado de código**: Los bloques de código se procesan con `highlight.js` para garantizar el resaltado correcto. Este paso se realiza de manera offline para asegurar la independencia de recursos externos.
5. **Generación de archivos HTML**: Por cada pregunta, se generan dos archivos HTML (uno para el front y otro para el back), y se guardan en la carpeta `output/cards-html`.

---

## 5. Descripción de los Módulos

Cada módulo tiene una responsabilidad bien definida y sigue el patrón de diseño basado en componentes. Esto garantiza que cada pieza del sistema pueda ser modificada o reemplazada sin afectar al resto.

### 5.1 Módulo `clipboardHandler`

- **Propósito**: Extraer el contenido del portapapeles en formato de texto.
- **Funciones clave**:
  - `getClipboardContent()`: Extrae el contenido del portapapeles y lo devuelve como una cadena de texto.
- **Interacción**: Este módulo interactúa principalmente con `index.js`, que lo utiliza para obtener el contenido del portapapeles.

### 5.2 Módulo `markdownToHTML`

- **Propósito**: Procesar el contenido Markdown y dividirlo en preguntas individuales, y convertirlo en HTML.
- **Funciones clave**:
  - `splitIntoQuestions(markdownContent)`: Divide el contenido en preguntas utilizando el patrón `# Pregunta X`.
  - `convertQuestionToHTML(questionContent, questionIndex)`: Convierte una pregunta individual en dos archivos HTML.
  - `wrapInHTMLStructure(content, title)`: Envuelve el contenido HTML en una estructura completa con `head` y `body`.
  - `saveHTMLFiles(frontHTML, backHTML, questionIndex)`: Guarda los archivos HTML generados.
- **Interacción**: Este módulo recibe el contenido del portapapeles de `clipboardHandler` y envía los HTML generados a `highlighter` para el preprocesamiento.

### 5.3 Módulo `highlighter`

- **Propósito**: Procesar y resaltar los bloques de código en los archivos HTML generados.
- **Funciones clave**:
  - `highlightHTML(inputFile, outputFile)`: Aplica resaltado de sintaxis a los bloques de código dentro de los archivos HTML.
- **Interacción**: Este módulo recibe los archivos HTML generados por `markdownToHTML` y procesa el contenido antes de guardarlos definitivamente.

---

## 6. Explicación de Cómo se Interconectan los Módulos

1. **`index.js`** actúa como el punto central de coordinación del sistema. Comienza por llamar a **`clipboardHandler`** para obtener el contenido del portapapeles.
2. El contenido del portapapeles se pasa a **`markdownToHTML`**, que lo procesa, lo valida y lo convierte en preguntas individuales. Cada pregunta se convierte en dos archivos HTML (front y back).
3. Una vez generados los archivos HTML, **`markdownToHTML`** llama a **`highlighter`**, que se encarga de resaltar los bloques de código dentro de los archivos HTML.
4. Finalmente, los archivos HTML procesados se almacenan en la carpeta `output/cards-html`, listos para ser utilizados en Anki o cualquier otra plataforma educativa.

---

## 7. Especificaciones de Módulos

### 7.1 Módulo `clipboardHandler`

- **Nombre**: `clipboardHandler`
- **Propósito**: Manejar el acceso al portapapeles y extraer contenido en formato Markdown.
- **Funciones clave**:
  - `getClipboardContent()`: Retorna el contenido del portapapeles como una cadena de texto.
- **Interacción**: Se comunica directamente con `index.js` para entregar el contenido del portapapeles.

### 7.2 Módulo `markdownToHTML`

- **Nombre**: `markdownToHTML`
- **Propósito**: Dividir el contenido en preguntas, convertirlas a HTML y guardar los archivos generados.
- **Funciones clave**:
  - `splitIntoQuestions(markdownContent)`: Divide el contenido en preguntas utilizando el patrón `# Pregunta X`.
  - `convertQuestionToHTML(questionContent, questionIndex)`: Convierte una pregunta en HTML.
  - `saveHTMLFiles(frontHTML, backHTML, questionIndex)`: Guarda los archivos HTML generados.
- **Interacción**: Interactúa con `clipboardHandler` para recibir el contenido y con `highlighter` para aplicar el resaltado de código.

### 7.3 Módulo `highlighter`

- **Nombre**: `highlighter`
- **Propósito**: Resaltar bloques de código dentro de los archivos HTML generados.
- **Funciones clave**:
  - `highlightHTML(inputFile, outputFile)`: Aplica resaltado de sintaxis a los bloques de código.
- **Interacción**: Recibe los archivos HTML generados por `markdownToHTML` y los procesa para aplicar el resaltado antes de guardarlos.

---

## 8. Caso de Uso Práctico

Supongamos que un profesor desea crear tarjetas educativas en Anki a partir de un conjunto de preguntas en formato Markdown. Copia el contenido Markdown al portapapeles y ejecuta el programa.

El flujo que sigue el sistema es el siguiente:

1. **Extracción del contenido**: El sistema utiliza `clipboardHandler` para extraer el contenido del portapapeles.
2. **Procesamiento de las preguntas**: El módulo `markdownToHTML` divide el contenido en preguntas utilizando el formato `# Pregunta X`, valida que cada pregunta tenga un bloque `## front`y`## back`, y genera dos archivos HTML por cada pregunta.

3. **Resaltado del código**: `highlighter` resalta los bloques de código utilizando `highlight.js` y los guarda en los archivos HTML generados.
4. **Archivos generados**: El sistema guarda los archivos HTML procesados en la carpeta `output/cards-html`. Estos archivos pueden ser importados a Anki, creando tarjetas con formato HTML completo y código resaltado.

Este flujo garantiza que los profesores y estudiantes puedan automatizar la creación de tarjetas educativas a partir de contenido en Markdown sin tener que preocuparse por problemas estructurales en el formato. Además, el sistema es completamente offline, lo que lo hace más rápido y confiable para su uso en cualquier entorno.

Este diseño modular también permite que los componentes del sistema se actualicen fácilmente o se reemplacen por otros, sin afectar la funcionalidad general del programa. Esto hace que sea una solución robusta, escalable y flexible para la creación de tarjetas Anki basadas en Markdown.

### 9. Anexos

#### Módulo `highlighter` - Preprocesado y Renderizado Offline de Código

El módulo `highlighter` es una parte fundamental del sistema ya que se encarga de preprocesar los bloques de código dentro del contenido HTML generado a partir del Markdown. Una de las principales ventajas de este módulo es que realiza el **resaltado de sintaxis** en el lado del servidor, eliminando cualquier necesidad de ejecutar JavaScript en el navegador. Esto asegura que el proyecto sea completamente offline y que los archivos HTML generados estén listos para ser usados en cualquier entorno sin depender de scripts externos ni de recursos en línea.

##### Objetivo del Módulo

El módulo `highlighter` es responsable de procesar los archivos HTML, localizar los bloques de código que se encuentran dentro de elementos `<pre><code>`, y aplicar el resaltado de sintaxis utilizando `highlight.js` en el lado del servidor. Esto significa que los archivos HTML generados ya contienen el resaltado de código embebido en el propio HTML, con estilos CSS, evitando la necesidad de cargar `highlight.js` o cualquier otro script en el navegador.

##### Funciones Principales

1. **Resaltado de Código**:

   - El módulo busca los bloques de código en el HTML usando una expresión regular que identifica los elementos `<pre><code>` y, si tienen un lenguaje definido (`class="language-..."`), `highlight.js` aplica el resaltado de sintaxis correspondiente.
   - Si el bloque de código no especifica un lenguaje, `highlight.js` aplica el resaltado utilizando la detección automática de lenguaje, aunque en este caso lo predetermina a `plaintext` para evitar errores.

2. **Deshacer escapes HTML en bloques de código**:

   - Antes de que el resaltado se aplique, el contenido de los bloques de código es procesado para deshacer los escapes HTML que puedan haber sido generados durante la conversión de Markdown a HTML. Caracteres como `>` (escapado como `&gt;`), `<` (escapado como `&lt;`), `'` (escapado como `&#39;`), etc., son restaurados a su forma original para garantizar que el código se resalte correctamente.

3. **Guardar el archivo HTML**:
   - Tras procesar los bloques de código y aplicar el resaltado, el archivo HTML resultante es guardado. Este archivo ya contiene todo el formato necesario, incluyendo el código resaltado y los estilos CSS, por lo que está listo para ser usado sin necesidad de dependencias adicionales.

##### Detalles Técnicos del Renderizado

El sistema de preprocesado del HTML funciona de la siguiente manera:

1. **Identificación de Bloques de Código**:
   El módulo utiliza una expresión regular para encontrar todos los bloques de código dentro de las etiquetas `<pre><code>`. Una vez identificado un bloque de código, se verifica si este tiene una clase que indique el lenguaje de programación (por ejemplo, `class="language-js"`).

2. **Resaltado del Código con `highlight.js`**:
   Para cada bloque de código, el sistema utiliza la función `highlight()` de `highlight.js` para aplicar el resaltado adecuado. Este proceso ocurre en el servidor, por lo que el resaltado ya está aplicado en el HTML resultante.

   ```javascript
   const highlightedCode = hljs.highlight(code, {
     language: validLanguage,
   }).value;
   ```

3. **Inserción de Estilos CSS**:
   Los estilos necesarios para el resaltado de código se inyectan directamente en el HTML utilizando una constante que contiene el CSS de `highlight.js`. Este CSS se incluye en el `<head>` del HTML, por lo que cuando el archivo HTML se abre en el navegador, los estilos ya están aplicados sin la necesidad de cargar ningún recurso adicional desde una CDN.

   En lugar de depender de enlaces externos, como:

   ```html
   <link
     rel="stylesheet"
     href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/default.min.css"
   />
   ```

   El sistema ahora usa el CSS de `highlight.js` embebido dentro del propio HTML:

   ```html
   <style>
     /* CSS de Highlight.js */
     ${highlightCSS}
   </style>
   ```

   Este enfoque asegura que los archivos HTML generados pueden ejecutarse en cualquier entorno, incluyendo sistemas completamente offline, sin tener que depender de una conexión a Internet o de recursos externos para el estilo y formato del código resaltado.

4. **Guardado del HTML Procesado**:
   Una vez que el código está resaltado y los estilos aplicados, el archivo HTML se guarda en el sistema de archivos utilizando `fs/promises`, sobrescribiendo el archivo original o generando uno nuevo según corresponda.

   El siguiente código ejemplifica cómo se guarda el archivo HTML procesado:

   ```javascript
   await fs.writeFile(outputFile, htmlContent, "utf-8");
   ```

   Aquí, `htmlContent` contiene el HTML final con todos los bloques de código resaltados y los estilos CSS integrados.

##### Preprocesado Totalmente Offline

La característica clave de este proyecto es que **todo el procesamiento se realiza de manera local**, lo que significa que los archivos generados no dependen de ninguna librería externa cargada dinámicamente en el navegador. Esto tiene varias ventajas:

- **Velocidad y eficiencia**: Al no depender de scripts externos o de la red, el sistema es mucho más rápido en entornos con conexión limitada o sin conexión a Internet.
- **Portabilidad**: Los archivos HTML generados son completamente autónomos, lo que significa que se pueden transferir y usar en cualquier entorno sin perder funcionalidad.
- **Seguridad**: Al no hacer llamadas externas para obtener estilos o scripts, el sistema es más seguro y evita problemas relacionados con la integridad de los recursos.

##### Módulo `highlightCSS.js`

El CSS necesario para los estilos de resaltado de código se almacena dentro del archivo `highlightCSS.js`. Este archivo contiene una constante `highlightCSS`, que incluye los estilos de `highlight.js` en formato inline. Estos estilos se inyectan directamente en el HTML en el momento de la creación del archivo.

```javascript
export const highlightCSS = `
/* CSS de highlight.js */
${await fs.readFile("src/styles/highlight.css", "utf-8")}
`;
```

Este archivo asegura que no es necesario cargar el CSS desde fuentes externas, haciendo que todo el sistema funcione de manera independiente. Además, al integrar el CSS de esta manera, el archivo HTML sigue siendo legible y editable, permitiendo cambios si es necesario.

##### Flujo del Proceso de Preprocesado

1. **Generación del HTML Base**: El módulo `markdownToHTML` genera el HTML base a partir del contenido Markdown del portapapeles.
2. **Preprocesamiento de Código**: `highlighter` procesa el HTML generado, encuentra los bloques de código, deshace los escapes de caracteres, aplica el resaltado y guarda el resultado.
3. **Archivo Final**: El HTML resultante tiene todo el contenido, los estilos y el código resaltado embebido, listo para ser utilizado en un entorno completamente offline.

---

### Conclusión

El **módulo `highlighter`** es el núcleo que permite que este proyecto sea funcional sin depender de JavaScript en el navegador. Todo el código se procesa en el servidor y el HTML resultante incluye todos los estilos necesarios para ser visualizado correctamente. Este enfoque garantiza que el sistema sea rápido, portable y altamente eficiente, lo que lo convierte en una herramienta extremadamente valiosa para la creación de tarjetas educativas que no dependen de recursos externos.
