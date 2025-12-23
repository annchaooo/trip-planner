'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

const ENTRY_TYPES = [
  { value: 'note', label: 'Note', icon: '○' },
  { value: 'essay', label: 'Essay', icon: '◇' },
  { value: 'highlight', label: 'Highlight', icon: '✦' },
  { value: 'photo', label: 'Photo', icon: '◐' },
]

const MOODS = [
  { value: 'happy', label: 'Joyful', icon: '☀' },
  { value: 'excited', label: 'Exhilarated', icon: '✦' },
  { value: 'peaceful', label: 'Serene', icon: '◌' },
  { value: 'adventurous', label: 'Adventurous', icon: '↗' },
  { value: 'amazed', label: 'In Awe', icon: '◇' },
  { value: 'tired', label: 'Weary', icon: '∿' },
]

interface Destination {
  id: string
  city: string
  country: string
}

interface NoteFormProps {
  tripId: string
  destinations: Destination[]
  onSuccess: () => void
  onCancel: () => void
}

export function NoteForm({ tripId, destinations, onSuccess, onCancel }: NoteFormProps) {
  const [type, setType] = useState('note')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [destinationId, setDestinationId] = useState('')
  const [location, setLocation] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Image must be under 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await response.json()
      setImageUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setImagePreview('')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageUrl('')
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title.trim()) {
      setError('Please add a title')
      setLoading(false)
      return
    }

    if (type === 'photo' && !imageUrl) {
      setError('Please add a photo')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/trips/${tripId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title: title.trim(),
          content: content.trim() || null,
          mood: mood || null,
          date,
          destination_id: destinationId || null,
          location: location.trim() || null,
          image_url: imageUrl || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const selectedType = ENTRY_TYPES.find(t => t.value === type)

  return (
    <div className="editorial-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
        <button
          onClick={onCancel}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          Cancel
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[#4d7c0f]">{selectedType?.icon}</span>
          <span className="font-meta text-stone-600">New {selectedType?.label}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || uploading}
          className="text-sm font-medium text-[#1e40af] hover:text-[#1e3a8a] transition-colors disabled:text-stone-300"
        >
          {loading ? 'Saving...' : 'Publish'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Error */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Type Selection */}
        <div className="px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            {ENTRY_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  type === t.value
                    ? 'bg-[#1e40af] text-white'
                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                }`}
              >
                <span className={type === t.value ? 'text-white/80' : 'text-[#4d7c0f]'}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="px-6 py-5 border-b border-stone-100">
          {imagePreview ? (
            <div className="relative">
              <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden bg-stone-100">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-[#1e40af] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-stone-600">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
              {!uploading && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors"
                >
                  Remove
                </button>
              )}
              {imageUrl && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-4 h-4 bg-[#4d7c0f]/20 rounded flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-[#4d7c0f]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-stone-500">Photo ready</span>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-200 rounded-lg py-10 text-center cursor-pointer hover:border-[#1e40af]/40 hover:bg-[#1e40af]/5 transition-all"
            >
              <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-stone-700 mb-1">Add a photograph</p>
              <p className="text-xs text-stone-400">
                {type === 'photo' ? 'Required for photo entries' : 'Optional'}
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div className="px-6 py-5 border-b border-stone-100">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a title..."
            className="w-full font-display text-2xl text-stone-900 placeholder-stone-300 outline-none bg-transparent"
          />
        </div>

        {/* Content */}
        <div className="px-6 py-5 border-b border-stone-100">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === 'essay'
                ? "Write your story..."
                : "Share your thoughts..."
            }
            rows={type === 'essay' ? 10 : 5}
            className="w-full text-stone-600 placeholder-stone-300 outline-none resize-none leading-relaxed bg-transparent font-body"
          />
        </div>

        {/* Metadata */}
        <div className="px-6 py-5 space-y-5">
          {/* Date & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-meta text-stone-400 block mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-lg text-sm text-stone-700 outline-none focus:ring-2 focus:ring-[#1e40af]/20"
              />
            </div>

            <div>
              <label className="font-meta text-stone-400 block mb-2">
                Location
              </label>
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-lg text-sm text-stone-700 outline-none focus:ring-2 focus:ring-[#1e40af]/20 appearance-none cursor-pointer"
              >
                <option value="">Select destination</option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.city}, {dest.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specific Place */}
          {destinationId && (
            <div>
              <label className="font-meta text-stone-400 block mb-2">
                Specific Place
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., The Louvre, Shibuya Crossing"
                className="w-full px-3 py-2 bg-stone-50 rounded-lg text-sm text-stone-700 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#1e40af]/20"
              />
            </div>
          )}

          {/* Mood */}
          <div>
            <label className="font-meta text-stone-400 block mb-3">
              How were you feeling?
            </label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(mood === m.value ? '' : m.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                    mood === m.value
                      ? 'bg-[#4d7c0f]/10 text-[#4d7c0f] ring-1 ring-[#4d7c0f]/30'
                      : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                  }`}
                >
                  <span>{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-5 border-t border-stone-100 bg-stone-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 text-sm font-medium text-stone-500 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 py-3 text-sm font-medium text-white bg-[#1e40af] rounded-lg hover:bg-[#1e3a8a] transition-colors disabled:bg-stone-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </span>
              ) : (
                'Publish Entry'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
