import CategoryPage from './components/CategoryPage.jsx'

const options = {
  'Plaques de texte': {
    icon: 'fa-solid fa-font',
    text: 'Plaques de texte de remplacement pour mettre à jour vos tampons sans changer d’appareil.',
  },
  Encriers: {
    icon: 'fa-solid fa-fill-drip',
    text: 'Cassettes encreuses de rechange pour retrouver une empreinte nette sur vos tampons.',
  },
  'Tampons encreurs': {
    icon: 'fa-solid fa-stamp',
    text: 'Des tampons encreurs pour vos tampons classiques en bois ou en caoutchouc.',
    uses: ['Tampons classiques', 'Plusieurs couleurs', 'Bureau'],
  },
  Encres: {
    icon: 'fa-solid fa-droplet',
    text: 'Des flacons d’encre pour réencrer vos tampons et encreurs et prolonger leur durée de vie.',
    uses: ['Recharge', 'Plusieurs couleurs', 'Économique'],
  },
}

function Accessoires() {
  return (
    <CategoryPage
      parent="Accessoires"
      kicker="Entretien & rechanges"
      sectionTitle="Nos accessoires"
      intro="Plaques de texte, encriers et encres : tout ce qu'il faut pour garder vos tampons comme neufs."
      options={options}
      helpText="Notre équipe vous aide à trouver l'accessoire compatible avec votre tampon."
    />
  )
}

export default Accessoires
