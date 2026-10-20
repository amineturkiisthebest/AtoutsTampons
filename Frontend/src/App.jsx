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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="a-propos" element={<About />} />
          <Route path="tampons-p" element={<TamponsP />} />
          <Route path="tampons-t" element={<TamponsT />} />
          <Route path="dateurs" element={<Dateurs />} />
          <Route path="woodies" element={<Woodies />} />
          <Route path="ladot" element={<LaDot />} />
          <Route path="nio" element={<Nio />} />
          <Route path="plaques-de-texte" element={<PlaquesDeTexte />} />
          <Route path="encriers" element={<Encriers />} />
          <Route path="formats-standard" element={<FormatsStandard />} />
          <Route path="marky" element={<Marky />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
