import { Route, useLocation, useRoute } from 'wouter'
import Header from './components/Header'
import Modal from './components/Modal'
import { NoteList } from './components/Notes'
import { useData } from './context/DataContext'
import { CreateNote, EditNote } from './components/NoteActions'

function App () {
  const { notes, categories } = useData()

  const [isArchievedPath] = useRoute('/archieved')
  const [isNotePath, params] = useRoute('/note/:id')
  const [, setLocation] = useLocation()

  const currentNote = isNotePath && notes.find(note => note.id === params?.id)
  // If a note is being edited, I want to keep showing the same notes in NoteList
  const showArchieved = currentNote ? currentNote.archieved : isArchievedPath

  return (
    <section className='px-5 pb-10'>
      <Header path={showArchieved ? 'archieved' : 'home'} />
      <NoteList
        notes={notes
          .filter(note => note.archieved === showArchieved)
          .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())}
        categories={categories}
      />
      <Route path='/note/:id'>
        {() => {
          if (!currentNote) return null
          return (
            <Modal onClose={() => setLocation(showArchieved ? '/archieved' : '/')}>
              <EditNote data={currentNote} />
            </Modal>
          )
        }}
      </Route>
      <Route path='/new'>
        <Modal onClose={() => setLocation('/')}>
          <CreateNote />
        </Modal>
      </Route>
    </section>
  )
}

export default App
