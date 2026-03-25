import { Link } from 'react-router-dom';
import '../styles/theme.css';

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to MathGarden</h1>
      <div className="nav-links">
        <Link to="/play" className="btn">Play</Link>
        <Link to="/dashboard" className="btn secondary">Parent Dashboard</Link>
      </div>
    </div>
  );
}
