import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import logo from './assets/logo-atouts-tampons.png'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

const fields = {
  firstName: { label: 'Prénom', type: 'text', icon: 'fa-regular fa-user', autoComplete: 'given-name', placeholder: 'Votre prénom' },
  lastName: { label: 'Nom', type: 'text', icon: 'fa-regular fa-user', autoComplete: 'family-name', placeholder: 'Votre nom' },
  email: { label: 'E-mail', type: 'email', icon: 'fa-regular fa-envelope', autoComplete: 'email', placeholder: 'vous@exemple.fr' },
  password: { label: 'Mot de passe', type: 'password', icon: 'fa-solid fa-lock', autoComplete: 'current-password', placeholder: 'Votre mot de passe' },
  confirm: { label: 'Confirmer le mot de passe', type: 'password', icon: 'fa-solid fa-lock', autoComplete: 'new-password', placeholder: 'Saisissez-le à nouveau' },
}

// Everything that differs between the three tabs of the page
const modes = {
  client: {
    tab: 'Client',
    tabIcon: 'fa-regular fa-user',
    eyebrow: 'Espace client',
    title: 'Se connecter',
    intro: 'Saisissez votre e-mail et votre mot de passe pour accéder à votre compte.',
    fields: ['email', 'password'],
    remember: true,
    forgotPassword: true,
    submit: 'Se connecter',
    submitIcon: 'fa-solid fa-right-to-bracket',
    aside: {
      title: 'Heureux de vous revoir !',
      text: 'Connectez-vous à votre espace client pour retrouver vos tampons et commander plus rapidement.',
      benefits: [
        { icon: 'fa-solid fa-box', text: 'Suivez vos commandes en temps réel' },
        { icon: 'fa-solid fa-rotate-right', text: 'Recommandez vos tampons en un clic' },
        { icon: 'fa-solid fa-location-dot', text: 'Enregistrez vos adresses de livraison' },
      ],
    },
  },
  inscription: {
    tab: 'Inscription',
    tabIcon: 'fa-solid fa-user-plus',
    eyebrow: 'Nouveau client',
    title: 'Créer un nouveau compte',
    intro: 'Quelques informations suffisent pour créer votre espace client.',
    fields: ['firstName', 'lastName', 'email', 'password', 'confirm'],
    terms: true,
    submit: 'Créer mon compte',
    submitIcon: 'fa-solid fa-user-plus',
    aside: {
      title: 'Bienvenue chez Atouts Tampons',
      text: 'Créez votre compte en moins d’une minute et profitez d’une commande simplifiée.',
      benefits: [
        { icon: 'fa-solid fa-pen-ruler', text: 'Retrouvez vos tampons personnalisés' },
        { icon: 'fa-solid fa-bolt', text: 'Commandez plus vite grâce à vos informations enregistrées' },
        { icon: 'fa-solid fa-envelope-open-text', text: 'Recevez le suivi de vos commandes par e-mail' },
      ],
    },
  },
  revendeur: {
    tab: 'Revendeur',
    tabIcon: 'fa-solid fa-store',
    eyebrow: 'Espace revendeur',
    title: 'Connexion revendeur',
    intro: 'Accédez à votre espace professionnel avec les identifiants de votre compte revendeur.',
    fields: ['email', 'password'],
    remember: true,
    forgotPassword: true,
    submit: 'Accéder à l’espace revendeur',
    submitIcon: 'fa-solid fa-store',
    aside: {
      title: 'Espace professionnel',
      text: 'Un accès dédié aux revendeurs Atouts Tampons et COLOP.',
      benefits: [
        { icon: 'fa-solid fa-tags', text: 'Consultez vos tarifs revendeur' },
        { icon: 'fa-solid fa-boxes-stacked', text: 'Passez vos commandes en volume' },
        { icon: 'fa-solid fa-file-invoice', text: 'Retrouvez vos factures et bons de livraison' },
      ],
    },
  },
}

