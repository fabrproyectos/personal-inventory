ETAPA M3 - PWA INSTALADA EN ANDROID

Estado validado por el usuario:
- Publicación en GitHub Pages mediante HTTPS.
- Instalación en Android 13 / Chrome 157.
- Apertura de la aplicación sin conexión.
- Importación inicial del JSON y funcionamiento de filtros.

MEJORA M3.1:
La pantalla muestra ahora por separado:
- Fecha de exportación desde la PC (exported_at del JSON).
- Fecha de importación en el teléfono (imported_at local).
- Cantidad de registros disponibles.
- Estado de disponibilidad de la copia local.

ACTUALIZACIÓN DE LA PWA PUBLICADA:
1. En el repositorio de GitHub Pages, reemplazar los archivos de la raíz por el contenido de esta carpeta mobile.
2. Confirmar el commit.
3. Esperar a que GitHub Pages publique los cambios.
4. Abrir la PWA con Internet y esperar unos segundos para que el Service Worker nuevo se active.
5. Cerrar y volver a abrir la aplicación. El nombre de caché cambió a v2 para renovar los archivos de interfaz.

IMPORTANTE:
- No subir personal_inventory_mobile.json al repositorio.
- No subir la base SQLite ni archivos con datos reales.
- Los cambios de datos siguen haciéndose mediante exportación JSON desde la PC e importación manual en Android.
- Los cambios de código/interfaz sí requieren actualizar el repositorio.
