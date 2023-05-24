import { useEffect, useState } from 'react'
import { NoteList } from './components/Notes'
import { Category, Note } from './types'
import { getCategories, getNotes } from './api'
import Header from './components/Header'
import { Route, useLocation, useRoute } from 'wouter'
import { CreateNote, EditNote } from './components/NoteActions'
import Modal from './components/Modal'

function App () {
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [isArchievedPath] = useRoute('/archieved')
  const [isNotePath, params] = useRoute('/note/:id')
  const [, setLocation] = useLocation()

  const currentNote = isNotePath && notes.find(note => note.id === params?.id)
  // If a note is being edited, I want to keep showing the same notes in NoteList
  const showArchieved = currentNote ? currentNote.archieved : isArchievedPath

  useEffect(() => {
    getNotes().then(setNotes).catch(console.error)
    getCategories().then(setCategories).catch(console.error)
  }, [])

  // Handle notes on-memory when db is updated
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
    <section className='px-5 pb-10'>
      <Header path={showArchieved ? 'archieved' : 'home'} />
      <NoteList
        notes={notes
          .filter(note => note.archieved === showArchieved)
          .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())}
        categories={categories}
        onNoteUpdate={handleNoteUpdate}
      />
      <Route path='/note/:id'>
        {() => {
          if (!currentNote) return null
          return (
            <Modal onClose={() => setLocation(showArchieved ? '/archieved' : '/')}>
              <EditNote data={currentNote} onUpdate={handleNoteUpdate} />
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
