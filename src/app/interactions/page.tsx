'use client'

import { useState } from 'react'
import { useInteractions } from '@/hooks/useInteractions'
import { useClients } from '@/hooks/useClients'
import { useOpportunities } from '@/hooks/useOpportunities'
import ProtectedRoute from '@/components/ProtectedRoute'
import InteractionForm from '@/components/InteractionForm'
import InteractionList from '@/components/InteractionList'
import { Plus, MessageCircle, Phone, Mail, Clock } from 'lucide-react'
import type { Database } from '@/lib/supabase'

type Interaction = Database['public']['Tables']['interactions']['Row']

export default function InteractionsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  
  const { interactions, loading, getInteractionsByType, getTotalDuration, deleteInteraction } = useInteractions()
  const { clients } = useClients()
  const { opportunities } = useOpportunities()

  const handleAddInteraction = () => {
    setEditingInteraction(null)
    setShowForm(true)
  }

  const handleEditInteraction = (interaction: Interaction) => {
    setEditingInteraction(interaction)
    setShowForm(true)
  }

  const handleDeleteInteraction = async (interaction: Interaction) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la interacción "${interaction.subject}"?`)) {
      await deleteInteraction(interaction.id)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingInteraction(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingInteraction(null)
  }

  const interactionsByType = getInteractionsByType()

  const stats = [
    {
      name: 'Total Interacciones',
      value: interactions.length,
      icon: MessageCircle,
      color: 'bg-blue-500',
    },
    {
      name: 'Llamadas',
      value: interactionsByType.llamada?.length || 0,
      icon: Phone,
      color: 'bg-green-500',
    },
    {
      name: 'Emails',
      value: interactionsByType.email?.length || 0,
      icon: Mail,
      color: 'bg-purple-500',
    },
    {
      name: 'Tiempo Total (min)',
      value: getTotalDuration(),
      icon: Clock,
      color: 'bg-orange-500',
    },
  ]

  const filteredInteractions = interactions.filter(interaction => {
    if (typeFilter !== 'all' && interaction.type !== typeFilter) return false
    return true
  })

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Historial de Actividades
            </h1>
            <p className="text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
              Registra y gestiona todas las interacciones con tus clientes y oportunidades de manera organizada.
            </p>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-2xl ${stat.color} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.name}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Interacción</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los Tipos</option>
              <option value="llamada">Llamadas</option>
              <option value="email">Emails</option>
              <option value="reunion">Reuniones</option>
              <option value="nota">Notas</option>
              <option value="demo">Demos</option>
              <option value="propuesta">Propuestas</option>
            </select>
          </div>
          
          <button
            onClick={handleAddInteraction}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Actividad</span>
          </button>
        </div>

        {showForm ? (
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {editingInteraction ? 'Editar Actividad' : 'Nueva Actividad'}
                </h2>
                <p className="text-slate-600">
                  {editingInteraction 
                    ? 'Modifica la información de la actividad seleccionada.'
                    : 'Registra una nueva interacción con un cliente o oportunidad.'
                  }
                </p>
              </div>
              
              <InteractionForm
                interaction={editingInteraction}
                clients={clients}
                opportunities={opportunities}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        ) : (
          <InteractionList
            interactions={filteredInteractions}
            onEdit={handleEditInteraction}
            onDelete={handleDeleteInteraction}
          />
        )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
