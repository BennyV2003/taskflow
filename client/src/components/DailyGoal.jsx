import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

function DailyGoal({ tasks }) {
  const [goal, setGoal] = useState(() => {
    return parseInt(localStorage.getItem('dailyGoal')) || 0
  })
  const [inputGoal, setInputGoal] = useState('')
  const [celebrated, setCelebrated] = useState(false)

  const completedToday = tasks.filter(task => {
    const isCompleted = task.status === 'completed'
    const isToday = new Date(task.created_at).toDateString() === new Date().toDateString()
    return isCompleted && isToday
  }).length

  const percentage = goal > 0 ? Math.min((completedToday / goal) * 100, 100) : 0
  const isGoalMet = goal > 0 && completedToday >= goal

  //confetti
  useEffect(() => {
    if (isGoalMet && !celebrated) {
      setCelebrated(true)
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      })
    }

    // Reset celebration if goal is no longer met
    if (!isGoalMet) {
      setCelebrated(false)
    }
  }, [isGoalMet])

  const handleSetGoal = (e) => {
    e.preventDefault()
    const parsed = parseInt(inputGoal)
    if (!parsed || parsed < 1) return
    setGoal(parsed)
    localStorage.setItem('dailyGoal', parsed)
    setInputGoal('')
    setCelebrated(false)
  }

  return (
    <div style={styles.card}>

      {/* Header row */}
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Daily Goal</h2>
        {goal > 0 && (
          <span style={styles.counter}>
            {completedToday} / {goal} completed
          </span>
        )}
      </div>

      {/* Progress bar */}
      {goal > 0 && (
        <div style={styles.barTrack}>
          <div
            style={{
              ...styles.barFill,
              width: `${percentage}%`,
              background: isGoalMet ? '#22c55e' : '#4f46e5'
            }}
          />
        </div>
      )}

      {/* Goal met message */}
      {isGoalMet && (
        <p style={styles.successMsg}>
          🎉 Goal crushed! You completed all {goal} tasks today!
        </p>
      )}

      {/* Set goal form */}
      <form onSubmit={handleSetGoal} style={styles.form}>
        <input
          style={styles.input}
          type="number"
          min="1"
          placeholder={goal > 0 ? `Change goal (current: ${goal})` : 'Set a daily goal...'}
          value={inputGoal}
          onChange={(e) => setInputGoal(e.target.value)}
        />
        <button style={styles.button} type="submit">
          {goal > 0 ? 'Update' : 'Set Goal'}
        </button>
      </form>

    </div>
  )
}

const styles = {
  card: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  title: {
    fontSize: '1.1rem'
  },
  counter: {
    fontSize: '0.9rem',
    color: '#666'
  },
  barTrack: {
    width: '100%',
    height: '12px',
    background: '#f0f0f0',
    borderRadius: '999px',
    overflow: 'hidden',
    marginBottom: '0.75rem'
  },
  barFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 0.4s ease, background 0.4s ease'
  },
  successMsg: {
    color: '#22c55e',
    fontWeight: '600',
    marginBottom: '0.75rem'
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  input: {
    flex: 1,
    padding: '0.6rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem'
  },
  button: {
    padding: '0.6rem 1rem',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem'
  }
}

export default DailyGoal