import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<div>Play View Placeholder</div>} />
        <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
