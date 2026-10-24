import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './Home.jsx'

// Every page except the home page is loaded on demand, so the first visit only downloads what it shows
const About = lazy(() => import('./About.jsx'))
const TamponsP = lazy(() => import('./TamponsP.jsx'))
const TamponsT = lazy(() => import('./TamponsT.jsx'))
const Dateurs = lazy(() => import('./Dateurs.jsx'))
const Woodies = lazy(() => import('./Woodies.jsx'))
const LaDot = lazy(() => import('./LaDot.jsx'))
const Nio = lazy(() => import('./Nio.jsx'))
const PlaquesDeTexte = lazy(() => import('./PlaquesDeTexte.jsx'))
const Encriers = lazy(() => import('./Encriers.jsx'))
const FormatsStandard = lazy(() => import('./FormatsStandard.jsx'))
const Marky = lazy(() => import('./Marky.jsx'))
const Login = lazy(() => import('./Login.jsx'))
const PretsALEmploi = lazy(() => import('./PretsALEmploi.jsx'))
const TamponsCreatifs = lazy(() => import('./TamponsCreatifs.jsx'))
const TamponsSpeciaux = lazy(() => import('./TamponsSpeciaux.jsx'))
const Accessoires = lazy(() => import('./Accessoires.jsx'))
const Gravures = lazy(() => import('./Gravures.jsx'))
const ImpressionMobile = lazy(() => import('./ImpressionMobile.jsx'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="a-propos" element={<About />} />
          <Route path="tampons-p" element={<TamponsP />} />
          <Route path="prets-a-l-emploi" element={<PretsALEmploi />} />
          <Route path="tampons-creatifs" element={<TamponsCreatifs />} />
          <Route path="tampons-speciaux" element={<TamponsSpeciaux />} />
          <Route path="accessoires" element={<Accessoires />} />
          <Route path="gravures" element={<Gravures />} />
          <Route path="impression-mobile" element={<ImpressionMobile />} />
          <Route path="tampons-t" element={<TamponsT />} />
          <Route path="dateurs" element={<Dateurs />} />
          <Route path="woodies" element={<Woodies />} />
          <Route path="ladot" element={<LaDot />} />
          <Route path="nio" element={<Nio />} />
          <Route path="plaques-de-texte" element={<PlaquesDeTexte />} />
          <Route path="encriers" element={<Encriers />} />
          <Route path="formats-standard" element={<FormatsStandard />} />
          <Route path="marky" element={<Marky />} />
          <Route path="connexion" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
