import { Link } from 'react-router-dom';
import '../styles/theme.css';

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to MathGarden</h1>
      <div className="nav-links">
        <Link to="/play" className="btn">Jugar</Link>
        <Link to="/garden" className="btn secondary">Mi Jardín</Link>
        <Link to="/dashboard" className="btn secondary">Panel Parental</Link>
      </div>
    </div>
  );
}
