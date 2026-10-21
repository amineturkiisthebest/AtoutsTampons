import CategoryPage from './components/CategoryPage.jsx'

const options = {
  'Formats standard': {
    icon: 'fa-solid fa-ruler-combined',
    text: 'Des plaques gravées aux formats standard pour boîtes aux lettres, portes et professions libérales.',
  },
  'À la ligne': {
    icon: 'fa-solid fa-pen-nib',
    text: 'Une gravure sur mesure, facturée à la ligne de texte, pour les plaques aux dimensions particulières.',
    uses: ['Sur mesure', 'Dimensions libres', 'Texte libre'],
  },
}

const steps = [
  { icon: 'fa-solid fa-ruler-combined', title: 'Choisissez le format', text: 'Format standard ou gravure sur mesure à la ligne.' },
  { icon: 'fa-solid fa-pen-ruler', title: 'Personnalisez', text: 'Indiquez votre texte et choisissez la finition de la gravure.' },
  { icon: 'fa-solid fa-truck-fast', title: 'Recevez-la', text: 'Votre plaque est gravée et livrée en 2 à 7 jours ouvrables.' },
]

function Gravures() {
  return (
    <CategoryPage
      parent="Gravures"
      kicker="Plaques gravées"
      sectionTitle="Nos gravures"
      intro="Des plaques gravées résistantes et élégantes, aux formats standard ou entièrement sur mesure."
      options={options}
      steps={steps}
      helpText="Notre équipe vous aide à choisir le format et la finition de votre plaque."
    />
  )
}

export default Gravures
