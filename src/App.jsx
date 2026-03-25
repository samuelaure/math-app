import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Play from './pages/Play';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
