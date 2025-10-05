# Nota remota con Netlify Blobs

Página mínima que guarda, recupera y elimina un único texto usando [Netlify Blobs](https://docs.netlify.com/storage/blobs/). Sirve como pseudo base de datos sin necesidad de backend propio.

## ¿Qué incluye?

- Campo de texto e interfaz con tres acciones: _Traer_, _Guardar_ y _Eliminar_.
- Función serverless (`/.netlify/functions/note`) que usa Netlify Blobs para persistencia gratuita.
- Manejo de estados de carga/errores en el frontend.

## Requisitos

- Cuenta en Netlify con plan gratuito.
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) para probar en local.
- Node.js ≥ 18 si quieres ejecutar la función localmente con `netlify dev`.

## Desarrollo en local

```bash
npm install
netlify login
netlify dev
```

La CLI expone `http://localhost:8888`. Los botones llaman a `/.netlify/functions/note` para persistir la nota en un blob.

## Despliegue rápido

1. Crea un sitio en Netlify e importa este repositorio.
2. Ajustes de build:
   - **Framework**: _None_.
   - **Build command**: vacío.
   - **Publish directory**: `.`
3. Despliega. La función `note` se empaqueta automáticamente y Netlify crea el almacén de blobs.

## API de la función

- `GET /.netlify/functions/note` → devuelve `{ content, updatedAt }` o 404 si no hay dato.
- `POST /.netlify/functions/note` con `{ "content": "texto" }` → guarda el texto.
- `DELETE /.netlify/functions/note` → borra el dato.

Todos los endpoints responden JSON y aceptan CORS abierto para simplificar la demo.

## Ideas futuras

- Añadir autenticación simple o un token secreto para evitar usos no deseados.
- Permitir múltiples notas usando claves dinámicas.
- Mostrar histórico en la UI leyendo metadatos del blob.
