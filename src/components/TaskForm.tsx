'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, type TaskFormData } from '@/lib/schemas'
import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import type { Database } from '@/lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']
type Client = Database['public']['Tables']['clients']['Row']
type Opportunity = Database['public']['Tables']['opportunities']['Row']

interface TaskFormProps {
  task?: Task | null
  clients: Client[]
  opportunities: Opportunity[]
  onSuccess?: () => void
  onCancel?: () => void
}

export default function TaskForm({ task, clients, opportunities, onSuccess, onCancel }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createTask, updateTask } = useTasks()
  const isEditing = !!task

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description || '',
      type: task.type as 'llamada' | 'email' | 'reunion' | 'seguimiento' | 'demo' | 'otros',
      priority: task.priority as 'baja' | 'media' | 'alta' | 'urgente',
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      client_id: task.client_id || '',
      opportunity_id: task.opportunity_id || '',
    } : undefined,
  })

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true)
    try {
      const taskData = {
        ...data,
        client_id: data.client_id || null,
        opportunity_id: data.opportunity_id || null,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
      }

      if (isEditing && task) {
        await updateTask(task.id, taskData)
      } else {
        await createTask(taskData)
      }
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título de la Tarea *
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Ej: Llamar al cliente para seguimiento"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo de Tarea *
          </label>
          <select
            id="type"
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="llamada">Llamada</option>
            <option value="email">Email</option>
            <option value="reunion">Reunión</option>
            <option value="seguimiento">Seguimiento</option>
            <option value="demo">Demo</option>
            <option value="otros">Otros</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Prioridad *
          </label>
          <select
            id="priority"
            {...register('priority')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            Fecha de Vencimiento
          </label>
          <input
            type="date"
            id="due_date"
            {...register('due_date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
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
            Descripción
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Detalles adicionales sobre la tarea..."
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
