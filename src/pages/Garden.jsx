import { Link } from 'react-router-dom';
import GardenView from '../components/garden/GardenView';
import { useProgress } from '../hooks/useProgress';
import '../styles/theme.css';

export default function Garden() {
  const { progress } = useProgress();

  return (
    <div className="garden-container">
      <div className="top-bar">
        <Link to="/" className="btn secondary small">← Inicio</Link>
        <Link to="/play" className="btn small">Jugar</Link>
      </div>
      <main className="garden-main">
        <h1>Tu Jardín Digital</h1>
        <p className="subtitle">Has coleccionado {progress.seeds} semillas en total.</p>
        <GardenView seeds={progress.seeds} />
      </main>
    </div>
  );
}
