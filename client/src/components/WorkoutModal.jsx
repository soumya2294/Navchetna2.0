import { useState } from 'react';
import { WORKOUT_CATALOG } from './workoutCatalog';

export default function WorkoutModal({ isOpen, onClose, onLaunch }) {
  const [step, setStep] = useState('MUSCLES');
  const [category, setCategory] = useState(null);
  const [workout, setWorkout] = useState(null);

  if (!isOpen) return null;

  const pickCategory = (cat) => {
    setCategory(cat);
    if (cat.exercises.length === 1) {
      setWorkout(cat.exercises[0]);
      setStep('DETAILS');
    } else {
      setStep('EXERCISES');
    }
  };

  const pickWorkout = (ex) => {
    setWorkout(ex);
    setStep('DETAILS');
  };

  const handleStart = () => {
    onLaunch(workout);
    onClose();
    setStep('MUSCLES');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header-banner">
          {step !== 'MUSCLES' ? (
            <button className="nav-btn" onClick={() => setStep('MUSCLES')}>← Back</button>
          ) : <span />}
          <h3>{step === 'DETAILS' ? workout.name : 'Exercises'}</h3>
          <button className="nav-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {step === 'MUSCLES' && WORKOUT_CATALOG.map((cat) => (
            <div key={cat.id} className="muscle-card" onClick={() => pickCategory(cat)}>
              <div className="muscle-avatar">{cat.icon}</div>
              <div className="muscle-info">
                <h4>{cat.muscleGroup}</h4>
                <span className="exercise-count-badge">
                  {cat.exercises.length} {cat.exercises.length === 1 ? 'exercise' : 'exercises'}
                </span>
              </div>
              <span className="card-chevron">›</span>
            </div>
          ))}

          {step === 'EXERCISES' && category.exercises.map((ex) => (
            <div key={ex.id} className="muscle-card" onClick={() => pickWorkout(ex)}>
              <div className="muscle-avatar">🎯</div>
              <div className="muscle-info">
                <h4>{ex.name}</h4>
                <span style={{ fontSize: '12px', color: '#666' }}>Target: {ex.primaryTarget}</span>
              </div>
              <span className="card-chevron">›</span>
            </div>
          ))}

          {step === 'DETAILS' && (
            <div className="exercise-detail-card">
              <div className="target-pill-group">
                <span className="primary-pill">🎯 {workout.primaryTarget}</span>
                <span className="secondary-pill">⚡ {workout.secondaryTarget}</span>
              </div>
              <ul className="rules-list">
                {workout.rules.map((rule, idx) => (
                  <li key={idx}><span>✓</span> <span>{rule}</span></li>
                ))}
              </ul>
              <button className="btn-start-camera" onClick={handleStart}>
                OK, Start Camera
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}