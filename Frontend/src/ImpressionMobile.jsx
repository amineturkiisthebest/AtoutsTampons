import CategoryPage from './components/CategoryPage.jsx'

const options = {
  'e-mark Pro': {
    icon: 'fa-solid fa-print',
    text: 'L’imprimante mobile professionnelle pour imprimer textes, logos et codes sur de nombreuses surfaces.',
    uses: ['Professionnels', 'Logos', 'Codes'],
  },
  'e-mark go': {
    icon: 'fa-solid fa-mobile-screen',
    text: 'L’imprimante portable compacte, pilotée depuis votre smartphone, pour imprimer partout en couleur.',
    uses: ['Portable', 'Application', 'Couleur'],
  },
  'e-mark create': {
    icon: 'fa-solid fa-palette',
    text: 'La version créative pour personnaliser cartes, emballages et objets avec vos propres motifs.',
    uses: ['Loisirs créatifs', 'Décoration', 'Cadeaux'],
  },
  Accessoires: {
    icon: 'fa-solid fa-toolbox',
    text: 'Cartouches, supports et accessoires pour équiper et entretenir votre imprimante e-mark.',
    uses: ['Cartouches', 'Supports', 'Entretien'],
  },
}

function ImpressionMobile() {
  return (
    <CategoryPage
      parent="Impression mobile"
      kicker="Imprimer partout"
      sectionTitle="La gamme e-mark"
      intro="Les imprimantes mobiles e-mark impriment textes, logos et images en couleur sur de nombreuses surfaces."
      options={options}
      helpText="Notre équipe vous aide à choisir l'imprimante e-mark adaptée à votre usage."
    />
  )
}

export default ImpressionMobile
