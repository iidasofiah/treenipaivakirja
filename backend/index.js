const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

let workouts = [
  {
    id: 1,
    exercise: 'Penkkipunnerrus',
    weight: 60,
    reps: 10,
    date: '2026-10-07',
    category: 'Rinta'
  },
  {
    id: 2,
    exercise: 'Kyykky',
    weight: 80,
    reps: 8,
    date: '2026-10-07',
    category: 'Jalat'
  }
]

app.get('/api/workouts', (request, response) => {
  response.json(workouts)
})

app.get('/api/workouts/:id', (request, response) => {
  const id = Number(request.params.id)

  const workout = workouts.find(
    workout => workout.id === id
  )

  if (workout) {
    response.json(workout)
  } else {
    response.status(404).end()
  }
})

app.post('/api/workouts', (request, response) => {
  const body = request.body

  if (
    !body.exercise ||
    body.weight === undefined ||
    body.reps === undefined ||
    !body.date ||
    !body.category
  ) {
    return response.status(400).json({
      error: 'Kaikki kentät ovat pakollisia'
    })
  }

  const workout = {
    id:
      workouts.length > 0
        ? Math.max(...workouts.map(workout => workout.id)) + 1
        : 1,

    exercise: body.exercise,
    weight: Number(body.weight),
    reps: Number(body.reps),
    date: body.date,
    category: body.category
  }

  workouts = workouts.concat(workout)

  response.status(201).json(workout)
})

app.delete('/api/workouts/:id', (request, response) => {
  const id = Number(request.params.id)

  workouts = workouts.filter(
    workout => workout.id !== id
  )

  response.status(204).end()
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})