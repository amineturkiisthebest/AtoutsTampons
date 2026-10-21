import CategoryPage from './components/CategoryPage.jsx'
import { creativeSteps } from './data/steps.js'

import markyImg from './assets/brands/cutouts/marky.png'
import woodiesImg from './assets/brands/cutouts/woodies.png'
import ladotImg from './assets/brands/cutouts/ladot.png'
import nioImg from './assets/brands/cutouts/nio-school.png'
import cleanyImg from './assets/brands/cutouts/stamp-cleaner.png'
import inkPadsImg from './assets/brands/cutouts/make-stamp-pads.png'

const options = {
  Marky: {
    img: markyImg,
    alt: 'Tampons textiles MARKY',
    text: 'Le tampon ludique pour marquer vêtements et affaires des enfants avec leur prénom.',
    uses: ['Textiles', 'École', 'Famille'],
  },
  Woodies: {
    img: woodiesImg,
    alt: 'Tampon en bois Woodies et son encrier',
    text: 'Des tampons en bois aux motifs classiques et des encriers colorés pour vos créations.',
  },
  LaDot: {
    img: ladotImg,
    alt: 'Pierres-tampons LaDot',
    text: 'Des tampons-pierres et des encres pour la peau pour créer des tatouages temporaires.',
  },
  NIO: {
    img: nioImg,
    alt: 'Tampons NIO aux visages souriants',
    text: 'Des tampons ludiques pour encourager, récompenser et s’amuser à l’école comme à la maison.',
  },
  Cleany: {
    img: cleanyImg,
    alt: 'Nettoyant pour tampons COLOP',
    text: 'Le nettoyant doux pour entretenir vos tampons et prolonger leur durée de vie.',
    uses: ['Entretien', 'Tous tampons', 'Longue durée'],
  },
  'Encriers & Tampons encreurs': {
    img: inkPadsImg,
    alt: 'Tampons encreurs MAKE de toutes les couleurs',
    text: 'Des encreurs aux couleurs intenses pour donner vie à toutes vos empreintes créatives.',
    uses: ['Couleurs vives', 'Papier', 'Loisirs créatifs'],
  },
}

function TamponsCreatifs() {
  return (
    <CategoryPage
      parent="Tampons créatifs"
      kicker="Arts & Crafts"
      sectionTitle="Nos marques créatives"
      intro="Tampons ludiques, en bois ou pour tatouages temporaires : découvrez nos marques pour créer, décorer et s'amuser."
      options={options}
      steps={creativeSteps}
      helpText="Notre équipe vous aide à choisir les produits créatifs adaptés à vos projets."
    />
  )
}

export default TamponsCreatifs
