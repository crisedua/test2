'use client'

import { useState } from 'react'
import { useOpportunities } from '@/hooks/useOpportunities'
import { useClients } from '@/hooks/useClients'
import ProtectedRoute from '@/components/ProtectedRoute'
import OpportunityForm from '@/components/OpportunityForm'
import OpportunityPipeline from '@/components/OpportunityPipeline'
import { Plus, DollarSign, TrendingUp, Target } from 'lucide-react'
import type { Database } from '@/lib/supabase'

type Opportunity = Database['public']['Tables']['opportunities']['Row']

export default function OpportunitiesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null)
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline')
  
  const { opportunities, loading, deleteOpportunity, getTotalValue } = useOpportunities()
  const { clients } = useClients()

  const handleAddOpportunity = () => {
    setEditingOpportunity(null)
    setShowForm(true)
  }

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity)
    setShowForm(true)
  }

  const handleDeleteOpportunity = async (opportunity: Opportunity) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la oportunidad "${opportunity.title}"?`)) {
      await deleteOpportunity(opportunity.id)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingOpportunity(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingOpportunity(null)
  }

  const stats = [
    {
      name: 'Total de Oportunidades',
      value: opportunities.length,
      icon: Target,
      color: 'bg-blue-500',
    },
    {
      name: 'Valor Total',
      value: `$${getTotalValue().toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Oportunidades Ganadas',
      value: opportunities.filter(opp => opp.stage === 'ganada').length,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ]

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
              Pipeline de Ventas
            </h1>
            <p className="text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
              Gestiona tus oportunidades de venta y sigue el progreso de cada deal con visualización avanzada.
            </p>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className={`p-4 rounded-2xl ${stat.color} shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-6">
                      <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.name}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center mb-8">
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                viewMode === 'pipeline'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white/80 text-slate-700 border border-slate-200 hover:bg-white hover:shadow-md'
              }`}
            >
              Vista Pipeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white/80 text-slate-700 border border-slate-200 hover:bg-white hover:shadow-md'
              }`}
            >
              Vista Lista
            </button>
          </div>
          
          <button
            onClick={handleAddOpportunity}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Nueva Oportunidad</span>
          </button>
        </div>

        {showForm ? (
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {editingOpportunity ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
                </h2>
                <p className="text-slate-600">
                  {editingOpportunity 
                    ? 'Modifica la información de la oportunidad seleccionada.'
                    : 'Completa el formulario para agregar una nueva oportunidad de venta.'
                  }
                </p>
              </div>
              
              <OpportunityForm
                opportunity={editingOpportunity}
                clients={clients}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        ) : (
          <OpportunityPipeline
            opportunities={opportunities}
            viewMode={viewMode}
            onEdit={handleEditOpportunity}
            onDelete={handleDeleteOpportunity}
          />
        )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
