import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import DailyGoal from '../components/DailyGoal'


function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  // This is where we fetch the user's tasks from the backend
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await API.get('/api/tasks')
      setTasks(res.data)
    } catch (err) {
      setError('Failed to load tasks')
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/api/tasks', { title, description })
      // Add the new task to the top of the list without refetching
      setTasks([res.data, ...tasks])
      setTitle('')
      setDescription('')
    } catch (err) {
      setError('Failed to create task')
    }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/tasks/${id}`)
      // Remove the deleted task from state
      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await API.put(`/api/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: newStatus
      })
      setTasks(tasks.map(t => t.id === task.id ? res.data : t))
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const handleLogout = () => {
    // Clear everything from localStorage and send user back to login
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={styles.container}>


      <div style={styles.header}>
        <h1 style={styles.logo}>TaskFlow</h1>
        <div style={styles.headerRight}>
          <span>Hey, {user?.username}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.main}>

        {error && <p style={styles.error}>{error}</p>}

        <DailyGoal tasks={tasks} />
        
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>New Task</h2>
          <form onSubmit={handleCreateTask}>
            <input
              style={styles.input}
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              style={styles.textarea}
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <button style={styles.button} type="submit">
              Add Task
            </button>
          </form>
        </div>

      
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Your Tasks</h2>
          {tasks.length === 0 ? (
            <p style={{ color: '#666' }}>No tasks yet. Add one above!</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} style={styles.taskItem}>
                <div style={styles.taskInfo}>
                  <p style={styles.taskTitle}>{task.title}</p>
                  {task.description && (
                    <p style={styles.taskDesc}>{task.description}</p>
                  )}
                </div>
                <div style={styles.taskActions}>
                  {/* Status dropdown */}
                  <select
                    style={styles.select}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f0f2f5'
  },
  header: {
    background: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
  },
  logo: {
    fontSize: '1.5rem',
    color: '#4f46e5'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  logoutBtn: {
    padding: '0.4rem 1rem',
    background: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  main: {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '0 1rem'
  },
  card: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem'
  },
  cardTitle: {
    marginBottom: '1rem',
    fontSize: '1.1rem'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    marginBottom: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    marginBottom: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical'
  },
  button: {
    padding: '0.75rem 1.5rem',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid #f0f0f0'
  },
  taskInfo: {
    flex: 1
  },
  taskTitle: {
    fontWeight: '600',
    marginBottom: '0.25rem'
  },
  taskDesc: {
    color: '#666',
    fontSize: '0.9rem'
  },
  taskActions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  select: {
    padding: '0.4rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem'
  },
  deleteBtn: {
    padding: '0.4rem 0.75rem',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  error: {
    color: 'red',
    marginBottom: '1rem'
  }
}

export default Dashboard