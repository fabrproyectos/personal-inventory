ETAPA M4 — BÚSQUEDA AVANZADA

Novedades:
- Filtros por tipo de objeto, condición física, estado operativo y disponibilidad.
- Ordenamiento por nombre, código, categoría, ubicación y cantidad.
- Indicador de filtros activos y botón para limpiar criterios.
- Búsqueda ampliada: también considera condición, estado y disponibilidad.
- La importación JSON y el almacenamiento local IndexedDB mantienen el mismo formato y estructura.

PUBLICACIÓN EN GITHUB PAGES
1. Descomprimir el paquete de actualización para GitHub Pages.
2. Subir el contenido de la carpeta site a la raíz del repositorio, reemplazando los archivos existentes.
3. Confirmar los cambios en main.
4. Abrir la aplicación en Android con Internet y esperar a que se actualice la caché.
5. Cerrar y volver a abrir la PWA. Si no aparece la nueva interfaz, cerrar la aplicación, abrirla con conexión y recargar una vez.

IMPORTANTE
- No subir archivos JSON de inventario ni la base SQLite al repositorio.
- No se modificó el esquema del JSON (schema_version 1).
- No se requiere volver a importar el inventario: la copia local se conserva en IndexedDB.
