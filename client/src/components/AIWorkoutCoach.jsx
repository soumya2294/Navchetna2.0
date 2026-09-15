import React, { useState, useEffect, useRef, useCallback } from 'react';

function calculateAngle(pA, pB, pC) {
  if (!pA || !pB || !pC) return 180;
  const radians =
    Math.atan2(pC.y - pB.y, pC.x - pB.x) -
    Math.atan2(pA.y - pB.y, pA.x - pB.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360.0 - angle;
  return Math.round(angle);
}

function speakPrompt(text, isMuted) {
  if (isMuted || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.15;
  window.speechSynthesis.speak(utterance);
}

export default function AIWorkoutCoach({ exerciseData, onExit }) {
  const [exercise, setExercise] = useState(
    exerciseData?.id === 'push-ups' ? 'pushups' : (exerciseData?.id || 'squats')
  );
  const [targetReps, setTargetReps] = useState(10);
  const [reps, setReps] = useState(0);
  const [stage, setStage] = useState('UP');
  const [feedback, setFeedback] = useState('Position your camera upright 5-6 ft away');
  const [feedbackType, setFeedbackType] = useState('info');
  const [liveAngle, setLiveAngle] = useState(180);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInstance = useRef(null);
  const poseInstance = useRef(null);
 const repTracker = useRef({ 
    stage: 'AT_TOP', 
    reps: 0, 
    lastSpoken: 0,
    smoothedAngle: 180,
    bottomReached: false,
    repStartTime: Date.now()
  });
const syncXPToLeaderboard = (earnedXP) => {
    const existingXP = parseInt(localStorage.getItem('userXP') || '450', 10);
    const updatedXP = existingXP + earnedXP;
    localStorage.setItem('userXP', updatedXP.toString());
  };
  const resetSession = () => {
    setReps(0);
    setStage('UP');
   repTracker.current = {
      stage: 'AT_TOP',
      reps: 0,
      lastSpoken: 0,
      smoothedAngle: 180,
      bottomReached: false,
      repStartTime: Date.now()
    };
    setFeedback('Step back into the frame');
    setFeedbackType('info');
    setWorkoutComplete(false);
  };

  const notifyCoach = useCallback((msg, speech) => {
    const now = Date.now();
    if (now - repTracker.current.lastSpoken > 1400) {
      speakPrompt(speech || msg, isMuted);
      repTracker.current.lastSpoken = now;
    }
  }, [isMuted]);

  useEffect(() => {
    if (!window.Pose || !window.Camera) {
      setCameraError('MediaPipe scripts loading. Check your internet connection.');
      return;
    }

    const pose = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.55,
      minTrackingConfidence: 0.55
    });

    pose.onResults(onPoseResults);
    poseInstance.current = pose;

    return () => {
      if (cameraInstance.current) cameraInstance.current.stop();
      pose.close();
    };
  }, [exercise, targetReps, isMuted]);

  const onPoseResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    if (!results.poseLandmarks) return;

    const lm = results.poseLandmarks;

    const connections = [
      [11, 12], [11, 13], [13, 15],
      [12, 14], [14, 16],
      [11, 23], [12, 24], [23, 24],
      [23, 25], [25, 27],
      [24, 26], [26, 28]
    ];

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2563EB';
    connections.forEach(([i, j]) => {
      const p1 = lm[i];
      const p2 = lm[j];
      if (p1 && p2 && p1.visibility > 0.5 && p2.visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
        ctx.stroke();
      }
    });

    lm.forEach((pt, idx) => {
      if (pt.visibility > 0.5) {
        ctx.beginPath();
        ctx.arc(pt.x * w, pt.y * h, 5, 0, 2 * Math.PI);
        ctx.fillStyle = idx >= 23 ? '#10B981' : '#EA580C';
        ctx.fill();
      }
    });

    if (exercise === 'squats') {
      const isLeft = (lm[23].visibility + lm[25].visibility) > (lm[24].visibility + lm[26].visibility);
      const hip = isLeft ? lm[23] : lm[24];
      const knee = isLeft ? lm[25] : lm[26];
      const ankle = isLeft ? lm[27] : lm[28];
      const shoulder = isLeft ? lm[11] : lm[12];

      if (hip && knee && ankle && hip.visibility > 0.5 && knee.visibility > 0.5) {
       // 1. EMA Smoothing (eliminates landmark jitter)
      const rawKneeAngle = calculateAngle(hip, knee, ankle);
      repTracker.current.smoothedAngle = 0.3 * rawKneeAngle + 0.7 * (repTracker.current.smoothedAngle || rawKneeAngle);
      const kneeAngle = Math.round(repTracker.current.smoothedAngle);

      const backAngle = calculateAngle(shoulder, hip, knee);
      setLiveAngle(kneeAngle);

      const now = Date.now();
      const tracker = repTracker.current;

      // 2. 4-Stage State Machine
      if (tracker.stage === 'AT_TOP') {
        if (kneeAngle < 135) {
          tracker.stage = 'DESCENDING';
          tracker.bottomReached = false;
          tracker.repStartTime = now;
          setStage('DESCENDING');
        }
      } else if (tracker.stage === 'DESCENDING') {
        if (kneeAngle <= 90) {
          tracker.stage = 'AT_BOTTOM';
          tracker.bottomReached = true; // Earns depth ticket
          setStage('DOWN');
          if (backAngle < 135) {
            setFeedback('⚠️ Keep your back straight!');
            setFeedbackType('warning');
            notifyCoach('Keep your back straight');
          } else {
            setFeedback('Perfect depth! Drive up!');
            setFeedbackType('success');
          }
        } else if (kneeAngle > 160) {
          tracker.stage = 'AT_TOP';
          setStage('UP');
        }
      } else if (tracker.stage === 'AT_BOTTOM') {
        if (kneeAngle > 115) {
          tracker.stage = 'ASCENDING';
          setStage('ASCENDING');
        }
      } else if (tracker.stage === 'ASCENDING') {
        if (kneeAngle >= 160) {
          const duration = now - tracker.repStartTime;

          // 3. Depth check + 900ms speed threshold
          if (tracker.bottomReached && duration >= 900) {
            tracker.reps += 1;
            const count = tracker.reps;
            setStage('UP');
            setReps(count);
            setFeedback(`Rep ${count} counted!`);
            setFeedbackType('success');
            notifyCoach(String(count));

            if (count >= targetReps) {
              setWorkoutComplete(true);
              notifyCoach('Challenge complete!');
              syncXPToLeaderboard(count * 5);
            }
          } else {
            setFeedback('Rep too fast or incomplete');
            setFeedbackType('warning');
          }

          tracker.stage = 'AT_TOP';
          tracker.bottomReached = false;
        }
      }
    }
  }

    if (exercise === 'pushups') {
      const isLeft = (lm[11].visibility + lm[13].visibility) > (lm[12].visibility + lm[14].visibility);
      const shoulder = isLeft ? lm[11] : lm[12];
      const elbow = isLeft ? lm[13] : lm[14];
      const wrist = isLeft ? lm[15] : lm[16];
      const hip = isLeft ? lm[23] : lm[24];
      const ankle = isLeft ? lm[27] : lm[28];

      if (shoulder && elbow && wrist && hip && ankle && shoulder.visibility > 0.5) {
        // 1. EMA Smoothing (removes jitter)
      const rawElbowAngle = calculateAngle(shoulder, elbow, wrist);
      repTracker.current.smoothedAngle = 0.3 * rawElbowAngle + 0.7 * (repTracker.current.smoothedAngle || rawElbowAngle);
      const elbowAngle = Math.round(repTracker.current.smoothedAngle);

      const plankAngle = calculateAngle(shoulder, hip, ankle);
      setLiveAngle(elbowAngle);

      const isPlankValid = plankAngle >= 150 && plankAngle <= 210;

      const now = Date.now();
      const tracker = repTracker.current;

      // 2. 4-Stage State Machine
      if (tracker.stage === 'AT_TOP') {
        if (elbowAngle < 135) {
          tracker.stage = 'DESCENDING';
          tracker.bottomReached = false;
          tracker.repStartTime = now;
          setStage('DESCENDING');
        }
      } else if (tracker.stage === 'DESCENDING') {
        if (elbowAngle <= 90) {
          tracker.stage = 'AT_BOTTOM';
          tracker.bottomReached = true; // Depth ticket earned
          setStage('DOWN');
          if (!isPlankValid) {
            setFeedback('⚠️ Keep core straight!');
            setFeedbackType('warning');
            notifyCoach('Engage your core');
          } else {
            setFeedback('Chest low! Explode up!');
            setFeedbackType('success');
          }
        } else if (elbowAngle > 160) {
          tracker.stage = 'AT_TOP';
          setStage('UP');
        }
      } else if (tracker.stage === 'AT_BOTTOM') {
        if (elbowAngle > 115) {
          tracker.stage = 'ASCENDING';
          setStage('ASCENDING');
        }
      } else if (tracker.stage === 'ASCENDING') {
        if (elbowAngle >= 160) {
          const duration = now - tracker.repStartTime;

          // 3. Depth check + 900ms speed threshold
          if (tracker.bottomReached && duration >= 900) {
            tracker.reps += 1;
            const count = tracker.reps;
            setStage('UP');
            setReps(count);
            setFeedback(`Rep ${count} counted!`);
            setFeedbackType('success');
            notifyCoach(String(count));

            if (count >= targetReps) {
              setWorkoutComplete(true);
              notifyCoach('Workout complete!');
              syncXPToLeaderboard(count * 5);
            }
          } else {
            setFeedback('Rep too fast or incomplete');
            setFeedbackType('warning');
          }

          tracker.stage = 'AT_TOP';
          tracker.bottomReached = false;
        }
      }
      }
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    if (!videoRef.current || !poseInstance.current) return;

    try {
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && poseInstance.current) {
            await poseInstance.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });
      await camera.start();
      cameraInstance.current = camera;
      setCameraActive(true);
      resetSession();
      speakPrompt("Camera active. Step into view.", isMuted);
    } catch (err) {
      setCameraError("Camera access denied. Please click 'Allow' in your Chrome address bar permissions.");
    }
  };

  const stopCamera = () => {
    if (cameraInstance.current) {
      cameraInstance.current.stop();
      cameraInstance.current = null;
    }
    setCameraActive(false);
  };

  return (
    <div style={{ backgroundColor: '#F4EFEA', minHeight: '100vh', padding: '24px 16px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Top Action Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid #E5DFD5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>AI Workout Coach</h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>Real-time pose estimation and repetition tracker</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: isMuted ? '1px solid #FECACA' : '1px solid #E5DFD5',
                backgroundColor: isMuted ? '#FEF2F2' : '#F4EFEA',
                color: isMuted ? '#DC2626' : '#475569',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {isMuted ? '🔇 Muted' : '🔊 Voice ON'}
            </button>

            {!cameraActive ? (
              <button
                onClick={startCamera}
                style={{
                  backgroundColor: '#EA580C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Stop Camera
              </button>
            )}

            {onExit && (
              <button
                onClick={onExit}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E5DFD5',
                  backgroundColor: '#FFFFFF',
                  color: '#64748B',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
            )}
          </div>
        </div>

        {cameraError && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '13px'
          }}>
            {cameraError}
          </div>
        )}

        {/* Configuration Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E5DFD5' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Exercise</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={cameraActive}
                onClick={() => { setExercise('squats'); resetSession(); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  backgroundColor: exercise === 'squats' ? '#EA580C' : '#F4EFEA',
                  color: exercise === 'squats' ? '#FFFFFF' : '#475569'
                }}
              >
                Squats
              </button>
              <button
                disabled={cameraActive}
                onClick={() => { setExercise('pushups'); resetSession(); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  backgroundColor: exercise === 'pushups' ? '#EA580C' : '#F4EFEA',
                  color: exercise === 'pushups' ? '#FFFFFF' : '#475569'
                }}
              >
                Push-ups
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E5DFD5' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Target Reps</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                disabled={cameraActive}
                value={targetReps}
                onChange={(e) => { setTargetReps(Number(e.target.value)); resetSession(); }}
                style={{ width: '100%', accentColor: '#EA580C' }}
              />
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#EA580C' }}>{targetReps}</span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid #E5DFD5',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>STAGE</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: stage === 'DOWN' ? '#10B981' : '#EA580C' }}>{stage}</span>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: '#E5DFD5' }} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>ANGLE</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>{liveAngle}°</span>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: '#E5DFD5' }} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>POINTS</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#10B981' }}>+{reps * 5} XP</span>
            </div>
          </div>
        </div>

        {/* Viewport + Feedback Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Video Container */}
          <div style={{
            backgroundColor: '#0F172A',
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '380px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', position: 'absolute', inset: 0 }}
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}
            />

            {!cameraActive && (
              <div style={{ zIndex: 20, textAlign: 'center', padding: '24px', color: '#FFFFFF' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 6px' }}>Ready to Workout?</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 16px', maxWidth: '280px' }}>
                  Stand 5-6 feet away so your full body is framed inside the camera.
                </p>
                <button
                  onClick={startCamera}
                  style={{
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Enable Camera
                </button>
              </div>
            )}

            {cameraActive && (
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                zIndex: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '12px 20px',
                borderRadius: '14px',
                border: '1px solid #E5DFD5',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>REPS</span>
                <span style={{ fontSize: '36px', fontWeight: '900', color: '#EA580C', lineHeight: 1 }}>{reps}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', marginTop: '2px' }}>/ {targetReps}</span>
              </div>
            )}
          </div>

          {/* Guidance Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              backgroundColor: feedbackType === 'warning' ? '#FEF2F2' : feedbackType === 'success' ? '#ECFDF5' : '#FFFFFF',
              border: feedbackType === 'warning' ? '1px solid #FECACA' : feedbackType === 'success' ? '1px solid #A7F3D0' : '1px solid #E5DFD5',
              padding: '16px',
              borderRadius: '16px'
            }}>
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Live Feedback</span>
              <p style={{
                fontSize: '13px',
                fontWeight: '700',
                margin: 0,
                color: feedbackType === 'warning' ? '#991B1B' : feedbackType === 'success' ? '#065F46' : '#1E293B'
              }}>
                {feedback}
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E5DFD5', flex: 1 }}>
              <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', margin: '0 0 10px' }}>Form Rules</h4>
              <ul style={{ fontSize: '12px', color: '#475569', lineHeight: '1.8', margin: 0, paddingLeft: '18px' }}>
                <li>Drop until knee or elbow bends below 90°.</li>
                <li>Keep your core engaged throughout.</li>
                <li>Lock out fully to register every rep.</li>
              </ul>
            </div>

            <button
              onClick={resetSession}
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5DFD5',
                borderRadius: '12px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Reset Counter
            </button>
          </div>
        </div>

        {/* Workout Complete Modal */}
        {workoutComplete && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
            }}>
              <div style={{ fontSize: '38px', marginBottom: '8px' }}>🏆</div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px', color: '#0F172A' }}>Goal Reached!</h3>
              <p style={{ fontSize: '13px', color: '#10B981', fontWeight: '700', margin: '0 0 16px' }}>
                +{reps * 5} XP added to your Leaderboard score!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => window.location.href = '/leaderboard'}
                  style={{
                    width: '100%',
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  View Leaderboard 🏅
                </button>

                <button
                  onClick={() => { setWorkoutComplete(false); resetSession(); }}
                  style={{
                    width: '100%',
                    backgroundColor: '#F4EFEA',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    fontWeight: '600',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Workout Again
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}