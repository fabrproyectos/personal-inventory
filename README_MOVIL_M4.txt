ETAPA M5 — ORDEN POR CÓDIGO Y EXPLORACIÓN DE UBICACIONES

CAMBIOS
1. Las tablas principales de escritorio ordenan por código:
   - Inventario (INV y STK)
   - Categorías (CAT)
   - Tipos de objetos (TYP)
   - Ubicaciones (LOC)
2. Las exportaciones de inventario y el JSON móvil también ordenan por código.
3. La lista principal de la aplicación móvil utiliza código ascendente como orden predeterminado.
4. Se incorpora el explorador jerárquico de ubicaciones:
   - Muestra ubicaciones principales.
   - Permite entrar en sububicaciones.
   - Incluye una ruta de navegación para volver a niveles anteriores.
   - Muestra los objetos almacenados directamente en la ubicación seleccionada.
   - Los objetos se ordenan por código.
5. La caché de la PWA pasa a v4 para que el teléfono descargue la nueva interfaz.

ACTUALIZAR GITHUB PAGES
1. Descomprimir el paquete personal_inventory_github_pages_M5.zip.
2. Abrir la carpeta site_publish.
3. Subir TODO su contenido a la raíz del repositorio personal-inventory.
4. Reemplazar los archivos anteriores y confirmar con Commit changes.
5. Esperar a que GitHub Pages publique los cambios.
6. Abrir la PWA en Android con Internet y esperar unos segundos. Cerrar y volver a abrir.

IMPORTANTE
- No subir el JSON del inventario a GitHub.
- No hace falta volver a importar el JSON: la actualización de la interfaz conserva IndexedDB.
- La aplicación móvil sigue siendo de solo lectura.
- Para actualizar la aplicación de escritorio, trabajar con esta carpeta del proyecto y conservar la base data/inventory.db del usuario. No reemplazarla por la base de prueba incluida en el ZIP.

PRUEBAS RECOMENDADAS
- Revisar que CAT, TYP, LOC, INV y STK se muestren por código ascendente.
- En Android, abrir Ubicaciones y recorrer una ubicación principal y sus sububicaciones.
- Comprobar que se muestran solo los objetos asignados directamente a la ubicación abierta.
- Verificar la ruta de navegación y el acceso a las fichas.
- Confirmar que el buscador y filtros M4 siguen funcionando.
- Activar modo avión y repetir la consulta.
