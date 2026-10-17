# Busriders · maquette de réservation (démo visuelle)

Site statique (HTML/CSS/JS, aucune installation) qui montre le parcours de réservation repensé :
Sorties → Mes choix → Paiement → Mon billet, sur téléphone et sur ordinateur, avec 3 chartes
au choix (bandeau noir en haut de page) : **Bleu nuit**, **Quai 4H**, **Plein cadre**.

**C'est une maquette.** Aucun paiement réel, aucun produit, aucune donnée enregistrée ou envoyée
(tout reste dans le navigateur de la personne). Le QR du billet est un dessin d'exemple, non scannable.
Les valeurs `[X]`, `[À compléter…]`, `[Écrire à l'association]` sont des emplacements à renseigner.

## Voir la maquette en local
Ouvrir `index.html` dans un navigateur (double-clic). Les polices viennent de Google Fonts :
il faut une connexion internet pour qu'elles s'affichent.

## Mettre en ligne avec GitHub Pages (gratuit)
1. Sur github.com : **New repository**, nom `busriders-demo`, visibilité **Public**
   (GitHub Pages gratuit n'est disponible que pour les dépôts publics ; le contenu ne contient
   aucune donnée sensible).
2. Dans le dépôt : **Add file → Upload files**, glisser le contenu du dossier
   (`index.html`, `css/`, `js/`, `README.md`) puis **Commit changes**.
3. **Settings → Pages**. Sous *Build and deployment* : *Source* = **Deploy from a branch**,
   *Branch* = **main**, dossier **/ (root)**, puis **Save**.
4. Attendre 1 à 2 minutes. L'adresse apparaît en haut de la page Pages :
   `https://VOTRE-IDENTIFIANT.github.io/busriders-demo/`
5. Pour ouvrir directement une charte : ajouter `?charte=quai` (ou `nuit`, `cadre`) à l'adresse.

Pour mettre à jour : modifier un fichier sur GitHub (icône crayon) et **Commit changes** ; le site
se met à jour en 1 à 2 minutes.

## Ce qui est à confirmer avant de s'en servir comme référence
- Prix : 73 € (avec forfait) vient du visuel d'annonce ; 45 € (sans forfait) et +4 € (assurance)
  viennent de la boutique actuelle ; 265 € (week-ends) vient de la boutique actuelle.
- Dans la démo, la sortie du 28 novembre est affichée comme ouverte, les week-ends comme « bientôt ».
- Seuil de départ `[X]`, lieux de RDV des week-ends, déroulé, contacts : non renseignés.

## V2 : ajouts
- Clic sur le logo ou « BUSRIDERS » (en-tête) : page de présentation de l'association, condensée.
- **Infos** : menus déroulants Points de RDV (avec lien Itinéraire), Déroulé, Les stations, Nos partenaires, CGV.
  Un clic sur une station ouvre une page intermédiaire, puis le site officiel de la station dans un nouvel onglet.
- **FAQ** (entre Infos et Contact) et **Contact** (e-mail, Instagram).
- **Itinéraire** : à côté des points de RDV (choix, billet, infos), menu pour ouvrir Google Maps, Plans (Apple) ou Waze.
  Le téléphone propose l'application installée. Les liens utilisent l'adresse écrite, pas des coordonnées GPS.

## Origine des contenus V2 (repris de busriders.net le 16/10/2026) et points à vérifier
- Présentation, horaires, partenaires (sans codes promo, retirés car obsolètes), stations avec liens, points de RDV, e-mails, réseaux sociaux,
  numéro de licence transport : repris du site actuel.
- **Liens ajoutés par l'assistant, absents du site actuel** (à vérifier) : Les Sybelles, Courchevel, Valmorel.
- Pin du RDV de Nîmes : l'adresse exacte n'est pas précisée sur le site (« parking de la barrière de péage, sortie
  Nîmes-Ouest »). Vérifier que Google Maps tombe bien au bon endroit.
- Adresse de contact : busridersmtp@gmail.com (choix de l'association). Seul le compte Instagram busriders_mtp est lié.
- La FAQ reformule des informations du site et des CGV ; elle n'a pas été relue par l'association.
- Sur le site actuel, le lien « plan des pistes » des 2 Alpes est mal formé : il n'est pas repris.

## V4 : éléments juridiques (textes PROVISOIRES, issus des instructions de redesign)
- Paiement : un bloc nominatif complet par participant (prénom, nom, e-mail, mobile) et case unique d'adhésion + acceptation des CGV, de la Politique de Confidentialité et de la Charte.
- Page « Charte du Participant » avec encadré « Tolérance zéro » ; pages Confidentialité et Mentions : emplacements « en cours de finalisation ».
- Infos : Charte, Mineurs (16-17 ans), Téléchargements (boutons de démonstration, PDF à ajouter), « CGV & Adhésion ».
- Pied de page : CGV & Adhésion, Politique de Confidentialité (RGPD), Charte du Participant, Mentions Légales ; e-mail busridersmtp@gmail.com partout.
- Ces textes n'ont pas été relus juridiquement : ils seront remplacés par les documents définitifs.
