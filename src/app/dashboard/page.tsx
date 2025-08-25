'use client'

import { useClients } from '@/hooks/useClients'
import { Users, TrendingUp, Calendar, Building } from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardPage() {
  const { clients, loading } = useClients()

  const stats = [
    {
      name: 'Total de Clientes',
      value: clients.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Clientes este Mes',
      value: clients.filter(client => {
        const clientDate = new Date(client.created_at)
        const now = new Date()
        return clientDate.getMonth() === now.getMonth() && 
               clientDate.getFullYear() === now.getFullYear()
      }).length,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'Empresas Únicas',
      value: new Set(clients.map(client => client.company)).size,
      icon: Building,
      color: 'bg-purple-500',
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido a tu CRM. Aquí tienes un resumen de tu actividad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
          </div>
          <div className="p-6">
            {clients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza agregando tu primer cliente.
                </p>
                <div className="mt-6">
                  <Link
                    href="/clients"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Agregar Cliente
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {clients.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {client.name}
                      </p>
                      <p className="text-sm text-gray-500">{client.company}</p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {new Date(client.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {clients.length > 5 && (
                  <div className="text-center pt-4">
                    <Link
                      href="/clients"
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Ver todos los clientes →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
