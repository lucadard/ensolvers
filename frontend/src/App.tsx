import { useEffect, useState } from 'react'
import { NoteList } from './components/Notes'
import { Note } from './types'
import { getNotes } from './api'

function App () {
  const [showArchieved, setShowArchieved] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    getNotes().then(setNotes).catch(console.error)
  }, [])

  function handleNoteUpdate (id: string, data: Partial<Note>, opt?: { delete: boolean }) {
    setNotes(prev => {
      const noteIndex = prev.findIndex(note => note.id === id)
      const notesCopy = [...prev]
      opt?.delete
        ? notesCopy.splice(noteIndex, 1)
        : notesCopy.splice(noteIndex, 1, { ...prev[noteIndex], ...data })
      return notesCopy
    })
  }

  return (
    <>
      <NoteList
        notes={notes.filter(note => note.archieved === showArchieved)}
        onNoteUpdate={handleNoteUpdate}
      />
    </>
  )
}

export default App
