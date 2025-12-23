// lib/searchRooms.ts
import { edificios, coordsMap, BuildingKey, FloorKey, ZoneType } from '../app/mapsConfig';

// ===== Tipos reutilizables =====
export type AulaItem = ZoneType & { buildingKey: BuildingKey; floorKey: FloorKey };
export type FloorGroup = { floorKey: FloorKey; rooms: AulaItem[] };
export type Section = { title: string; data: FloorGroup[] };

// ===== Normalización y alias =====
export const norm = (s: string) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/**
 * Construye variantes/alias a partir de la query:
 * - Prefijos al inicio de la frase:
 *   "de…", "dep…", "depa…", … → "departamento …", "departamento de …"
 *   "labo…", "lab…"            → "laboratorio …",  "laboratorio de …"
 *   "secr…", "sec…"            → "secretaria …",   "secretaria de …"
 * - Atajos sueltos: "dpto", "dpto.", "lab", "lab.", "sec", "sec.", "ead"
 * - Siempre incluye la query normalizada original.
 */
export function buildNeedles(q: string): string[] {
  const base = norm(q);
  if (!base) return [];

  const needles = new Set<string>([base]);

  // -------- 1) Expansión por PREFIJO al inicio de la frase --------
  // Capturamos el prefijo (con o sin punto) y el resto ("tail")
  type Pref = { re: RegExp; word: 'departamento' | 'laboratorio' | 'secretaria' };
  const prefs: Pref[] = [
    { re: /^(?:de(?:p(?:artamento)?)?\.?)\s*(.*)$/, word: 'departamento' }, // "de", "dep", "depa", "departamento", con/sin "."
    { re: /^(?:lab(?:o(?:ratorio)?)?\.?)\s*(.*)$/,  word: 'laboratorio'  }, // "lab", "labo", "laboratorio", con/sin "."
    { re: /^(?:sec(?:r(?:etaria)?)?\.?)\s*(.*)$/,   word: 'secretaria'   }, // "sec", "secr", "secretaria", con/sin "."
  ];

  for (const { re, word } of prefs) {
    const m = base.match(re);
    if (m) {
      const tail = (m[1] ?? '').trim(); // lo que viene después del prefijo
      needles.add(word);
      needles.add(`${word} de`);
      if (tail) {
        needles.add(`${word} ${tail}`);
        needles.add(`${word} de ${tail}`);
      }
    }
  }

  // -------- 2) Atajos SUELTOS por tokens --------
  const tokens = base.split(/\s+/).filter(Boolean);
  for (const t of tokens) {
    if (t === 'labo' || t === 'labor'|| t === 'labora'|| t === 'laborat'|| t === 'laborato'|| t === 'laborator' || t === 'laboratori' || t === 'laboratorio') {
      needles.add('lab');
    }
    if (t === 'de' || t === 'dep' || t === 'depa' || t === 'depar' || t === 'depart' || t === 'departa' || t === 'departam' || t === 'departame' || t === 'departament'  || t === 'departamento') {
      needles.add('dpto');
    }
    if (t === 'secr' || t === 'secre' || t === 'secret' || t === 'secreta' || t === 'secretar' || t === 'secretari' || t === 'secretaria') {
      needles.add('sec');
    }
    if (t === 'ead') {
      needles.add('educacion a distancia');
    }
  }

  return Array.from(needles);
}

// ===== Orden “natural”: numérico si termina en número; sino alfabético =====
export const aulaComparator = (a: AulaItem, b: AulaItem) => {
  const rx = /(\d+)\s*$/i;
  const na = Number(a.name.match(rx)?.[1] ?? NaN);
  const nb = Number(b.name.match(rx)?.[1] ?? NaN);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  return a.name.localeCompare(b.name, 'es', { numeric: true, sensitivity: 'base' });
};

// ===== Construcción de secciones base (sin filtro) =====
export function makeBaseSections(): Section[] {
  return (Object.keys(edificios) as BuildingKey[]).map((bk) => {
    const floorGroups: Record<FloorKey, AulaItem[]> = {} as any;

    for (const f of edificios[bk].floors) {
      const pd = coordsMap[bk]?.[f.key];
      const rooms: AulaItem[] = (pd?.zones ?? [])
        // Sólo aulas (mantiene criterio actual)
        .filter((z) => z.id.toLowerCase().startsWith('aula'))
        .map((z) => ({ ...z, buildingKey: bk, floorKey: f.key as FloorKey }));

      if (rooms.length) {
        floorGroups[f.key] = rooms.sort(aulaComparator);
      }
    }

    const data: FloorGroup[] = (Object.keys(floorGroups) as FloorKey[])
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
      .map((fk) => ({ floorKey: fk, rooms: floorGroups[fk] }));

    return { title: edificios[bk].label, data };
  });
}

// ===== Filtro por query (sólo NAME, no ID) con alias =====
export function filterSections(base: Section[], q: string): Section[] {
  const needles = buildNeedles(q);
  if (!needles.length) return base;

  const matches = (name: string) => {
    const n = norm(name);
    return needles.some((nd) => n.includes(nd));
  };

  return base
    .map((sec) => ({
      ...sec,
      data: sec.data
        .map((fg) => ({ ...fg, rooms: fg.rooms.filter((r) => matches(r.name)) }))
        .filter((fg) => fg.rooms.length),
    }))
    .filter((sec) => sec.data.length);
}
