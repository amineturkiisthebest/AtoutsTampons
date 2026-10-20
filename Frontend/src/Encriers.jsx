import CategoryPage from './components/CategoryPage.jsx'

// No `uses` here: each card lists the models from its own sub-menu instead
const options = {
  'Encriers pour appareils Colop': {
    icon: 'fa-solid fa-fill-drip',
    text: 'Cassettes encreuses de rechange pour retrouver une empreinte nette sur vos tampons COLOP.',
  },
  'Encriers pour appareils Trodat': {
    icon: 'fa-solid fa-droplet',
    text: 'Cassettes encreuses compatibles avec les appareils Trodat, dans plusieurs couleurs d’encre.',
  },
}

function Encriers() {
  return (
    <CategoryPage
      parent="Accessoires"
      category="Encriers"
      intro="Un encrier neuf redonne à votre tampon une empreinte nette et bien encrée. Choisissez la cassette adaptée à votre appareil."
      options={options}
      helpText="Notre équipe vous aide à trouver l'encrier compatible avec votre tampon."
    />
  )
}

export default Encriers
