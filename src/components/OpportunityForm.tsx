'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { opportunitySchema, type OpportunityFormData } from '@/lib/schemas'
import { useState } from 'react'
import { useOpportunities } from '@/hooks/useOpportunities'
import type { Database } from '@/lib/supabase'

type Opportunity = Database['public']['Tables']['opportunities']['Row']
type Client = Database['public']['Tables']['clients']['Row']

interface OpportunityFormProps {
  opportunity?: Opportunity | null
  clients: Client[]
  onSuccess?: () => void
  onCancel?: () => void
}

export default function OpportunityForm({ opportunity, clients, onSuccess, onCancel }: OpportunityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createOpportunity, updateOpportunity } = useOpportunities()
  const isEditing = !!opportunity

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: opportunity ? {
      title: opportunity.title,
      description: opportunity.description || '',
      value: opportunity.value || undefined,
      stage: opportunity.stage as 'prospecto' | 'calificado' | 'propuesta' | 'negociacion' | 'ganada' | 'perdida',
      probability: opportunity.probability || undefined,
      expected_close_date: opportunity.expected_close_date || '',
      client_id: opportunity.client_id,
    } : undefined,
  })

  const onSubmit = async (data: OpportunityFormData) => {
    setIsSubmitting(true)
    try {
      if (isEditing && opportunity) {
        await updateOpportunity(opportunity.id, data)
      } else {
        await createOpportunity(data)
      }
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error saving opportunity:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título de la Oportunidad *
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Ej: Venta de software CRM a Empresa ABC"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
            Cliente *
          </label>
          <select
            id="client_id"
            {...register('client_id')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Seleccionar cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.position || 'Sin cargo'}
              </option>
            ))}
          </select>
          {errors.client_id && (
            <p className="mt-1 text-sm text-red-600">{errors.client_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
            Etapa del Pipeline *
          </label>
          <select
            id="stage"
            {...register('stage')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="prospecto">Prospecto</option>
            <option value="calificado">Calificado</option>
            <option value="propuesta">Propuesta</option>
            <option value="negociacion">Negociación</option>
            <option value="ganada">Ganada</option>
            <option value="perdida">Perdida</option>
          </select>
          {errors.stage && (
            <p className="mt-1 text-sm text-red-600">{errors.stage.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Valor Estimado ($)
          </label>
          <input
            type="number"
            id="value"
            step="0.01"
            min="0"
            {...register('value', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0.00"
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="probability" className="block text-sm font-medium text-gray-700">
            Probabilidad (%)
          </label>
          <input
            type="number"
            id="probability"
            min="0"
            max="100"
            {...register('probability', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="50"
          />
          {errors.probability && (
            <p className="mt-1 text-sm text-red-600">{errors.probability.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="expected_close_date" className="block text-sm font-medium text-gray-700">
            Fecha Esperada de Cierre
          </label>
          <input
            type="date"
            id="expected_close_date"
            {...register('expected_close_date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Detalles adicionales sobre la oportunidad..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
