# Portaiden askelluslaskuri

Interaktiivinen suoran syöksyportaan mitoitustyökalu. Annat kerroskorkeuden,
käytettävissä olevan lattiapituuden ja reisilankun leveyden, ja työkalu laskee
askelmamäärän, nousun ja etenemän sekä tarkistaa täyttyvätkö rakentamismääräykset.

Reaaliaikainen arkkitehtileikkaus piirtyy syötteiden mukaan, reisilankku mukaan lukien.

## Ominaisuudet

- Nousun ja etenemän laskenta valitulle askelmamäärälle (säädettävissä).
- Suositus, joka osuu lähimmäs mukavuussääntöä `2 × nousu + etenemä ≈ 600–630 mm`.
- Määräystenmukaisuuden tarkistus porrastyypeittäin (YM 1007/2017 raja-arvot).
- Reisilankun geometria: kaltevuuskulma, pystykorkeus, alareunan korkeus yläpäässä
  ja vähimmäisleveys askelman kiinnitykseen.
- Live SVG-leikkaus mittaviivoilla.

## Mitoitusperusteet

Raja-arvot perustuvat ympäristöministeriön asetukseen rakennuksen
käyttöturvallisuudesta (1007/2017). Sovelletut nousun maksimit / etenemän minimit (mm):

| Porrastyyppi | nousu ≤ | etenemä ≥ |
|---|---|---|
| Asuinhuoneiston / majoitustilan sisäporras | 190 | 250 |
| Muiden varsinaisten käyttötilojen sisäporras | 180 | 270 |
| Varatie / parvi- tai ullakkoporras | 220 | 220 |
| Hallinto-, palvelu- ja liiketilat, kokoontumistilat | 160 | 300 |
| Uloskäytävä | 180 | 270 |
| Katettu / lämmitetty ulkoporras | 160 | 300 |
| Kattamaton / lämmittämätön ulkoporras | 130 | 390 |

Mukavuussääntö `2 × nousu + etenemä ≈ 600–630 mm` on vakiintunut suunnitteluohje,
ei asetuksen numeroarvo. Tarkista aina paikallisen rakennusvalvonnan tulkinta.

### Kaavat

- nousu `= H / n` (n = nousujen lukumäärä)
- etenemä `= L / (n − 1)`
- kaltevuuskulma `θ = atan(H / L)`
- reisilankun pystykorkeus (pystysahattu yläpääty) `= W / cos θ`
- lankun alareunan korkeus alatasosta yläpäässä `= H − W / cos θ`
- askelman vaatima lankun vähimmäisleveys `= (nousu · etenemä) / √(nousu² + etenemä²)`

## Kehitys

Projekti käyttää **pnpm**-pakettienhallintaa (versio kiinnitetty `package.json`:n
`packageManager`-kenttään, otetaan käyttöön Corepackilla) ja on kirjoitettu
**TypeScriptillä** (React + Vite).

```bash
corepack enable   # ottaa pinnatun pnpm-version käyttöön
pnpm install      # asentaa riippuvuudet
pnpm dev          # vite-kehityspalvelin
pnpm build        # tyyppitarkistus (tsc) + tuotantokäännös dist/-kansioon
pnpm typecheck    # pelkkä tyyppitarkistus
```

## Huomiot

Laskuri olettaa suoran syöksyn. Kiertävässä portaassa etenemä mitataan
kulkulinjalta ja sisäreunalla on omat vähimmäismittansa. Reisilankun yläpääty
oletetaan pystysahatuksi.
