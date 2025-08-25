'use client'

import { useState } from 'react'
import ClientList from '@/components/ClientList'
import ClientForm from '@/components/ClientForm'
import { useClients } from '@/hooks/useClients'
import ProtectedRoute from '@/components/ProtectedRoute'
import type { Database } from '@/lib/supabase'

type Client = Database['public']['Tables']['clients']['Row']

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const { deleteClient } = useClients()

  const handleAddClient = () => {
    setEditingClient(null)
    setShowForm(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setShowForm(true)
  }

  const handleDeleteClient = async (client: Client) => {
    await deleteClient(client.id)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingClient(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingClient(null)
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-2">
            Administra tu base de datos de clientes de manera eficiente.
          </p>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <p className="text-sm text-gray-600">
                {editingClient 
                  ? 'Modifica la información del cliente seleccionado.'
                  : 'Completa el formulario para agregar un nuevo cliente.'
                }
              </p>
            </div>
            
            <ClientForm
              client={editingClient || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        ) : (
          <ClientList
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
            onAddClient={handleAddClient}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
