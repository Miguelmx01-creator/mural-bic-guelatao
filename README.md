# Mural Comunitario BIC

Tablero colaborativo de documentación cultural para estudiantes del BIC (Bachillerato Integral Comunitario) Sierra Norte de Oaxaca.

Los alumnos entran con un link (sin crear cuenta) y publican tarjetas sobre elementos culturales de su comunidad. La app reemplaza a Padlet.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Base de datos | Firebase Firestore (tiempo real con `onSnapshot`) |
| Imágenes | Cloudinary (unsigned upload) |
| Estilos | Tailwind CSS v3 |
| Despliegue | Vercel |

---

## Configuración local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores reales (ver secciones siguientes).

#### Firebase — cliente

1. Abre [Firebase Console](https://console.firebase.google.com) → tu proyecto
2. **Project settings → General → Your apps** → copia el objeto `firebaseConfig`
3. Llena las variables `NEXT_PUBLIC_FIREBASE_*`

#### Firebase — Admin SDK (para moderación)

1. **Project settings → Service accounts → Generate new private key**
2. Descarga el JSON y copia `project_id`, `client_email` y `private_key`
3. Llena `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

> La `private_key` contiene saltos de línea reales. En `.env.local` ponla entre comillas dobles:  
> `FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC...\n-----END PRIVATE KEY-----\n"`

#### Cloudinary

1. Abre [Cloudinary Console](https://cloudinary.com/console) → copia tu **Cloud name**
2. **Settings → Upload → Upload presets → Add upload preset** — tipo **Unsigned**
3. Llena `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` y `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

#### PIN de moderador

Define cualquier cadena secreta en `MODERATOR_PIN`. Solo el profesor lo conoce.  
Este valor **nunca llega al navegador** — se valida únicamente en la API route `/api/moderar`.

### 3. Reglas de Firestore

En Firebase Console → **Firestore Database → Rules**, pega el contenido de [`firestore.rules`](./firestore.rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tarjetas/{docId} {
      allow read, create: if true;
      allow update, delete: if false; // solo via Admin SDK
    }
  }
}
```

Publica las reglas con **Publish**.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Despliegue en Vercel

### Opción A — CLI

```bash
npm i -g vercel
vercel
```

Sigue el asistente. Cuando pida variables de entorno, agrégalas en el dashboard.

### Opción B — Dashboard (recomendado)

1. Sube el código a GitHub
2. Importa el repositorio en [vercel.com/new](https://vercel.com/new)
3. En **Settings → Environment Variables** agrega **todas** las variables de `.env.example`

> **Importante para `FIREBASE_PRIVATE_KEY` en Vercel:**  
> Pega el valor completo con los saltos de línea literales (los `\n`). Vercel los maneja correctamente.

---

## Uso

| Quién | Qué hace |
|-------|---------|
| Alumnos | Entran al link, ven el mural, publican tarjetas |
| Alumnos | Filtran por categoría con los botones de la barra superior |
| Profesor | Pasa el cursor por cualquier tarjeta → ícono 🗑 → ingresa PIN para eliminar |

### Flujo de una tarjeta

1. Alumno presiona **"Agregar tarjeta"**
2. Rellena comunidad (con autocompletado de las ya existentes), categoría, título, descripción, nombre y foto opcional
3. Al publicar, la tarjeta aparece en tiempo real en todos los dispositivos en la columna de su comunidad
4. Si la comunidad es nueva, se crea su columna automáticamente

---

## Seguridad

- **PIN de moderador:** validado en la API route `POST /api/moderar` (servidor). El PIN está en `MODERATOR_PIN` (sin `NEXT_PUBLIC_`), por lo que el navegador nunca lo ve.
- **Firestore rules:** los clientes solo pueden leer y crear. Borrar/editar solo funciona via Admin SDK (servidor).
- **Cloudinary:** se usa un _unsigned preset_ (safe for browser uploads). No se expone el API secret.
