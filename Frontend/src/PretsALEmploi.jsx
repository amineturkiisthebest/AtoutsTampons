import CategoryPage from './components/CategoryPage.jsx'

const options = {
  'Formules commerciales': {
    icon: 'fa-solid fa-file-signature',
    text: 'Les mentions du quotidien déjà gravées : « Payé », « Reçu », « Urgent », « Copie »… prêtes à tamponner.',
    uses: ['Payé', 'Reçu', 'Urgent'],
  },
  'Multi-formules': {
    icon: 'fa-solid fa-layer-group',
    text: 'Plusieurs formules réunies dans un seul tampon : sélectionnez la mention voulue d’un simple geste.',
    uses: ['Bureau', 'Comptabilité', 'Gain de place'],
  },
  Dateurs: {
    icon: 'fa-regular fa-calendar',
    text: 'Des dateurs standard prêts à l’emploi pour dater vos courriers et documents sans attendre.',
    uses: ['Courrier', 'Factures', 'Archivage'],
  },
  Numéroteurs: {
    icon: 'fa-solid fa-hashtag',
    text: 'Des numéroteurs livrés prêts à l’usage pour numéroter bons, dossiers et documents.',
    uses: ['Bons', 'Dossiers', 'Inventaire'],
  },
}

const steps = [
  { icon: 'fa-solid fa-hand-pointer', title: 'Choisissez', text: 'Sélectionnez la formule ou l’appareil dont vous avez besoin.' },
  { icon: 'fa-solid fa-cart-shopping', title: 'Commandez', text: 'Aucune personnalisation : ajoutez-le directement au panier.' },
  { icon: 'fa-solid fa-truck-fast', title: 'Utilisez-le', text: 'Votre tampon arrive prêt à servir en 2 à 7 jours ouvrables.' },
]

function PretsALEmploi() {
  return (
    <CategoryPage
      parent="Prêts à l'emploi"
      kicker="Disponibles immédiatement"
      sectionTitle="Choisissez votre tampon prêt à l’emploi"
      intro="Des tampons déjà gravés, sans personnalisation à prévoir : commandez-les et utilisez-les dès réception."
      options={options}
      steps={steps}
      helpText="Notre équipe vous aide à trouver le tampon prêt à l’emploi qu’il vous faut."
    />
  )
}

export default PretsALEmploi
