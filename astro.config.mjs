import { defineConfig } from 'astro/config';

// Web běží na vlastní doméně alerta.cz (GitHub Pages s CNAME), všude v kořeni.
export default defineConfig({
  site: 'https://alerta.cz',
  base: '/',
});
