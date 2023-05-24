/* eslint-disable react/jsx-closing-tag-location */
import { useState } from 'react'
import { createPortal } from 'react-dom'
import Modal from './Modal'
import { Category, Note } from '../types'
import { editNote, removeNote } from '../api'
import { Link } from 'wouter'
import Button from './Button'

export function NoteList ({ notes, categories, onNoteUpdate }: { notes: Note[], categories: Category[], onNoteUpdate: (id: string, data: Partial<Note>, opt?: { delete: boolean }) => void }) {
  const [categoryFilter, setCategoryFilter] = useState<Category['id']>(0)

  if (notes.length === 0) return <div>There's nothing to show here...</div>

  const filteredNotes = notes
    .filter(note => !categoryFilter
      ? true
      : note?.categories.some(cat => cat?.id === categoryFilter))

  return (
    <>
      <select
        defaultValue='all'
        onChange={(e) => setCategoryFilter(+e.target.value)}
        className='mb-5 w-full max-w-xs px-2 py-1'
      >
        <option value={0}>All</option>
        {categories.map(category =>
          <option
            key={category.id}
            value={category.id}
          >{category.name}
          </option>)}
      </select>
      <ul className='grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-5 '>
        {filteredNotes.map(note => <NoteCard key={note.id} data={note} onUpdate={onNoteUpdate} />)}
      </ul>
    </>
  )
}

function NoteCard ({ data, onUpdate }: { data: Note, onUpdate: (id: string, data: Partial<Note>, opt?: { delete: boolean }) => void }) {
  const [modal, setModal] = useState<React.ReactNode>(null)

  async function handleChangeState () {
    try {
      const editedNote = await editNote(data.id, { archieved: !data.archieved })
      onUpdate(data.id, editedNote)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleRemove () {
    try {
      await removeNote(data.id)
      onUpdate(data.id, {}, { delete: true })
    } catch (err) {
      console.error(err)
    }
    handleHideModal()
  }

  function handleShowModal () {
    if (!modal) {
      return setModal(
        <div className='p-4'>
          <p className='mb-4 text-xl'>Are you sure you want to delete this note?</p>
          <div className='flex gap-10'>
            <Button onClick={handleRemove}>Yes</Button>
            <Button onClick={handleHideModal}>No</Button>
          </div>
        </div>)
    }
  }

  function handleHideModal () {
    setModal(null)
  }

  return (
    <li className='aspect-[4/3] w-full rounded-md bg-yellow-200 p-4 shadow-lg'>
      {modal && createPortal(
        <Modal onClose={handleHideModal}>{modal}</Modal>,
        document.body
      )}
      <Link
        href={`/note/${data.id}`}
        className='block h-full cursor-pointer overflow-hidden'
      >
        <p className='overflow-hidden text-ellipsis text-lg font-semibold'>{data.title}</p>
        <p className='break-words'>{data.content}</p>
      </Link>
      <div className='flex items-end justify-end gap-4 text-2xl'>
        <p
          onClick={handleChangeState}
          className='cursor-pointer'
        >{data.archieved ? '⬆️' : '🗂️'}
        </p>
        <Link
          href={`/note/${data.id}`}
          className='cursor-pointer'
        >✏️</Link>
        <p
          onClick={handleShowModal}
          className='cursor-pointer'
        >🗑️
        </p>
      </div>
    </li>
  )
}
