import { memo } from 'react'

const footerColumns = {
  'Tampons traditionnels': ['Trouver un revendeur', 'Espace partenaire', 'Systèmes & matériaux', 'Actualités'],
  'Impression mobile': ['Trouver un revendeur', 'Espace partenaire', 'Support', 'Blog'],
  'Arts & Crafts': ['Espace partenaire', 'Projets'],
  Infos: ['Mentions légales', 'Politique de confidentialité', 'Conditions générales', 'Contactez-nous'],
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {Object.entries(footerColumns).map(([title, links]) => (
          <div key={title}>
            <h3>{title}</h3>
            {links.map((link) => (
              <a key={link} href="#">{link}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <div className="copyright">&copy; {new Date().getFullYear()} by COLOP Stempelerzeugung Skopek Gesellschaft m.b.H. &amp; Co. KG.</div>
        <div className="social-row">
          <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" aria-label="Pinterest"><i className="fa-brands fa-pinterest-p"></i></a>
          <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
