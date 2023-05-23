import { useState } from 'react'
import { Note } from '../types'
import { editNote, createNote } from '../api'
import { useLocation } from 'wouter'
import Button from './Button'

type NoteFormProps = {
  defaultFormData?: Partial<Note>
  // formAction: (newData: Partial<Note>) => void
  formAction: (newData: any) => void // for some reason Pick<Note, 'title' | 'content'>) is not compatible with Partial<Note>
  isLoading?: boolean
}

function NoteForm ({ defaultFormData, formAction, isLoading = false }: NoteFormProps) {
  const [formData, setFormData] = useState<Partial<Note>>({
    ...defaultFormData
  })
  function handleFormSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    formAction(formData)
  }
  return (
    <form onSubmit={handleFormSubmit} className='flex max-h-[500px] flex-col'>
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
      <div className='mt-auto grid grid-cols-3 items-center p-4'>
        <Button>{isLoading ? '◴' : 'Save'}</Button>
        {defaultFormData &&
          <p className='col-span-2 col-start-2 text-end'>
            Last updated: {defaultFormData?.updatedAt?.toLocaleString('en-US')}
          </p>}
      </div>
    </form>
  )
}

export function EditNote ({ data, onUpdate }: { data: Note, onUpdate: (id: string, data: Partial<Note>) => void }) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleEditNote (newFormData: Partial<Note>) {
    if (isLoading) return
    setIsLoading(true)
    try {
      const editedData = await editNote(data.id, newFormData)
      onUpdate(data.id, editedData)
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  return (
    <NoteForm
      defaultFormData={data}
      formAction={handleEditNote} isLoading={isLoading}
    />
  )
}

export function CreateNote ({ onAddition }: { onAddition: (data: Note) => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [,setLocation] = useLocation()

  async function handleCreateNote (newFormData: Pick<Note, 'title' | 'content'>) {
    if (isLoading) return
    setIsLoading(true)
    try {
      const createdData = await createNote(newFormData)
      onAddition(createdData)
    } catch (err) {
      setIsLoading(false)
      console.error(err)
    }
    setLocation('/')
  }

  return (
    <NoteForm
      formAction={handleCreateNote} isLoading={isLoading}
    />
  )
}
