import { useState } from 'react'
import { Note } from '../types'
import { editNote } from '../api'

export default function NoteDetails ({ data, onUpdate }: { data: Note, onUpdate: (id: string, data: Partial<Note>) => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [newFormData, setNewFormData] = useState<Partial<Note>>({
    title: data.title,
    content: data.content
  })

  async function handleEditNote (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
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
    <form onSubmit={handleEditNote} className='flex max-h-[500px] flex-col'>
      <input
        className='bg-transparent px-4 py-3 pt-4 text-2xl outline-none'
        value={newFormData.title ?? ''}
        placeholder='Title'
        onChange={(e) => setNewFormData(prev => ({ ...prev, title: e.target.value }))}
      />
      <textarea
        className='min-h-[100px] resize-none px-4 py-3 text-lg outline-none'
        value={newFormData.content ?? ''}
        placeholder='Note'
        ref={(e) => {
          if (!e) return
          e.style.height = `${e.scrollHeight}px`
        }}
        onChange={(e) => {
          e.currentTarget.style.height = '100px'
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
          setNewFormData(prev => ({ ...prev, content: e.target.value }))
        }}
      />
      <div className='mt-auto grid grid-cols-3 p-4'>
        <button className='place-self-start'>{isLoading ? '◴' : 'Save'}</button>
        <p className='col-span-2 col-start-2 text-end'>Last updated: {data.updatedAt.toLocaleString('en-US')}</p>
      </div>
    </form>
  )
}
