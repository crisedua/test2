'use client'

import { DollarSign, Calendar, Edit, Trash2, Target } from 'lucide-react'
import type { Database } from '@/lib/supabase'

type Opportunity = Database['public']['Tables']['opportunities']['Row']

interface OpportunityPipelineProps {
  opportunities: Opportunity[]
  viewMode: 'pipeline' | 'list'
  onEdit: (opportunity: Opportunity) => void
  onDelete: (opportunity: Opportunity) => void
}

const stages = [
  { id: 'prospecto', name: 'Prospecto', color: 'bg-gray-100 text-gray-800' },
  { id: 'calificado', name: 'Calificado', color: 'bg-blue-100 text-blue-800' },
  { id: 'propuesta', name: 'Propuesta', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'negociacion', name: 'Negociación', color: 'bg-purple-100 text-purple-800' },
  { id: 'ganada', name: 'Ganada', color: 'bg-green-100 text-green-800' },
  { id: 'perdida', name: 'Perdida', color: 'bg-red-100 text-red-800' },
]

export default function OpportunityPipeline({ opportunities, viewMode, onEdit, onDelete }: OpportunityPipelineProps) {
  const getOpportunitiesByStage = () => {
    return stages.map(stage => ({
      ...stage,
      opportunities: opportunities.filter(opp => opp.stage === stage.id),
      totalValue: opportunities
        .filter(opp => opp.stage === stage.id)
        .reduce((sum, opp) => sum + (opp.value || 0), 0)
    }))
  }

  const handleDelete = (opportunity: Opportunity) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la oportunidad "${opportunity.title}"?`)) {
      onDelete(opportunity)
    }
  }

  if (viewMode === 'pipeline') {
    const stagesWithOpportunities = getOpportunitiesByStage()

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stagesWithOpportunities.map((stage) => (
          <div key={stage.id} className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{stage.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                  {stage.opportunities.length}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ${stage.totalValue.toLocaleString()}
              </p>
            </div>
            
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {stage.opportunities.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No hay oportunidades
                </p>
              ) : (
                stage.opportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {opportunity.title}
                        </h4>
                        <div className="mt-1 space-y-1">
                          {opportunity.value && (
                            <div className="flex items-center text-xs text-gray-500">
                              <DollarSign className="h-3 w-3 mr-1" />
                              <span>${opportunity.value.toLocaleString()}</span>
                            </div>
                          )}
                          {opportunity.probability && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Target className="h-3 w-3 mr-1" />
                              <span>{opportunity.probability}%</span>
                            </div>
                          )}
                          {opportunity.expected_close_date && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(opportunity.expected_close_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => onEdit(opportunity)}
                          className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(opportunity)}
                          className="p-1 text-gray-400 hover:text-red-600 focus:outline-none"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Vista de lista
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {opportunities.length === 0 ? (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay oportunidades</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando tu primera oportunidad de venta.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {opportunities.map((opportunity) => (
            <li key={opportunity.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {opportunity.title}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${(opportunity.value || 0).toLocaleString()}</span>
                        </div>
                        {opportunity.probability && (
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{opportunity.probability}%</span>
                          </div>
                        )}
                        {opportunity.expected_close_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(opportunity.expected_close_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            stages.find(s => s.id === opportunity.stage)?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {stages.find(s => s.id === opportunity.stage)?.name || opportunity.stage}
                          </span>
                        </div>
                      </div>
                      {opportunity.description && (
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {opportunity.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(opportunity)}
                    className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(opportunity)}
                    className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
