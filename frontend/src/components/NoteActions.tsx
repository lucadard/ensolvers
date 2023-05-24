import { useState } from 'react'
import { Category, Note } from '../types'
import { editNote, createNote } from '../api'
import { useLocation } from 'wouter'
import Button from './Button'
import { useData } from '../context/DataContext'
import { CategoryList } from './NoteCategories'

type NoteFormProps = {
  defaultFormData?: Partial<Note>
  // formAction: (newData: Partial<Note>) => void
  formAction: (newData: any) => void // for some reason Pick<Note, 'title' | 'content'>) is not compatible with Partial<Note>
}

function NoteForm ({ defaultFormData, formAction }: NoteFormProps) {
  const { updateNote } = useData()

  const [formData, setFormData] = useState<Partial<Note>>({
    ...defaultFormData
  })

  function handleFormSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    formAction(formData)
  }

  return (
    <div className='flex max-h-[500px] flex-col'>
      <input
        className='bg-transparent px-4 py-3 pt-4 text-2xl outline-none'
        value={formData.title ?? ''}
        placeholder='Title'
        autoComplete='off'
        autoFocus
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />
      <textarea
        className='min-h-[100px] resize-none px-4 py-3 text-lg outline-none'
        value={formData.content ?? ''}
        placeholder='Note'
        ref={(e) => {
          if (!e) return
          e.style.height = `${e.scrollHeight}px`
        }}
        onChange={(e) => {
          e.currentTarget.style.height = '100px'
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
          setFormData(prev => ({ ...prev, content: e.target.value }))
        }}
      />
      <CategoryList
        noteId={defaultFormData?.id ?? ''}
        noteCategories={formData?.categories}
        setNoteCategories={(categories: Category[]) => {
          setFormData(prev => {
            defaultFormData?.id && updateNote(defaultFormData?.id, { categories })
            return { ...prev, categories }
          })
        }}
      />
      <div className='mt-auto grid grid-cols-3 items-center p-4'>
        <Button onClick={handleFormSubmit}>{formData.id ? 'Save' : 'Create'}</Button>
        {defaultFormData &&
          <p className='col-span-2 col-start-2 text-end'>
            Last updated: {defaultFormData?.updatedAt?.toLocaleString('en-US')}
          </p>}
      </div>
    </div>
  )
}

export function EditNote ({ data }: { data: Note }) {
  const { updateNote } = useData()

  async function handleEditNote (newFormData: Partial<Note>) {
    try {
      const editedData = await editNote(data.id, newFormData)
      updateNote(data.id, editedData)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <NoteForm
      defaultFormData={data}
      formAction={handleEditNote}
    />
  )
}

export function CreateNote () {
  const { addNote } = useData()
  const [,setLocation] = useLocation()

  async function handleCreateNote (newFormData: Pick<Note, 'title' | 'content' | 'categories'>) {
    try {
      const createdData = await createNote(newFormData)
      addNote(createdData)
    } catch (err) {
      console.error(err)
    }
    setLocation('/')
  }

  return (
    <NoteForm
      formAction={handleCreateNote}
    />
  )
}
