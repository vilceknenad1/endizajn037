# EN-DIZAJN — sajt (statička verzija za GitHub Pages)

Čist HTML, CSS i JavaScript. Nema build koraka, nema zavisnosti.

## Struktura

```
index.html            početna (hero „Dva sveta“, O nama, Za vaš dom, Za dečiju sobu, Inspiracija, newsletter)
katalog.html          katalog + stranica proizvoda i konfigurator (/katalog?model=zeka)
404.html              stranica za grešku
vercel.json           čisti URL-ovi (/katalog), keširanje, sigurnosna zaglavlja
assets/css/main.css   svi tokeni (boje, tipografija, pokreti) i komponente — jedan fajl za podešavanje
assets/css/fonts.css  lokalni fontovi (Cormorant Garamond, Hanken Grotesk; latin + latin-ext)
assets/js/main.js     zaglavlje, meni, animacije, kursor, newsletter
assets/js/katalog.js  podaci o modelima, filteri, konfigurator
assets/img/           obrađene slike (NN.webp + verzije 640 i 1024 px)
```

## Objava na GitHub Pages

Sve putanje su relativne, pa sajt radi i na `korisnik.github.io/ime-repozitorijuma/` i na sopstvenom domenu.

**Preko web interfejsa (bez komandne linije):**
1. Na github.com napravite novi repozitorijum, npr. `en-dizajn` (Public; za Private je potreban plaćeni plan za Pages).
2. „uploading an existing file“ → prevucite **sav sadržaj** raspakovanog foldera (ne sam folder), uključujući `.nojekyll`.
   Na macOS-u skrivene fajlove u Finderu prikazujete sa Cmd + Shift + .
3. Commit changes.
4. Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → Save.
5. Posle 1–2 minuta sajt je na `https://korisnik.github.io/en-dizajn/`.

**Preko komandne linije:**
```bash
cd en-dizajn-github
git init -b main
git add .
git commit -m "EN-DIZAJN sajt"
git remote add origin https://github.com/KORISNIK/en-dizajn.git
git push -u origin main
```
Zatim korak 4 iznad.

**Sopstveni domen:** Settings → Pages → Custom domain (npr. `endizajn.rs`), pa kod registrara domena dodajte DNS zapise
koje GitHub prikaže. Uključite „Enforce HTTPS“. Posle toga upišite adresu u `robots.txt` i `sitemap.xml`.

**Napomene:**
- `.nojekyll` mora da ostane u korenu (GitHub inače preskače neke fajlove).
- Adrese bez `.html` rade (`/katalog`), kao i linkovi konfiguracije (`katalog?model=zeka&mere=120…`).
- `vercel.json` GitHub ignoriše. Može da ostane ako želite i Vercel kao rezervu.

## Pre puštanja u javnost (otvorene stavke)

Sve što nije potvrđeno je na sajtu vidljivo označeno kao `[[PLACEHOLDER: …]]`:
- cene i cenovnik, naziv kreveta sa mišjim ušima;
- biblioteka štofova (tonovi su privremeni), politika slanja uzoraka;
- materijal i konstrukcija, garancija, rok izrade, rok i cena dostave, načini plaćanja;
- telefon, Viber, WhatsApp, email, adresa, radno vreme, PIB/MB i pravni tekstovi;
- servis za newsletter (forma je sada samo prikaz, ne šalje podatke — `assets/js/main.js`, TODO);
- vektorski logo (sada je rekonstrukcija monograma);
- prave fotografije iz domova kupaca (Realizacije), profesionalno snimanje, potvrda da li su slike renderi i dozvola za korišćenje.

Linkovi Materijali i Atelje, kao i korpa, još nemaju svoje stranice (vode na `#`).
