import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** Reglas específicas de Next.js (se aplican solo a apps/web desde el eslint.config.mjs raíz). */
const next = [...nextCoreWebVitals, ...nextTypescript];

export default next;
