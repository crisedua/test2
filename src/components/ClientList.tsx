'use client'

import { useState } from 'react'
import { useClients } from '@/hooks/useClients'
import { Search, Edit, Trash2, Plus, Mail, Phone, Building, Filter, Calendar, FileText } from 'lucide-react'
import type { Database } from '@/lib/supabase'

type Client = Database['public']['Tables']['clients']['Row']

interface ClientListProps {
  onEditClient: (client: Client) => void
  onDeleteClient: (client: Client) => void
  onAddClient: () => void
}

export default function ClientList({ onEditClient, onDeleteClient, onAddClient }: ClientListProps) {
  const { clients, loading, error, searchClients } = useClients()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      await searchClients(query)
      setIsSearching(false)
    }
  }

  const handleDelete = async (client: Client) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${client.name}?`)) {
      await onDeleteClient(client)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cliente':
        return 'bg-green-100 text-green-800'
      case 'prospecto':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactivo':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'cliente':
        return 'Cliente'
      case 'prospecto':
        return 'Prospecto'
      case 'inactivo':
        return 'Inactivo'
      default:
        return status
    }
  }

  const filteredClients = clients.filter(client => {
    if (statusFilter !== 'all' && client.status !== statusFilter) {
      return false
    }
    return true
  })

  if (loading && !isSearching) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los Estados</option>
              <option value="prospecto">Prospectos</option>
              <option value="cliente">Clientes</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>
        <button
          onClick={onAddClient}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {isSearching && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

             {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No se encontraron clientes que coincidan con tu búsqueda.' : 'No hay clientes aún. ¡Crea tu primer cliente!'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
                         {filteredClients.map((client) => (
              <li key={client.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {client.name}
                        </p>
                                                 <div className="flex items-center space-x-4 text-sm text-gray-500">
                           <div className="flex items-center space-x-1">
                             <Mail className="h-4 w-4" />
                             <span>{client.email}</span>
                           </div>
                           <div className="flex items-center space-x-1">
                             <Phone className="h-4 w-4" />
                             <span>{client.phone}</span>
                           </div>
                           <div className="flex items-center space-x-1">
                             <Building className="h-4 w-4" />
                             <span>{client.company}</span>
                           </div>
                           <div className="flex items-center space-x-1">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                               {getStatusText(client.status)}
                             </span>
                           </div>
                         </div>
                         {client.notes && (
                           <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
                             <FileText className="h-4 w-4" />
                             <span className="truncate">{client.notes}</span>
                           </div>
                         )}
                         {client.lastContact && (
                           <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                             <Calendar className="h-4 w-4" />
                             <span>Último contacto: {new Date(client.lastContact).toLocaleDateString()}</span>
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditClient(client)}
                      className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client)}
                      className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
