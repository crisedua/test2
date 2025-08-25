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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Gestión de Clientes
            </h1>
            <p className="text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
              Administra tu base de datos de clientes de manera eficiente y organizada.
            </p>
          </div>

        {showForm ? (
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>
                <p className="text-slate-600">
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
          </div>
        ) : (
          <ClientList
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
            onAddClient={handleAddClient}
          />
        )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
