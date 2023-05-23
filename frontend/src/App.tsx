import { useEffect, useState } from 'react'
import { NoteList } from './components/Notes'
import { Note } from './types'
import { getNotes } from './api'
import Header from './components/Header'
import { Route, useLocation, useRoute } from 'wouter'
import NoteDetails, { CreateNote } from './components/NoteDetails'
import Modal from './components/Modal'

function App () {
  const [notes, setNotes] = useState<Note[]>([])
  const [isArchievedPath] = useRoute('/archieved')
  const [isNotePath, params] = useRoute('/note/:id')
  const [, setLocation] = useLocation()

  const currentNote = isNotePath && notes.find(note => note.id === params?.id)

  const showArchieved = currentNote ? currentNote.archieved : isArchievedPath

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

  function handleNoteAddition (newNote: Note) {
    setNotes(prev => [...prev, newNote])
  }

  return (
    <section className='px-5'>
      <Header path={showArchieved ? 'archieved' : 'home'} />
      <NoteList
        notes={notes
          .filter(note => note.archieved === showArchieved)
          .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())}
        onNoteUpdate={handleNoteUpdate}
      />
      <Route path='/note/:id'>
        {() => {
          if (!currentNote) return null
          return (
            <Modal onClose={() => setLocation(showArchieved ? '/archieved' : '/')}>
              <NoteDetails data={currentNote} onUpdate={handleNoteUpdate} />
            </Modal>
          )
        }}
      </Route>
      <Route path='/new'>
        <Modal onClose={() => setLocation('/')}>
          <CreateNote onAddition={handleNoteAddition} />
        </Modal>
      </Route>
    </section>
  )
}

export default App
