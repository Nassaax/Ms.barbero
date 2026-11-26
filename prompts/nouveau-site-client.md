# Nouveau site client — avec le skill motionsites-web-builder

Utilise le skill **motionsites-web-builder** et suis tout son workflow (brief → exemples → médias → spec → build → captures et corrections → livraison).

## Brief client
- Nom du commerce : [nom]
- Métier : [ex. barber shop, restaurant, institut de beauté…]
- Ville / adresse complète : [adresse ou « à compléter »]
- Cible et positionnement : [ex. jeune, ambitieux, haut de gamme, familial…]
- Ambiance souhaitée : [ex. noir & blanc urbain, noir et or vintage, minimal clair…]
- Logo : [fichier joint / capture du profil Instagram / à créer]
- Photos : [jointes / captures Instagram jointes / pas encore]
- Services et prix : [liste, ou « ne pas afficher les prix »]
- Horaires : [ou « à compléter »]
- Réservation / contact : [lien Planity/Booksy/EasyWeek…, WhatsApp, téléphone, sans rendez-vous]
- Réseaux : [Instagram, TikTok, Facebook]
- Avis clients réels : [texte + auteur + source, ou rien]
- Mentions légales : [nom officiel, n° BCE, TVA oui/non, ou « à compléter »]
- Nom de domaine : [acheté chez … / pas encore]
- Objectif n°1 du site : [réservations / appels / montrer le style]
- En plus : [ex. galerie, page tarifs, bouton « Réserver » toujours visible…]

## Règles de contenu
1. **Ne jamais inventer** d'adresse, de prix, d'horaires, d'avis, de chiffres ou de diplômes. Tout ce qui est inconnu va dans `assets/config.js`. Un champ vide ne s'affiche pas : jamais de « Lorem », de « [à compléter] » ni de faux avis à l'écran.
2. Si un lien ou une page est inaccessible (réseau bloqué), dis-le et continue avec la config, sans deviner.
3. Les textes sont en français, au ton de la marque (tutoiement si la cible est jeune), courts et précis. Le titre a un vrai point de vue, et les boutons commencent par un verbe (« Réserver mon créneau »).
4. Nettoie les liens de réservation (retire `fbclid`, les paramètres Instagram, etc.).
5. Liste dans le README tout ce que tu as supposé et qu'il faut faire valider par le client.

## Médias
- Utilise les **vraies photos du client**. Si je n'envoie que des captures Instagram, recadre proprement les images (sans l'interface Instagram), avec les mêmes noms de fichiers pour pouvoir les remplacer par les originaux HD.
- **Vectorise le logo** en SVG (potrace), séparé en parties animables (symbole / texte), et réutilise-le pour le favicon, l'icône Apple, la navigation et le pied de page.
- Génère une image `og.jpg` en 1200×630 pour les partages.

## Motion design
- Trouve **une idée signature tirée de l'identité du client** (une forme du logo, un objet du lieu, un motif), et applique-la partout : intro, transitions, révélations d'images.
- Base : loader court (version raccourcie aux visites suivantes), entrée du hero chorégraphiée, révélations au scroll, au moins une section épinglée ou horizontale, bandeau défilant qui réagit au scroll, un bouton magnétique, du grain, un scroll fluide (Lenis).
- Doit rester **sobre** : une seule technique lourde par page, rien qui clignote en boucle.
- Obligatoire : `prefers-reduced-motion` respecté, contenu visible même si le JS plante (loader avec filet de sécurité), vraie version mobile (carrousel au doigt au lieu de l'épinglage).

## Technique
- Site statique sans build : `index.html` + `assets/css` + `assets/js` + `assets/config.js` + `assets/img`.
- **Bibliothèques hébergées dans le projet** (GSAP, ScrollTrigger, Lenis dans `assets/vendor/`, récupérées via npm), pas de CDN. Seules les Google Fonts sont chargées de l'extérieur.
- SEO local : titre et description, Open Graph, favicon, `lang="fr-BE"`, données structurées schema.org adaptées au métier (HairSalon, Restaurant, BeautySalon…) générées depuis la config, avec ReserveAction vers le lien de réservation.
- Mentions légales belges : modale alimentée par la config, affichée seulement si le nom officiel et le n° BCE sont remplis.
- Bouton de réservation toujours accessible (flottant sur desktop, barre en bas sur mobile).

## Vérification
- Captures Playwright en desktop 1440×900 et mobile 390×844, section par section, avec rapport : erreurs console, requêtes en échec, images cassées, débordement horizontal, polices chargées.
- Teste aussi le menu mobile et le mode animations réduites.
- Note la page avec la grille du skill. Corrige les 3 points les plus faibles et refais les captures, jusqu'à une moyenne d'au moins 8 sans note sous 7.

## Livraison
1. Commit et push sur la branche de travail.
2. README en français : comment ouvrir le site, checklist de `config.js`, points à valider avec le client, résumé du motion design.
3. Déploie sur Vercel (projet connecté au dépôt GitHub, déploiement de production). Donne-moi l'URL et vérifie le réglage « Deployment Protection » pour que le lien soit public.
4. Envoie-moi les captures finales desktop et mobile, plus un résumé en 3 lignes de l'idée signature.
