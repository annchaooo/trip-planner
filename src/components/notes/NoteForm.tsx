'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

const POST_TYPES = [
  { value: 'photo', label: 'Photo', icon: '📷', desc: 'Share a photo memory' },
  { value: 'note', label: 'Note', icon: '📝', desc: 'Quick thought or tip' },
  { value: 'essay', label: 'Story', icon: '✍️', desc: 'Write about your experience' },
  { value: 'highlight', label: 'Highlight', icon: '⭐', desc: 'Special moment' },
]

const MOODS = [
  { value: 'happy', icon: '😊' },
  { value: 'excited', icon: '🤩' },
  { value: 'peaceful', icon: '😌' },
  { value: 'adventurous', icon: '🧗' },
  { value: 'amazed', icon: '😮' },
  { value: 'tired', icon: '😴' },
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
  const [step, setStep] = useState<'type' | 'content'>('type')
  const [type, setType] = useState('')
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
      setError('Only JPEG, PNG, GIF, and WebP images are allowed')
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
        throw new Error(data.error || 'Failed to upload')
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

  const handleSelectType = (selectedType: string) => {
    setType(selectedType)
    setStep('content')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title.trim()) {
      setError('Add a title for your post')
      setLoading(false)
      return
    }

    if (type === 'photo' && !imageUrl) {
      setError('Add a photo to share')
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
        throw new Error(data.error || 'Failed to post')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  // Type selection step
  if (step === 'type') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button
            onClick={onCancel}
            className="text-gray-600 font-medium"
          >
            Cancel
          </button>
          <h3 className="font-semibold text-gray-900">New Post</h3>
          <div className="w-14" />
        </div>

        {/* Type Selection */}
        <div className="p-4">
          <p className="text-center text-gray-500 mb-4">What would you like to share?</p>
          <div className="grid grid-cols-2 gap-3">
            {POST_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => handleSelectType(t.value)}
                className="p-4 rounded-xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all text-left group"
              >
                <span className="text-3xl block mb-2">{t.icon}</span>
                <span className="font-semibold text-gray-900 block">{t.label}</span>
                <span className="text-xs text-gray-500">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Content creation step
  const selectedType = POST_TYPES.find(t => t.value === type)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => setStep('type')}
          className="text-gray-600 font-medium flex items-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>{selectedType?.icon}</span>
          {selectedType?.label}
        </h3>
        <button
          onClick={handleSubmit}
          disabled={loading || uploading}
          className="text-purple-600 font-semibold disabled:opacity-50"
        >
          {loading ? 'Sharing...' : 'Share'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Error */}
        {error && (
          <div className="px-4 pt-3">
            <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Image Upload Area */}
        <div className="p-4 border-b border-gray-100">
          {imagePreview ? (
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-white">
                    <span className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                </div>
              )}
              {!uploading && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {imageUrl && (
                <div className="absolute bottom-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Uploaded
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/50 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <p className="font-medium text-gray-700">Add a photo</p>
              <p className="text-xs text-gray-400 mt-1">
                {type === 'photo' ? 'Required for photo posts' : 'Optional'}
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

        {/* Title & Caption */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title..."
            className="w-full text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none"
          />

          {/* Caption/Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === 'essay'
                ? "Write your story..."
                : type === 'photo'
                ? "Write a caption..."
                : "Add some notes..."
            }
            rows={type === 'essay' ? 6 : 3}
            className="w-full text-gray-700 placeholder-gray-400 outline-none resize-none"
          />
        </div>

        {/* Mood Selection */}
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-500 mb-2">How are you feeling?</p>
          <div className="flex items-center gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(mood === m.value ? '' : m.value)}
                className={`w-10 h-10 rounded-full text-xl transition-all ${
                  mood === m.value
                    ? 'bg-purple-100 ring-2 ring-purple-500 ring-offset-2'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {m.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Location & Date */}
        <div className="px-4 pb-4 space-y-3">
          {/* Location Row */}
          <div className="flex items-center gap-3 py-3 border-t border-gray-100">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1 flex items-center gap-2">
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="flex-1 text-gray-700 outline-none bg-transparent"
              >
                <option value="">Add location</option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.city}, {dest.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specific Location */}
          {destinationId && (
            <div className="flex items-center gap-3">
              <div className="w-5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Specific place (e.g., Eiffel Tower)"
                className="flex-1 text-gray-600 text-sm outline-none placeholder-gray-400"
              />
            </div>
          )}

          {/* Date Row */}
          <div className="flex items-center gap-3 py-3 border-t border-gray-100">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 text-gray-700 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Submit Button (Mobile friendly) */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </span>
              ) : (
                'Share'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