const validate = (mode, values) => {
  const errors = {}
  const config = modes[mode]

  if (config.fields.includes('firstName') && !values.firstName.trim()) errors.firstName = 'Veuillez saisir votre prénom.'
  if (config.fields.includes('lastName') && !values.lastName.trim()) errors.lastName = 'Veuillez saisir votre nom.'

  if (!values.email.trim()) errors.email = 'Veuillez saisir votre adresse e-mail.'
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Adresse e-mail invalide.'

  if (!values.password) errors.password = 'Veuillez saisir votre mot de passe.'
  else if (mode === 'inscription' && values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`
  }

  if (config.fields.includes('confirm') && values.confirm !== values.password) {
    errors.confirm = 'Les mots de passe ne correspondent pas.'
  }
  if (config.terms && !values.terms) errors.terms = 'Veuillez accepter les conditions générales.'

  return errors
}

const emptyValues = { firstName: '', lastName: '', email: '', password: '', confirm: '', remember: false, terms: false }

function AuthForm({ mode }) {
  const config = modes[mode]
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const updateField = (event) => {
    const { name, type, value, checked } = event.target
    const next = { ...values, [name]: type === 'checkbox' ? checked : value }
    setValues(next)
    if (touched[name] || (name === 'password' && touched.confirm)) setErrors(validate(mode, next))
  }

  const markTouched = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }))
    setErrors(validate(mode, values))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formErrors = validate(mode, values)
    setErrors(formErrors)
    setTouched(Object.fromEntries([...config.fields, 'terms'].map((name) => [name, true])))
    if (Object.keys(formErrors).length > 0) return

    // TODO: send `values` for this `mode` to the backend
  }

  const fieldError = (name) => (touched[name] ? errors[name] : undefined)

  const renderField = (name) => {
    const field = fields[name]
    const isPassword = field.type === 'password'
    const id = `${mode}-${name}`
    const error = fieldError(name)
    const autoComplete = name === 'password' && mode === 'inscription' ? 'new-password' : field.autoComplete

    return (
      <div key={name} className={`login-field login-field--${name}${error ? ' has-error' : ''}`}>
        <div className="login-field__label-row">
          <label htmlFor={id}>{field.label}</label>
          {name === 'password' && config.forgotPassword && <a className="login-link" href="#">Mot de passe oublié ?</a>}
        </div>
        <div className="login-input">
          <i className={field.icon} aria-hidden="true"></i>
          <input
            id={id}
            name={name}
            type={isPassword && showPassword ? 'text' : field.type}
            inputMode={field.type === 'email' ? 'email' : undefined}
            autoComplete={autoComplete}
            placeholder={field.placeholder}
            value={values[name]}
            onChange={updateField}
            onBlur={markTouched}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
           
          />
          {name === 'password' && (
            <button
              className="login-input__toggle"
              type="button"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((shown) => !shown)}
            >
              <i className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} aria-hidden="true"></i>
            </button>
          )}
        </div>
        {error && <p className="login-error" id={`${id}-error`}>{error}</p>}
        {name === 'password' && mode === 'inscription' && !error && (
          <p className="login-hint">Au moins {MIN_PASSWORD_LENGTH} caractères.</p>
        )}
      </div>
    )
  }

  return (
    <>
      <span className="eyebrow">{config.eyebrow}</span>
      <h1 id="login-title">{config.title}</h1>
      <p className="login-card__intro">{config.intro}</p>

      <form className={`login-form login-form--${mode}`} onSubmit={handleSubmit} noValidate>
        {config.fields.map(renderField)}

        {config.remember && (
          <label className="login-check">
            <input type="checkbox" name="remember" checked={values.remember} onChange={updateField} />
            <span>Se souvenir de moi</span>
          </label>
        )}

        {config.terms && (
          <div className={`login-field${fieldError('terms') ? ' has-error' : ''}`}>
            <label className="login-check">
              <input
                type="checkbox"
                name="terms"
                checked={values.terms}
                onChange={updateField}
                onBlur={markTouched}
                aria-invalid={Boolean(fieldError('terms'))}
                aria-describedby={fieldError('terms') ? `${mode}-terms-error` : undefined}
               
              />
              <span>J'accepte les <a className="login-link" href="#">conditions générales de vente</a></span>
            </label>
            {fieldError('terms') && <p className="login-error" id={`${mode}-terms-error`}>{fieldError('terms')}</p>}
          </div>
        )}

        <button className="btn login-submit" type="submit">
          <i className={config.submitIcon} aria-hidden="true"></i>{config.submit}
        </button>
      </form>
    </>
  )
}

function Login() {
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = modes[searchParams.get('mode')] ? searchParams.get('mode') : 'client'
  const config = modes[mode]

  const selectMode = (next) => {
    setSearchParams(next === 'client' ? {} : { mode: next }, { replace: true })
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <aside className="login-aside">
          <img className="login-aside__logo" src={logo} alt="Atouts Tampons" />
          <h2>{config.aside.title}</h2>
          <p>{config.aside.text}</p>
          <ul className="login-benefits">
            {config.aside.benefits.map((benefit) => (
              <li key={benefit.text}>
                <i className={benefit.icon} aria-hidden="true"></i>
                {benefit.text}
              </li>
            ))}
          </ul>
        </aside>

        <section className="login-card" aria-labelledby="login-title">
          <div className="login-tabs" role="tablist" aria-label="Type de connexion">
            {Object.entries(modes).map(([key, item]) => (
              <button
                key={key}
                id={`login-tab-${key}`}
                type="button"
                role="tab"
                className={`login-tab${key === mode ? ' is-active' : ''}`}
                aria-selected={key === mode}
                aria-controls="login-panel"
                onClick={() => selectMode(key)}
              >
                <i className={item.tabIcon} aria-hidden="true"></i>
                {item.tab}
              </button>
            ))}
          </div>

          <div id="login-panel" role="tabpanel" aria-labelledby={`login-tab-${mode}`}>
            {/* key: switching tab starts from an empty form */}
            <AuthForm key={mode} mode={mode} />
          </div>

          <div className="login-footer">
            {mode === 'client' && (
              <p>Pas encore de compte ? <button type="button" className="login-link" onClick={() => selectMode('inscription')}>Créer un compte</button></p>
            )}
            {mode === 'inscription' && (
              <p>Déjà client ? <button type="button" className="login-link" onClick={() => selectMode('client')}>Se connecter</button></p>
            )}
            {mode === 'revendeur' && (
              <p>
                Pas encore revendeur ?{' '}
                <a className="login-link" href="mailto:contact@atoutstampons.fr?subject=Demande%20de%20revendeur">Faire une demande</a>
              </p>
            )}
            <p className="login-back">
              <Link to="/"><i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Retour à l'accueil</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login
