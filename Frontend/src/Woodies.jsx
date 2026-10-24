import CategoryPage from './components/CategoryPage.jsx'
import { creativeSteps } from './data/steps.js'
import woodiesImg from './assets/brands/cutouts/woodies.webp'

const options = {
  'Woodies montures': {
    icon: 'fa-solid fa-stamp',
    text: 'Des tampons en bois naturel aux motifs classiques, à collectionner et à combiner pour vos créations.',
    uses: ['Scrapbooking', 'Cartes', 'Décoration'],
  },
  'Woodies encriers': {
    icon: 'fa-solid fa-droplet',
    text: 'Des encriers aux couleurs vives et naturelles, parfaitement adaptés aux tampons Woodies.',
    uses: ['Papier', 'Carton', 'Couleurs vives'],
  },
}

function Woodies() {
  return (
    <CategoryPage
      parent="Tampons créatifs"
      category="Woodies"
      intro="Des tampons en bois aux motifs classiques et des encriers colorés pour décorer cartes, carnets et emballages."
      image={woodiesImg}
      imageAlt="Tampon en bois Woodies et son encrier"
      accent="#2f7d4f"
      options={options}
      steps={creativeSteps}
      helpText="Notre équipe vous aide à choisir les produits Woodies adaptés à vos projets."
    />
  )
}

export default Woodies
