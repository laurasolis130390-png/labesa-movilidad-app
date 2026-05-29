# LaBesa Movilidad

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

Configura las credenciales publicas en `config.js`:

```js
window.LABESA_CONFIG = {
  SUPABASE_URL: "https://tu-proyecto.supabase.co",
  SUPABASE_ANON_KEY: "tu-anon-key",
  WIALON_API_URL: "",
  WIALON_TOKEN: "",
  WIALON_UNIT_ID: ""
};
```

La app esta preparada para usar Auth, base de datos y storage de Supabase desde el navegador.

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
git commit -m "Crear app LaBesa Movilidad"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/labesa-movilidad.git
git push -u origin main
```

Despues conecta ese repositorio en Netlify para activar despliegue continuo.
