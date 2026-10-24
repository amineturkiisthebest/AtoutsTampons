import CategoryPage from './components/CategoryPage.jsx'
import { creativeSteps } from './data/steps.js'
import nioImg from './assets/brands/cutouts/nio-school.png'

const options = {
  'NIO école': {
    icon: 'fa-solid fa-school',
    text: "Des tampons d'appréciation et de motivation pour corriger et encourager les élèves en un geste.",
    uses: ['Enseignants', 'Corrections', 'Motivation'],
  },
  'Little NIO': {
    icon: 'fa-solid fa-child-reaching',
    text: 'Des petits tampons ludiques et colorés, faciles à prendre en main pour les plus jeunes.',
    uses: ['Enfants', 'Jeux', 'Récompenses'],
  },
  'Encriers NIO': {
    icon: 'fa-solid fa-droplet',
    text: 'Des encriers de rechange pour garder vos tampons NIO toujours prêts à servir.',
    uses: ['Recharge', 'Couleurs', 'Longue durée'],
  },
}

function Nio() {
  return (
    <CategoryPage
      parent="Tampons créatifs"
      category="NIO"
      intro="Des tampons ludiques pour l'école et la maison : encourager, récompenser et s'amuser en couleurs."
      image={nioImg}
      imageAlt="Tampons NIO aux visages souriants"
      accent="#6aa312"
      options={options}
      steps={creativeSteps}
      helpText="Notre équipe vous aide à choisir les produits NIO adaptés à vos projets."
    />
  )
}

export default Nio
