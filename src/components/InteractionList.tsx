'use client'

import { Phone, Mail, Users, FileText, Video, ClipboardList, Calendar, Clock, Edit, Trash2, MessageCircle } from 'lucide-react'
import type { Database } from '@/lib/supabase'

type Interaction = Database['public']['Tables']['interactions']['Row']

interface InteractionListProps {
  interactions: Interaction[]
  onEdit: (interaction: Interaction) => void
  onDelete: (interaction: Interaction) => void
}

export default function InteractionList({ interactions, onEdit, onDelete }: InteractionListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'llamada':
        return Phone
      case 'email':
        return Mail
      case 'reunion':
        return Users
      case 'nota':
        return FileText
      case 'demo':
        return Video
      case 'propuesta':
        return ClipboardList
      default:
        return MessageCircle
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'llamada':
        return 'bg-green-100 text-green-800'
      case 'email':
        return 'bg-blue-100 text-blue-800'
      case 'reunion':
        return 'bg-purple-100 text-purple-800'
      case 'nota':
        return 'bg-gray-100 text-gray-800'
      case 'demo':
        return 'bg-orange-100 text-orange-800'
      case 'propuesta':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'llamada':
        return 'Llamada'
      case 'email':
        return 'Email'
      case 'reunion':
        return 'Reunión'
      case 'nota':
        return 'Nota'
      case 'demo':
        return 'Demo'
      case 'propuesta':
        return 'Propuesta'
      default:
        return type
    }
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
  }

  if (interactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center py-12">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay actividades</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza registrando tu primera interacción con un cliente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {interactions.map((interaction) => {
          const TypeIcon = getTypeIcon(interaction.type)
          return (
            <li key={interaction.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className={`p-2 rounded-full ${getTypeColor(interaction.type)}`}>
                    <TypeIcon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {interaction.subject}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(interaction.type)}`}>
                        {getTypeText(interaction.type)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(interaction.date).toLocaleDateString()}</span>
                        <span>{new Date(interaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {interaction.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(interaction.duration)}</span>
                        </div>
                      )}
                    </div>

                    {interaction.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {interaction.description}
                      </p>
                    )}

                    {interaction.outcome && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <p className="font-medium text-blue-900">Resultado:</p>
                        <p className="text-blue-800">{interaction.outcome}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(interaction)}
                    className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(interaction)}
                    className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
