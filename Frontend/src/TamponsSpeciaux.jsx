import CategoryPage from './components/CategoryPage.jsx'

const options = {
  'Gamme écologique': {
    icon: 'fa-solid fa-leaf',
    text: 'Des tampons conçus avec des matériaux recyclés et recyclables, pour un marquage plus responsable.',
    uses: ['Matériaux recyclés', 'Éco-conçu', 'Bureau'],
  },
  'Tampons de poche': {
    icon: 'fa-solid fa-briefcase',
    text: 'Des tampons compacts et protégés, à glisser dans une poche ou un sac pour tamponner partout.',
    uses: ['Nomade', 'Compact', 'Déplacements'],
  },
  Sécurité: {
    icon: 'fa-solid fa-user-shield',
    text: 'Des tampons de sécurité pour masquer les informations confidentielles sur vos documents.',
    uses: ['Confidentialité', 'Données personnelles', 'Courrier'],
  },
  'Presses à estamper': {
    icon: 'fa-solid fa-certificate',
    text: 'Des presses pour gaufrer un sceau en relief sur vos documents officiels, certificats et papiers à en-tête.',
    uses: ['Sceau en relief', 'Documents officiels', 'Prestige'],
  },
  'Gamme EOS': {
    icon: 'fa-solid fa-gem',
    text: 'Une gamme au design élégant pour un tampon aussi beau que pratique sur votre bureau.',
    uses: ['Design', 'Bureau', 'Personnalisation'],
  },
}

function TamponsSpeciaux() {
  return (
    <CategoryPage
      parent="Tampons spéciaux"
      kicker="Usages spécifiques"
      sectionTitle="Nos tampons spéciaux"
      intro="Écologiques, nomades, sécurisés ou en relief : des tampons pensés pour des besoins particuliers."
      options={options}
      helpText="Notre équipe vous aide à trouver le tampon adapté à votre besoin spécifique."
    />
  )
}

export default TamponsSpeciaux
