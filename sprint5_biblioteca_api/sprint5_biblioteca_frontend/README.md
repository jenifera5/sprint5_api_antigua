🤖 Entrega S5.02 – Desarrollo con IA Generativa
📘 Descripción General

Durante esta entrega se desarrolló una interfaz frontend moderna en React para consumir la API REST creada previamente en Laravel.
El objetivo principal fue experimentar con el uso de Inteligencia Artificial Generativa (ChatGPT) como asistente de desarrollo, optimizando la generación de código, la corrección de errores y el diseño visual del proyecto.

⚙️ 1. Modelo de IA seleccionado y modo de uso

Se utilizó ChatGPT (modelo GPT-5, OpenAI) como herramienta de apoyo en todo el proceso de desarrollo.
El modelo se empleó para:

Generar estructuras base en React con TypeScript y TailwindCSS.

Diseñar componentes funcionales (Books.tsx, Categories.tsx, etc.) conectados a la API Laravel.

Optimizar llamadas fetch y manejo de estados en React con useState y useEffect.

Resolver errores de conexión entre frontend y backend (autenticación Bearer Token, rutas API, CORS).

Proponer mejoras de interfaz (modal de creación, etiquetas dinámicas y sistema de búsqueda).

Tipo de asistencia: diálogo iterativo, corrigiendo y perfeccionando el código en cada iteración.

💬 2. Registro de interacciones con la IA

Durante el desarrollo se realizaron múltiples sesiones con ChatGPT.
Algunos ejemplos relevantes fueron:

Generación inicial del CRUD de libros: el modelo generó un componente Books.tsx completamente funcional para listar, crear, editar y eliminar libros.

Depuración del buscador: se detectó que el endpoint /api/books/search no respondía correctamente; la IA propuso probar rutas alternativas y manejar ambas (/api/books/search y /books/search) automáticamente.

Integración de categorías: el modelo ayudó a añadir la relación Libro → Categorías mediante with('categorias') en Laravel y su renderizado dinámico en el frontend con Tag icons.

Mejoras visuales: ChatGPT sugirió el uso de clases Tailwind para lograr una interfaz limpia, minimalista y coherente con el diseño general del proyecto.

🧩 3. Análisis del código generado

El código generado por la IA fue funcional, aunque requirió revisión manual:

Se corrigieron nombres de rutas y tokens de autorización.

Se adaptó la estructura a TypeScript, mejorando la validación de datos (interface Book, interface Categoria).

Se optimizó la gestión del estado en React para evitar renderizados innecesarios.

Se agregaron controles de error (try/catch, response.ok) y validaciones de formularios.

El resultado final fue un frontend totalmente operativo, conectado a la API Laravel, con una experiencia de usuario fluida y moderna.

🔗 4. Conexión entre Frontend y Backend

La API desarrollada en Laravel maneja los recursos de libros y categorías, protegidos mediante token Bearer.
El frontend React se comunica con ella usando fetch y los endpoints definidos:

Método	Endpoint	Descripción
GET	/api/books	Lista todos los libros
POST	/api/books	Crea un nuevo libro
PUT	/api/books/{id}	Edita un libro existente
DELETE	/api/books/{id}	Elimina un libro
GET	/api/books/search?query=	Busca libros por título o autor

El componente principal Books.tsx incluye:

Modal de creación/edición con selector múltiple de categorías.

Barra de búsqueda dinámica con detección automática del endpoint correcto.

Renderizado de etiquetas de categoría mediante Tag icons.

Todo el flujo CRUD fue probado con la API activa en http://127.0.0.1:8000.

🧠 5. Reflexión sobre el proceso de aprendizaje

Este sprint permitió consolidar conocimientos en:

Comunicación entre frontend y backend mediante API REST.

Comprensión del código generado por IA y adaptación a un entorno real.

Resolución de problemas y depuración de errores con ayuda contextual de la IA.

Mejora del razonamiento lógico al validar cada fragmento propuesto antes de implementarlo.

La IA no sustituyó el aprendizaje, sino que aceleró la comprensión de conceptos complejos y ayudó a estructurar el proyecto con mayor eficiencia.
El proceso de colaboración con ChatGPT fomentó un pensamiento crítico y la capacidad de transformar respuestas automáticas en código mantenible y funcional.

🧾 6. Código y repositorio de GitHub

El código fuente completo está disponible en el siguiente repositorio:

🔗 Repositorio: GitHub – Sprint 5 Laravel API REST

📁 Contiene:

Carpeta backend/ → Proyecto Laravel con controladores, rutas, seeders y autenticación.

Carpeta frontend/ → Proyecto React con los componentes (Books.tsx, Categories.tsx, ModalForm.tsx, etc.).

Documentación en README.md con las secciones de análisis, integración y reflexión.

🧩 Resultado final

El resultado es un sistema completo Biblioteca Universo de Libros, donde:

El backend Laravel gestiona los recursos y la lógica.

El frontend React ofrece una interfaz amigable y moderna.

La IA generativa (ChatGPT) se usó como asistente de desarrollo para optimizar el proceso y mejorar la comprensión del código.

💬 “El verdadero aprendizaje no fue generar código, sino entender cómo razonar junto a la IA para construir software mejor estructurado y funcional.”
— Jenifer Álvarez, Sprint 5
