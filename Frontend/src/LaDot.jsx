import CategoryPage from './components/CategoryPage.jsx'
import { creativeSteps } from './data/steps.js'
import ladotImg from './assets/brands/cutouts/ladot.png'

const options = {
  Pierres: {
    icon: 'fa-regular fa-gem',
    text: 'Des pierres-tampons aux motifs uniques pour appliquer des tatouages temporaires en quelques secondes.',
    uses: ['Tatouages', 'Fêtes', 'Motifs uniques'],
  },
  'Encres & Liners & Strass': {
    icon: 'fa-solid fa-wand-magic-sparkles',
    text: 'Encres pour la peau, liners et strass pour colorer, souligner et faire briller vos tatouages.',
    uses: ['Couleurs', 'Contours', 'Paillettes'],
  },
  Coffrets: {
    icon: 'fa-solid fa-gift',
    text: "Des sets complets prêts à offrir, avec pierres, encre et accessoires pour bien commencer.",
    uses: ['Cadeau', 'Débutants', 'Sets complets'],
  },
}

function LaDot() {
  return (
    <CategoryPage
      parent="Tampons créatifs"
      category="LaDot"
      intro="Des tampons-pierres et des encres pour la peau pour créer des tatouages temporaires originaux, pour petits et grands."
      image={ladotImg}
      imageAlt="Pierres-tampons LaDot pour tatouages temporaires"
      accent="#d9628f"
      options={options}
      steps={creativeSteps}
      helpText="Notre équipe vous aide à choisir les produits LaDot adaptés à vos projets."
    />
  )
}

export default LaDot
