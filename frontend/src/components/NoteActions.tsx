import { useState } from 'react'
import { Category, Note } from '../types'
import { editNote, createNote, createCategory, removeCategoryFromNote, addCategoryToNote } from '../api'
import { useLocation } from 'wouter'
import Button from './Button'

type NoteFormProps = {
  defaultFormData?: Partial<Note>
  // formAction: (newData: Partial<Note>) => void
  formAction: (newData: any) => void // for some reason Pick<Note, 'title' | 'content'>) is not compatible with Partial<Note>
}

function CategoryList ({ noteId, categories = [], setCategories }: { noteId: string, categories?: Category[], setCategories: (newCategories: Category[]) => void }) {
  const [newCategory, setNewCategory] = useState('')

  const isNoteCreation = !noteId

  async function addCategory (id: string, name: string) {
    try {
      const newCategory = await createCategory(name)
      !isNoteCreation && await addCategoryToNote(id, newCategory.id)
      setCategories([...categories, newCategory])
      setNewCategory('')
    } catch (err) { console.error(err) }
  }

  async function removeCategory (id: string, categoryId: number) {
    try {
      !isNoteCreation && await removeCategoryFromNote(id, categoryId)
      setCategories(categories.filter(cat => cat.id !== categoryId))
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <ul className='flex flex-wrap gap-3 p-4'>
        {categories.map(category =>
          <li
            key={category.id}
            className='flex w-min gap-2 rounded-full border bg-transparent p-2 px-4 text-lg outline-none'
          >
            <p>🏷️</p>
            <p className='whitespace-nowrap'>{category.name}</p>
            <span
              onClick={async () => await removeCategory(noteId, category.id)}
              className='scale-75 cursor-pointer'
            >╳
            </span>
          </li>)}
      </ul>
      <div className='flex items-center gap-2'>
        <button
          onClick={async () => await addCategory(noteId, newCategory)}
          className='ml-4 grid aspect-square h-10 w-10 place-content-center rounded-full border bg-gray-500/50'
        >
          ➕
        </button>
        <input
          placeholder='Category'
          className='rounded-full border bg-transparent p-2 px-4 text-lg outline-none'
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </div>
    </div>

  )
}

function NoteForm ({ defaultFormData, formAction }: NoteFormProps) {
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
        categories={formData?.categories}
        setCategories={(categories: Category[]) => setFormData(prev => ({ ...prev, categories }))}
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

export function EditNote ({ data, onUpdate }: { data: Note, onUpdate: (id: string, data: Partial<Note>) => void }) {
  async function handleEditNote (newFormData: Partial<Note>) {
    try {
      const editedData = await editNote(data.id, newFormData)
      onUpdate(data.id, editedData)
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

export function CreateNote ({ onAddition }: { onAddition: (data: Note) => void }) {
  const [,setLocation] = useLocation()

  async function handleCreateNote (newFormData: Pick<Note, 'title' | 'content' | 'categories'>) {
    try {
      const createdData = await createNote(newFormData)
      onAddition(createdData)
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
