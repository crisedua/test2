'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { interactionSchema, type InteractionFormData } from '@/lib/schemas'
import { useState } from 'react'
import { useInteractions } from '@/hooks/useInteractions'
import type { Database } from '@/lib/supabase'

type Interaction = Database['public']['Tables']['interactions']['Row']
type Client = Database['public']['Tables']['clients']['Row']
type Opportunity = Database['public']['Tables']['opportunities']['Row']

interface InteractionFormProps {
  interaction?: Interaction | null
  clients: Client[]
  opportunities: Opportunity[]
  onSuccess?: () => void
  onCancel?: () => void
}

export default function InteractionForm({ interaction, clients, opportunities, onSuccess, onCancel }: InteractionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createInteraction, updateInteraction } = useInteractions()
  const isEditing = !!interaction

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InteractionFormData>({
    resolver: zodResolver(interactionSchema),
    defaultValues: interaction ? {
      type: interaction.type as 'llamada' | 'email' | 'reunion' | 'nota' | 'demo' | 'propuesta',
      subject: interaction.subject,
      description: interaction.description || '',
      duration: interaction.duration || undefined,
      outcome: interaction.outcome || '',
      client_id: interaction.client_id || '',
      opportunity_id: interaction.opportunity_id || '',
    } : undefined,
  })

  const onSubmit = async (data: InteractionFormData) => {
    setIsSubmitting(true)
    try {
      const interactionData = {
        ...data,
        client_id: data.client_id || null,
        opportunity_id: data.opportunity_id || null,
        duration: data.duration || null,
      }

      if (isEditing && interaction) {
        await updateInteraction(interaction.id, interactionData)
      } else {
        await createInteraction(interactionData)
      }
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error saving interaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo de Interacción *
          </label>
          <select
            id="type"
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="llamada">Llamada</option>
            <option value="email">Email</option>
            <option value="reunion">Reunión</option>
            <option value="nota">Nota</option>
            <option value="demo">Demo</option>
            <option value="propuesta">Propuesta</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duración (minutos)
          </label>
          <input
            type="number"
            id="duration"
            min="0"
            {...register('duration', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="30"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Asunto *
          </label>
          <input
            type="text"
            id="subject"
            {...register('subject')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Ej: Llamada de seguimiento sobre propuesta comercial"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
            Cliente Relacionado
          </label>
          <select
            id="client_id"
            {...register('client_id')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Sin cliente específico</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.position || 'Sin cargo'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="opportunity_id" className="block text-sm font-medium text-gray-700">
            Oportunidad Relacionada
          </label>
          <select
            id="opportunity_id"
            {...register('opportunity_id')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Sin oportunidad específica</option>
            {opportunities.map((opportunity) => (
              <option key={opportunity.id} value={opportunity.id}>
                {opportunity.title}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción Detallada
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe los detalles de la interacción, temas tratados, acuerdos, etc."
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="outcome" className="block text-sm font-medium text-gray-700">
            Resultado/Próximos Pasos
          </label>
          <textarea
            id="outcome"
            rows={3}
            {...register('outcome')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="¿Cuál fue el resultado? ¿Hay acciones de seguimiento?"
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
