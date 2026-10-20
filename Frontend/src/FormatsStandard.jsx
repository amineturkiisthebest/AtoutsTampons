import CategoryPage from './components/CategoryPage.jsx'

const options = {
  'Plaques boîtes aux lettres': {
    icon: 'fa-solid fa-envelope-open-text',
    text: 'Des plaques gravées résistantes pour identifier clairement votre boîte aux lettres.',
    uses: ['Particuliers', 'Immeubles', 'Extérieur'],
  },
  'Plaques de portes': {
    icon: 'fa-solid fa-door-closed',
    text: 'Des plaques élégantes pour signaler un bureau, une salle ou le nom d’un occupant.',
    uses: ['Bureaux', 'Salles', 'Signalétique'],
  },
  'Plaques professions libérales': {
    icon: 'fa-solid fa-user-tie',
    text: 'Des plaques professionnelles gravées pour présenter votre cabinet ou votre activité à l’entrée.',
    uses: ['Cabinets', 'Médecins', 'Avocats'],
  },
}

const steps = [
  { icon: 'fa-solid fa-ruler-combined', title: 'Choisissez le format', text: 'Sélectionnez le type de plaque adapté à votre usage.' },
  { icon: 'fa-solid fa-pen-ruler', title: 'Personnalisez', text: 'Indiquez votre texte et choisissez la finition de la gravure.' },
  { icon: 'fa-solid fa-truck-fast', title: 'Recevez-la', text: 'Votre plaque est gravée et livrée en 2 à 7 jours ouvrables.' },
]

function FormatsStandard() {
  return (
    <CategoryPage
      parent="Gravures"
      category="Formats standard"
      intro="Des plaques gravées aux formats standard pour votre boîte aux lettres, vos portes ou l'entrée de votre cabinet."
      options={options}
      steps={steps}
      helpText="Notre équipe vous aide à choisir le format et la finition de votre plaque."
    />
  )
}

export default FormatsStandard
