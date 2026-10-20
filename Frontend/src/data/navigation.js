// Menu entries are either a label string or { label, children } for a nested menu
export const navLinks = [
  {
    label: 'Tampons personnalisés',
    to: '/tampons-p',
    children: [
      { label: 'Tampons de texte', to: '/tampons-t', children: ['Rectangulaires', 'Longs', 'Carrés', 'Ronds et ovales'] },
      { label: 'Dateurs', to: '/dateurs', children: ['Rectangulaires', 'Carrés', 'Ronds et ovales', 'Grandes tailles', 'Doubles dateurs'] },
      { label: 'Numéroteurs' },
    ],
  },
  {
    label: "Prêts à l'emploi",
    children: [
      { label: 'Formules commerciales' },
      { label: 'Multi-formules' },
      { label: 'Dateurs' },
      { label: 'Numéroteurs' },
    ],
  },
  {
    label: 'Tampons créatifs',
    children: [
      { label: 'Marky', to: '/marky' },
      { label: 'Woodies', to: '/woodies', children: ['Woodies montures', 'Woodies encriers'] },
      { label: 'LaDot', to: '/ladot', children: ['Pierres', 'Encres & Liners & Strass', 'Coffrets'] },
      { label: 'NIO', to: '/nio', children: ['NIO école', 'Little NIO', 'Encriers NIO'] },
      { label: 'Cleany' },
      { label: 'Encriers & Tampons encreurs' },
    ],
  },
  {
    label: 'Tampons spéciaux',
    children: ['Gamme écologique', 'Tampons de poche', 'Sécurité', 'Presses à estamper', 'Gamme EOS'],
  },
  {
    label: 'Accessoires',
    children: [
      {
        label: 'Plaques de texte',
        to: '/plaques-de-texte',
        children: [
          'Textes pour tampons Printers',
          'Textes pour Dateurs / Numéroteurs',
          'Textes pour Gammes intensives',
          'Textes pour Gammes intensives dateurs',
          'Plaques de texte pour appareils Trodat',
        ],
      },
      {
        label: 'Encriers',
        to: '/encriers',
        children: [
          {
            label: 'Encriers pour appareils Colop',
            children: ['COLOP Printer / Pocket / Mini', 'COLOP Office / Classic / Expert', 'Encriers bicolores'],
          },
          'Encriers pour appareils Trodat',
        ],
      },
      'Tampons encreurs',
      'Encres',
    ],
  },
  {
    label: 'Gravures',
    children: [
      { label: 'Formats standard', to: '/formats-standard', children: ['Plaques boîtes aux lettres', 'Plaques de portes', 'Plaques professions libérales'] },
      'À la ligne',
    ],
  },
  {
    label: 'Impression mobile',
    children: ['e-mark Pro', 'e-mark go', 'e-mark create', 'Accessoires'],
  },
]
