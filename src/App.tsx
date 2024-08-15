import React, { useState, useEffect } from 'react'
import dartBoard from './assets/Dartboard.jpg'

import './App.css';

function Dartboard() {
  return (
    <div>
      <img 
        src={dartBoard} 
        style={{ width: '300px', height: '300px', borderRadius: '200px' }} 
        alt="Dartboard" 
      />
    </div>
  );
}

function useScopeDrift(initialPosition: { x: number, y: number }) {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prevPosition => ({
        x: Math.max(0, Math.min(290, prevPosition.x + (Math.random() * 2 - 1) * 5)), // Keep within bounds
        y: Math.max(0, Math.min(290, prevPosition.y + (Math.random() * 2 - 1) * 5)), // Keep within bounds
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return position;
}

function Scope({ position }: { position: { x: number, y: number } }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: '10px',
        height: '10px',
        backgroundColor: 'red',
        borderRadius: '50%',
        pointerEvents: 'none',
      }}
    />
  );
}

function calculateScore(x: number, y: number): number {
  const centerX = 145; // Center of the dartboard (width / 2)
  const centerY = 145; // Center of the dartboard (height / 2)
  const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI); // Calculate angle in degrees

  // Normalize angle to [0, 360)
  const normalizedAngle = (angle + 360-90) % 360 

  // Determine the score based on the angle
  if (normalizedAngle >= 351 || normalizedAngle < 9) return 6;
  if (normalizedAngle >= 9 && normalizedAngle < 27) return 13;
  if (normalizedAngle >= 27 && normalizedAngle < 45) return 4;
  if (normalizedAngle >= 45 && normalizedAngle < 63) return 18;
  if (normalizedAngle >= 63 && normalizedAngle < 81) return 1;
  if (normalizedAngle >= 81 && normalizedAngle < 99) return 20;
  if (normalizedAngle >= 99 && normalizedAngle < 117) return 5;
  if (normalizedAngle >= 117 && normalizedAngle < 135) return 12;
  if (normalizedAngle >= 135 && normalizedAngle < 153) return 9;
  if (normalizedAngle >= 153 && normalizedAngle < 171) return 14;
  if (normalizedAngle >= 171 && normalizedAngle < 189) return 11;
  if (normalizedAngle >= 189 && normalizedAngle < 207) return 8;
  if (normalizedAngle >= 207 && normalizedAngle < 225) return 16;
  if (normalizedAngle >= 225 && normalizedAngle < 243) return 7;
  if (normalizedAngle >= 243 && normalizedAngle < 261) return 19;
  if (normalizedAngle >= 261 && normalizedAngle < 279) return 3;
  if (normalizedAngle >= 279 && normalizedAngle < 297) return 17;
  if (normalizedAngle >= 297 && normalizedAngle < 315) return 2;
  if (normalizedAngle >= 315 && normalizedAngle < 333) return 15;
  if (normalizedAngle >= 333 && normalizedAngle < 351) return 10;

  return 0; // Default case
}

function DartboardGame() {
  const [projectilePosition, setProjectilePosition] = useState<{ x: number, y: number } | null>(null);
  const [scopePosition, setScopePosition] = useState({ x: 145, y: 145 });
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setScopePosition(prevPosition => ({
        x: Math.max(0, Math.min(290, prevPosition.x + (Math.random() * 2 - 1) * 5)), // Keep within bounds
        y: Math.max(0, Math.min(290, prevPosition.y + (Math.random() * 2 - 1) * 5)), // Keep within bounds
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleFire = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      setProjectilePosition(scopePosition); // Set the projectile position to the current scope position
      setScore(calculateScore(scopePosition.x, scopePosition.y)); // Calculate and set the score
    }
    if (event.code === 'ControlLeft') {
      setScopePosition({ x: 145, y: 145 }); // Reset scope position to center
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleFire);
    return () => {
      window.removeEventListener('keydown', handleFire);
    };
  }, [scopePosition]);

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
      <Dartboard />
      <Scope position={scopePosition} />
      {projectilePosition && (
        <div
          style={{
            position: 'absolute',
            top: projectilePosition.y,
            left: projectilePosition.x,
            width: '10px',
            height: '10px',
            backgroundColor: 'blue',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}
      {score !== null && (
        <div style={{ position: 'absolute', top: '320px', left: '50%', transform: 'translateX(-50%)' }}>
          <h2>Score(ish): {score}</h2>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1 style={{marginLeft: '-40px'}}>Dartboard Game</h1>
      <DartboardGame />
    </div>
  );
}

export default App;
