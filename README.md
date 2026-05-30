# LaBeSa Movilidad

App web responsive para administracion integral de flotilla vehicular.

## Identidad visual

La interfaz usa exclusivamente los colores de marca definidos en `styles.css`:

- Azul marino profundo: `--brand-navy`
- Azul medio: `--brand-blue`
- Turquesa oscuro del aro: `--brand-teal`
- Cian brillante del isotipo y texto: `--brand-cyan`
- Blanco: `--brand-white`
- Semaforo: verde, amarillo y rojo para vigencias

El logotipo oficial esta guardado en `assets/logo-labesa-oficial.jpeg`. Los valores `--brand-*` de `styles.css` fueron ajustados a la identidad real del logo proporcionado.

## Supabase

En Netlify configura estas variables de entorno:

```bash
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
```

Durante el deploy, `npm run build` genera `config.js` con esas variables. La app esta preparada para usar Auth, base de datos y storage de Supabase desde el navegador.

Para que 2 usuarios de la misma empresa vean y editen los mismos datos, ejecuta en Supabase:

1. `supabase/schema.sql`
2. `supabase/shared-access-policies.sql`
3. `supabase/shared-storage-policies.sql`

## Netlify

El archivo `netlify.toml` ya define:

- Build command: `npm run build`
- Publish directory: `.`
- Redirect SPA a `index.html`

Conecta el repositorio de GitHub en Netlify y agrega las variables necesarias en la configuracion del sitio.

## GitHub

En esta maquina `git` no esta disponible desde la terminal actual. Cuando este instalado o habilitado:

```bash
git init
git add .
git commit -m "Crear app LaBeSa Movilidad"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/labesa-movilidad.git
git push -u origin main
```

Despues conecta ese repositorio en Netlify para activar despliegue continuo.
