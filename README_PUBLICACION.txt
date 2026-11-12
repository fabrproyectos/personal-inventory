INVENTARIO PERSONAL — SITIO PWA PARA GITHUB PAGES

CONTENIDO
Este paquete contiene únicamente los archivos necesarios para publicar la interfaz móvil.
No contiene la aplicación de escritorio, la base SQLite ni exportaciones JSON del inventario.

PUBLICACIÓN
1. Crear un repositorio público nuevo en GitHub.
2. Subir el CONTENIDO de esta carpeta a la raíz del repositorio (index.html debe quedar en la raíz).
3. En GitHub: Settings > Pages.
4. En Build and deployment, elegir Deploy from a branch.
5. Seleccionar la rama main y la carpeta /(root), luego Save.
6. Esperar a que GitHub Pages indique la URL publicada.

PRIVACIDAD
El código de esta PWA será público. No subir archivos JSON exportados desde la PC ni datos personales.
Los datos del inventario se importan directamente en el teléfono y quedan en IndexedDB.

USO
Abrir la URL HTTPS en Chrome Android, instalar/añadir a pantalla principal y luego importar el JSON desde el teléfono.
