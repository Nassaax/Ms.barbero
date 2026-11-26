# MS Barbero — site vitrine

Site one-page d'un barber shop (noir & blanc, motion design), sans build, en HTML, CSS et JS.

## Ouvrir le site
- **En local** : `python3 -m http.server` dans ce dossier, puis http://localhost:8000.
  Un double-clic sur `index.html` marche aussi, mais un petit serveur reproduit mieux la mise en ligne.
- **En ligne** : glisser le dossier sur Netlify Drop, Vercel ou GitHub Pages. Aucun build n'est nécessaire.

## À compléter avant la mise en ligne → `assets/config.js`
Un champ vide n'apparaît pas sur le site. Rien d'inventé n'est affiché.
- [ ] Adresse + lien Google Maps
- [ ] Horaires
- [ ] Téléphone / WhatsApp
- [ ] Prix (optionnels : sans prix, chaque prestation affiche « Réserver »)
- [ ] Mentions légales : dénomination, n° BCE, TVA (obligatoire pour un site pro en Belgique)
- [ ] TikTok / Facebook, s'ils existent
- [ ] Nom de domaine : remplacer ensuite `og:image` par l'URL absolue (`https://domaine.be/assets/img/og.jpg`)

## À valider avec le client
- La liste des prestations (Coupe homme, Dégradé, Taille de barbe, Coupe + barbe, Enfant) vient du brief type : à confirmer.
- « Est. 2026 » et « Ouverture du salon : 2026 » sont tirés de la publication d'ouverture Instagram (6 octobre).
- Les photos ont été recadrées depuis des captures d'écran Instagram. Les remplacer par les originaux HD
  (mêmes noms de fichiers dans `assets/img/`) améliorera nettement la netteté.
- Pas encore de photos de coupes réalisées : une galerie « Nos coupes » pourra être ajoutée dès qu'il en enverra.

## Structure
```
index.html              page unique (SEO, Open Graph, logo vectoriel inline)
assets/config.js        ← toutes les infos du salon
assets/css/style.css    styles
assets/js/main.js       interactions et animations
assets/vendor/          GSAP 3.12.5, ScrollTrigger, Lenis 1.1.13 (hébergés localement)
assets/img/             photos (N&B), og.jpg
assets/logo.svg         logo MS Barbero vectorisé (réutilisable pour l'impression, les réseaux…)
assets/favicon.svg, apple-touch-icon.png
```

## Motion design
- Intro : le logo se dessine trait par trait, puis le slash du « M/S » coupe l'écran en deux et révèle le hero (version courte aux visites suivantes).
- Révélations en diagonale (même angle que le slash) sur toutes les photos.
- Bandeau défilant dont la vitesse, le sens et l'inclinaison suivent le scroll.
- Manifeste qui s'allume mot par mot ; galerie du salon en défilement horizontal épinglé (carrousel au doigt sur mobile).
- Titre « Ton fauteuil t'attend » lettre par lettre ; sceau « Réserver » magnétique et rotatif.
- Scroll fluide (Lenis), curseur anneau sur desktop, grain argentique.
- Bouton « Réserver » toujours accessible (flottant, barre en bas sur mobile).
- `prefers-reduced-motion` respecté : tout s'affiche sans animation. Si le JS échoue, le contenu reste visible.
