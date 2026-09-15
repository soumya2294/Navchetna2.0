export const WORKOUT_CATALOG = [
  {
    id: 'chest',
    muscleGroup: 'Chest & Arms',
    icon: '🏋️‍♂️',
    exercises: [
      {
        id: 'push-ups',
        name: 'Push-ups',
        primaryTarget: 'Chest (Pectorals)',
        secondaryTarget: 'Triceps & Shoulders',
        rules: [
          'Drop until elbows bend below 90°',
          'Keep core engaged and body straight',
          'Lock out fully at the top'
        ]
      }
    ]
  },
  {
    id: 'legs',
    muscleGroup: 'Legs & Glutes',
    icon: '🦵',
    exercises: [
      {
        id: 'squats',
        name: 'Bodyweight Squats',
        primaryTarget: 'Quadriceps & Glutes',
        secondaryTarget: 'Hamstrings & Calves',
        rules: [
          'Drop until thighs are parallel to floor',
          'Keep chest upright and heels flat',
          'Stand up to full lockout'
        ]
      },
      {
        id: 'lunges',
        name: 'Forward Lunges',
        primaryTarget: 'Quadriceps & Glutes',
        secondaryTarget: 'Core Balance & Hamstrings',
        rules: [
          'Step forward into a 90° knee bend',
          'Keep torso upright throughout',
          'Drive through front heel to return'
        ]
      }
    ]
  },
  {
    id: 'core',
    muscleGroup: 'Abs & Core',
    icon: '⚡',
    exercises: [
      {
        id: 'plank',
        name: 'High Plank',
        primaryTarget: 'Rectus Abdominis (Abs)',
        secondaryTarget: 'Shoulders & Lower Back',
        rules: [
          'Hold straight-arm push-up position',
          'Maintain a straight line from neck to heels',
          'Do not let hips sag or pike'
        ]
      }
    ]
  }
];