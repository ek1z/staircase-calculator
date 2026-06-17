// ── Porrastyypit ja niiden raja-arvot (YM asetus 1007/2017) ───────────────
// Ympäristöministeriön asetus rakennuksen käyttöturvallisuudesta 1007/2017.
// Nousun maksimit ja etenemän minimit millimetreinä porrastyypeittäin.

export type StairType = {
  id: string;
  label: string;
  /** Suurin sallittu askelkorkeus (nousu), mm. */
  rise: number;
  /** Pienin sallittu etenemä, mm. */
  go: number;
  note: string;
};

export const TYPES: StairType[] = [
  { id: "asunto", label: "Asuinhuoneiston / majoitustilan sisäporras", rise: 190, go: 250, note: "Tavallisin kotiporras kerrosten välillä." },
  { id: "kayttotila", label: "Muiden varsinaisten käyttötilojen sisäporras", rise: 180, go: 270, note: "Esim. teollisuus- ja työtilat ilman asiakasliikennettä." },
  { id: "parvi", label: "Varatie / parvi- tai ullakkoporras (asumista palvelematon)", rise: 220, go: 220, note: "Asunnossa muihin kuin asumista palveleviin välttämättömiin tiloihin (ullakko, parvi, kellari). Ei saa olla varsinaisten asuintilojen uloskäytävän reitillä." },
  { id: "aula", label: "Hallinto-, palvelu- ja liiketilat, kokoontumistilat", rise: 160, go: 300, note: "Aulat, muut sisätilat ja kokoontumistilat." },
  { id: "uloskaytava", label: "Uloskäytävä (poistumistie)", rise: 180, go: 270, note: "Tavanomaisessa sisäisessä liikenteessä oleva uloskäytävä." },
  { id: "ulkokatettu", label: "Katettu tai lämmitetty ulkoporras", rise: 160, go: 300, note: "" },
  { id: "ulkokattamaton", label: "Kattamaton, lämmittämätön ulkoporras", rise: 130, go: 390, note: "Tiukin mitoitus liukkauden vuoksi." },
];

// ── Mukavuussääntö (askelkaava 2·nousu + etenemä) ─────────────────────────
// Vakiintunut suunnitteluohje, ei asetuksen numeroarvo.
export const STEP_TARGET = 630;
export const STEP_MIN = 600;
export const STEP_MAX = 660;

// Suurin nousumäärä ilman välitasannetta.
export const MAX_RISERS_NO_LANDING = 20;
