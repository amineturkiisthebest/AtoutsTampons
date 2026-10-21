import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './Home.jsx'
import About from './About.jsx'
import TamponsP from './TamponsP.jsx'
import TamponsT from './TamponsT.jsx'
import Dateurs from './Dateurs.jsx'
import Woodies from './Woodies.jsx'
import LaDot from './LaDot.jsx'
import Nio from './Nio.jsx'
import PlaquesDeTexte from './PlaquesDeTexte.jsx'
import Encriers from './Encriers.jsx'
import FormatsStandard from './FormatsStandard.jsx'
import Marky from './Marky.jsx'
import Login from './Login.jsx'
import PretsALEmploi from './PretsALEmploi.jsx'
import TamponsCreatifs from './TamponsCreatifs.jsx'
import TamponsSpeciaux from './TamponsSpeciaux.jsx'
import Accessoires from './Accessoires.jsx'
import Gravures from './Gravures.jsx'
import ImpressionMobile from './ImpressionMobile.jsx'

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
