/* ==========================================================================
   MS BARBERO — CONFIGURATION DU SITE
   --------------------------------------------------------------------------
   Remplis ce fichier avec les vraies informations du salon.
   Un champ laissé vide ("") n'est PAS affiché sur le site : rien d'inventé
   n'apparaît. Les blocs (adresse, horaires, téléphone, WhatsApp, prix,
   mentions légales) apparaissent automatiquement dès qu'ils sont remplis.
   ========================================================================== */
window.MS_CONFIG = {
  name: "MS Barbero",

  /* Réservation en ligne (EasyWeek) — lien nettoyé des paramètres de suivi Instagram */
  bookingUrl: "https://msbarbero.easyweek.be/?utm_source=site&utm_medium=web",

  /* Réseaux */
  instagram: "https://www.instagram.com/ms.barbero/",
  tiktok: "",      // ex. "https://www.tiktok.com/@ms.barbero"
  facebook: "",    // ex. "https://www.facebook.com/…"

  /* Adresse du salon (affichée + utilisée pour Google) */
  address: {
    street: "",      // ex. "Rue de la Station 12"
    postalCode: "",  // ex. "4000"
    city: "",        // ex. "Liège"
    country: "BE"
  },
  mapsUrl: "",       // lien Google Maps de la fiche du salon

  /* Contact */
  phone: "",         // affiché tel quel, ex. "04 123 45 67"
  whatsapp: "",      // format international SANS "+" ni espaces, ex. "32470123456"

  /* Horaires — une ligne par plage. Laisser [] pour masquer le bloc.
     ex. { days: "Mardi – Samedi", time: "9h – 19h" },
         { days: "Dimanche – Lundi", time: "Fermé" } */
  hours: [],

  /* Prix (optionnels). Laisser "" pour afficher « Réserver » à la place. */
  prices: {
    "coupe": "",        // ex. "20 €"
    "degrade": "",
    "barbe": "",
    "coupe-barbe": "",
    "enfant": ""
  },

  /* Mentions légales (obligatoires en Belgique pour un site professionnel).
     Le lien « Mentions légales » du pied de page apparaît quand company + bce sont remplis. */
  legal: {
    company: "",   // dénomination officielle, ex. "MS Barbero SRL" ou "Nom Prénom (personne physique)"
    bce: "",       // numéro d'entreprise BCE, ex. "BE 0123.456.789"
    vat: "",       // "Assujetti TVA" / "Non assujetti (franchise TVA)"
    address: "",   // siège social si différent du salon
    email: ""      // email de contact
  }
};
