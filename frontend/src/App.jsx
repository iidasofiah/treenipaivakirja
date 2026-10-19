import { useEffect, useState } from 'react'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/workouts'

const Workout = ({ workout, deleteWorkout }) => {
  return (
    <li>
      <strong>{workout.exercise}</strong>
      {' — '}
      {workout.weight} kg
      {' × '}
      {workout.reps} toistoa
      <br />
      {workout.category}
      {' | '}
      {workout.date}
      <br />
      <button onClick={() => deleteWorkout(workout.id)}>
        Poista
      </button>
    </li>
  )
}

const WorkoutList = ({ workouts, deleteWorkout }) => {
  return (
    <ul>
      {workouts.map(workout => (
        <Workout
          key={workout.id}
          workout={workout}
          deleteWorkout={deleteWorkout}
        />
      ))}
    </ul>
  )
}

const WorkoutForm = ({
  addWorkout,
  exercise,
  setExercise,
  weight,
  setWeight,
  reps,
  setReps,
  date,
  setDate,
  category,
  setCategory
}) => {
  return (
    <form onSubmit={addWorkout}>
      <div>
        Liike:
        <input
          value={exercise}
          onChange={event => setExercise(event.target.value)}
        />
      </div>

      <div>
        Paino (kg):
        <input
          type="number"
          min="0"
          value={weight}
          onChange={event => setWeight(event.target.value)}
        />
      </div>

      <div>
        Toistot:
        <input
          type="number"
          min="1"
          value={reps}
          onChange={event => setReps(event.target.value)}
        />
      </div>

      <div>
        Päivämäärä:
        <input
          type="date"
          value={date}
          onChange={event => setDate(event.target.value)}
        />
      </div>

      <div>
        Kategoria:
        <input
          value={category}
          placeholder="esim. Rinta, Selkä, Jalat"
          onChange={event => setCategory(event.target.value)}
        />
      </div>

      <button type="submit">
        Lisää treeni
      </button>
    </form>
  )
}

const App = () => {
  const [workouts, setWorkouts] = useState([])

  const [exercise, setExercise] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')

  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  const showMessage = text => {
    setMessage(text)

    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setWorkouts(response.data)
      })
      .catch(error => {
        console.error('Treenien hakeminen epäonnistui:', error)
        showMessage('Treenien hakeminen epäonnistui!')
      })
  }, [])

  const addWorkout = event => {
    event.preventDefault()

    if (
      exercise === '' ||
      weight === '' ||
      reps === '' ||
      date === '' ||
      category === ''
    ) {
      showMessage('Täytä kaikki kentät!')
      return
    }

    const workoutObject = {
      exercise: exercise,
      weight: Number(weight),
      reps: Number(reps),
      date: date,
      category: category
    }

    axios
      .post(baseUrl, workoutObject)
      .then(response => {
        const returnedWorkout = response.data

        setWorkouts(previousWorkouts =>
          previousWorkouts.concat(returnedWorkout)
        )

        showMessage('Treeni lisättiin onnistuneesti!')

        setExercise('')
        setWeight('')
        setReps('')
        setDate('')
        setCategory('')
      })
      .catch(error => {
        console.error('Treenin lisääminen epäonnistui:', error)

        if (error.response?.data?.error) {
          showMessage(error.response.data.error)
        } else {
          showMessage('Treenin lisääminen epäonnistui!')
        }
      })
  }

  const deleteWorkout = id => {
    const confirmDelete = window.confirm(
      'Haluatko varmasti poistaa tämän treenin?'
    )

    if (!confirmDelete) {
      return
    }

    axios
      .delete(`${baseUrl}/${id}`)
      .then(() => {
        setWorkouts(previousWorkouts =>
          previousWorkouts.filter(workout => workout.id !== id)
        )

        showMessage('Treeni poistettiin!')
      })
      .catch(error => {
        console.error('Treenin poistaminen epäonnistui:', error)
        showMessage('Treenin poistaminen epäonnistui!')
      })
  }

  const workoutsToShow = workouts.filter(workout =>
    workout.category
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  return (
    <div>
      <h1>🏋️ Treenipäiväkirja</h1>

      {message && (
        <div className="notification">
          {message}
        </div>
      )}

      <h2>Hae treenejä</h2>

      <div>
        Kategoria:
        <input
          value={filter}
          placeholder="esim. Jalat"
          onChange={event => setFilter(event.target.value)}
        />
      </div>

      <h2>Treenit</h2>

      <WorkoutList
        workouts={workoutsToShow}
        deleteWorkout={deleteWorkout}
      />

      <h2>Lisää uusi treeni</h2>

      <WorkoutForm
        addWorkout={addWorkout}
        exercise={exercise}
        setExercise={setExercise}
        weight={weight}
        setWeight={setWeight}
        reps={reps}
        setReps={setReps}
        date={date}
        setDate={setDate}
        category={category}
        setCategory={setCategory}
      />
    </div>
  )
}

export default App