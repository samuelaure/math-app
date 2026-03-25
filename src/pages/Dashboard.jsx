import { Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import '../styles/theme.css';

export default function Dashboard() {
  const { progress, setManualOverride } = useProgress();

  const total = progress.stats?.total || 0;
  const correct = progress.stats?.correct || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  let masteryMessage = "Aún no hay suficientes datos para evaluar.";
  if (total > 5) {
    if (accuracy >= 80) masteryMessage = "¡Flujo excelente! Está dominando los conceptos actuales.";
    else if (accuracy >= 60) masteryMessage = "Buen progreso. Algunas dudas ocasionales, totalmente normal.";
    else masteryMessage = "Necesita un poco más de refuerzo en estos números. Considera bajar el nivel.";
  }

  return (
    <div className="dashboard-container">
      <div className="top-bar">
        <Link to="/" className="btn secondary small">← Inicio</Link>
      </div>
      
      <main className="dashboard-main">
        <h1>Panel de Padres</h1>
        
        <section className="dashboard-card">
          <h2>Métricas de Aprendizaje</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-value">{total}</span>
              <span className="stat-label">Ejercicios Realizados</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{accuracy}%</span>
              <span className="stat-label">Precisión</span>
            </div>
          </div>
          <p className="mastery-msg">💡 {masteryMessage}</p>
        </section>

        <section className="dashboard-card">
          <h2>Control de Dificultad</h2>
          <p>Nivel Actual del Motor: <strong>{progress.level}</strong></p>
          
          <div className="override-controls">
            <label style={{display: 'block', marginBottom: '0.5rem'}}>Forzar Nivel Manualmente:</label>
            <div className="level-buttons">
              {[null, 1, 2, 3, 4, 5].map(lvl => (
                <button 
                  key={lvl || 'auto'}
                  className={`btn small ${progress.manualOverride === lvl ? '' : 'secondary'}`}
                  onClick={() => setManualOverride(lvl)}
                >
                  {lvl === null ? 'Automático' : `Nivel ${lvl}`}
                </button>
              ))}
            </div>
            <p className="hint">"Automático" permite que la app suba/baje según los aciertos seguidos.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
