import CategoryPage from './components/CategoryPage.jsx'

const options = {
  'Textes pour tampons Printers': {
    icon: 'fa-solid fa-stamp',
    text: 'Plaques de texte de remplacement pour vos tampons COLOP Printer : changez votre texte sans changer de tampon.',
    uses: ['Printer', 'Changement d’adresse', 'Mise à jour'],
  },
  'Textes pour Dateurs / Numéroteurs': {
    icon: 'fa-regular fa-calendar',
    text: 'Plaques de texte adaptées à vos dateurs et numéroteurs, pour la formule autour de la date ou du numéro.',
    uses: ['Dateurs', 'Numéroteurs', 'Formules'],
  },
  'Textes pour Gammes intensives': {
    icon: 'fa-solid fa-industry',
    text: 'Plaques robustes pour les tampons à usage intensif, conçues pour un marquage net jour après jour.',
    uses: ['Usage intensif', 'Bureau', 'Entrepôt'],
  },
  'Textes pour Gammes intensives dateurs': {
    icon: 'fa-solid fa-calendar-check',
    text: 'Plaques de texte pour les dateurs à usage intensif, avec un rendu précis autour de la date.',
    uses: ['Dateurs intensifs', 'Comptabilité', 'Courrier'],
  },
  'Plaques de texte pour appareils Trodat': {
    icon: 'fa-solid fa-right-left',
    text: 'Plaques de texte compatibles avec les appareils Trodat pour personnaliser vos tampons existants.',
    uses: ['Compatible Trodat', 'Remplacement', 'Personnalisation'],
  },
}

function PlaquesDeTexte() {
  return (
    <CategoryPage
      parent="Accessoires"
      category="Plaques de texte"
      intro="Mettez à jour le texte de vos tampons en remplaçant simplement la plaque : adresse, formule ou coordonnées, sans racheter d'appareil."
      options={options}
    />
  )
}

export default PlaquesDeTexte
