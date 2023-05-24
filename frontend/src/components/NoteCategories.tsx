import { useState } from 'react'
import { addCategoryToNote, createCategory, removeCategoryFromNote } from '../api'
import { useData } from '../context/DataContext'
import { Category } from '../types'

function CategoryCard ({ data, onRemove }: { data: Category, onRemove: (id: number) => void }) {
  return (
    <li className='flex w-min gap-2 rounded-full border bg-transparent p-2 px-4 text-lg outline-none'>
      <p>🏷️</p>
      <p className='whitespace-nowrap'>{data.name}</p>
      <span
        onClick={() => onRemove(data.id)}
        className='scale-75 cursor-pointer'
      >╳
      </span>
    </li>
  )
}

export function CategoryList ({ noteId, noteCategories = [], setNoteCategories }: { noteId: string, noteCategories?: Category[], setNoteCategories: (newCategories: Category[]) => void }) {
  const { addCategory: cat } = useData()
  const [newCategory, setNewCategory] = useState('')

  const isNoteCreation = !noteId

  async function addCategory (noteId: string, name: string) {
    try {
      const newCategory = await createCategory(name)
      if (!isNoteCreation) await addCategoryToNote(noteId, newCategory.id)
      cat(newCategory)
      setNoteCategories([...noteCategories, newCategory])
      setNewCategory('')
    } catch (err) { console.error(err) }
  }

  async function removeCategory (id: string, categoryId: number) {
    try {
      if (!isNoteCreation) await removeCategoryFromNote(id, categoryId)
      setNoteCategories(noteCategories.filter(cat => cat.id !== categoryId))
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <ul className='flex flex-wrap gap-3 p-4'>
        {noteCategories.map(category =>
          <CategoryCard key={category.id} data={category} onRemove={async (id: number) => await removeCategory(noteId, id)} />
        )}
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
