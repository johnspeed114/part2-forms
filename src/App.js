import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(false)
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, []) //first useEffect paramater is the function, 2nd is the frequency of this function(like when and how many times to run)
  //--2nd method for this useEffect--
  // useEffect(()=> {
  //   const eventHandler = response => {
  //     console.log('promise fulfilled')
  //     setNotes(response.data)
  //   }
  //   const promise = axios.get('http://localhost:3001/notes')
  //   promise.then(eventHandler)
  // },[])

  console.log('render', notes.length, 'notes')


  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }//this clones the exact old note execept the important prop changed one
    //the var above is just a shallow copy, values in it will be the same as the old object

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        alert(`the note '${note.content}' was already deleted from server`)
      setNotes(notes.filter(n=> n.id!==id))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      // axios.post('http://localhost:3001/notes', noteObject).then((response) => {
      //   setNotes(notes.concat(response.data))
      //   setNewNote('')   [IMPORTANT!!!] we are using service note module to control the backend comms for convinience
    })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
  const notesToShow = showAll ?
    notes
    : notes.filter(note => note.important)
  return (
    <div>
      <h1>Notes</h1>

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show{showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote}
          onChange={handleNoteChange} />
        <button type='submit'>save</button>
      </form>

    </div>
  )
}

export default App
