/* eslint-disable react/jsx-closing-tag-location */
import { useState } from 'react'
import { createPortal } from 'react-dom'
import Modal from './Modal'
import { Note } from '../types'
import { editNote, removeNote } from '../api'

export function NoteList ({ notes, onNoteUpdate }: { notes: Note[], onNoteUpdate: (id: string, data: Partial<Note>, opt?: { delete: boolean }) => void }) {
  if (notes.length === 0) return <div>There's nothing to show here...</div>

  return (
    <ul className='grid auto-cols-min grid-flow-col items-start gap-4'>
      {notes.map(note => <NoteCard key={note.id} data={note} onUpdate={onNoteUpdate} />)}
    </ul>
  )
}

function NoteCard ({ data, onUpdate }: { data: Note, onUpdate: (id: string, data: Partial<Note>, opt?: { delete: boolean }) => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [modal, setModal] = useState<React.ReactNode>(null)

  async function handleChangeState () {
    setIsLoading(true)
    try {
      const editedNote = await editNote(data.id, { archieved: !data.archieved })
      console.log(editedNote)
      onUpdate(data.id, editedNote)
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  async function handleRemove () {
    setIsLoading(true)
    try {
      await removeNote(data.id)
      onUpdate(data.id, {}, { delete: true })
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
    handleHideModal()
  }

  function handleShowModal () {
    if (!modal) {
      return setModal(
        <div className='p-4'>
          <p className='mb-4 text-xl'>Estas seguro?</p>
          {!isLoading
            ? <div className='flex justify-between'>
              <button
                className='rounded-xl text-3xl capitalize'
                onClick={handleRemove}
              >👍
              </button>
              <button
                className='rounded-xl text-3xl capitalize'
                onClick={handleHideModal}
              >👎
              </button>
            </div>
            : <p>Loading...</p>}
        </div>)
    }
  }

  function handleHideModal () {
    setModal(null)
  }

  return (
    <li className='aspect-[4/3] w-[240px] max-w-md rounded-md bg-yellow-200 p-4 shadow-lg'>
      {modal && createPortal(
        <Modal onClose={handleHideModal}>{modal}</Modal>,
        document.body
      )}
      <div className='h-full cursor-pointer overflow-hidden'>
        <p className='overflow-hidden text-ellipsis text-lg font-semibold'>{data.title}</p>
        <p className='break-words'>{data.content}</p>
      </div>
      <div className='flex items-end justify-end gap-2 text-2xl'>
        <p
          onClick={handleChangeState}
          className='cursor-pointer'
        >{isLoading ? '◴' : data.archieved ? '⬆️' : '🗂️'}
        </p>
        <p className='cursor-pointer'>✏️</p>
        <p
          onClick={handleShowModal}
          className='cursor-pointer'
        >🗑️
        </p>
      </div>
    </li>
  )
}
