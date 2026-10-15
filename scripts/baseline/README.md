# Baselines de la huella de diseño

Referencia contra la que `scripts/design-fingerprint.mjs` compara el HTML generado.

**Regeneradas el 2026-10-15** en la optimización de assets (WebP y re-encode de vídeo); la vez anterior, el 2026-10-13, en el barrido de producción. Las de septiembre eran del 7 y el 22
de septiembre y habían quedado obsoletas: la landing daba 1542 diferencias contra la suya, así
que el verificador anti-regresión estaba apagado en la práctica. Además solo existían tres
(`landing`, `go-ams`, `go-crm`); ahora hay una por ruta pública.

## Uso

```bash
pnpm build
node scripts/design-fingerprint.mjs scripts/baseline/landing.baseline.html out/index.html
node scripts/design-fingerprint.mjs scripts/baseline/go-crm.baseline.html  out/go-crm/index.html
# …una por ruta
```

`TOTAL: 0` es lo que debe salir en un refactor, una limpieza o un arreglo de fugas. Cualquier
diferencia en CLASES, INLINE o TEXTO movió el diseño o el copy: justifícala una por una o
revierte.

## Al aprobar un cambio de diseño

Regenera la baseline de esa ruta **en el mismo commit**, para que el siguiente cambio se mida
contra el estado nuevo:

```bash
cp out/<ruta>/index.html scripts/baseline/<ruta>.baseline.html
```
