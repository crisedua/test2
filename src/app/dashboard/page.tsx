'use client'

import { useClients } from '@/hooks/useClients'
import { useOpportunities } from '@/hooks/useOpportunities'
import { useTasks } from '@/hooks/useTasks'
import { useInteractions } from '@/hooks/useInteractions'
import { Users, Calendar, Target, CheckSquare, MessageCircle, DollarSign } from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardPage() {
  const { clients, loading } = useClients()
  const { opportunities, getTotalValue } = useOpportunities()
  const { getTasksByStatus, getOverdueTasks } = useTasks()
  const { interactions } = useInteractions()

  const tasksByStatus = getTasksByStatus()
  const overdueTasks = getOverdueTasks()

  const stats = [
    {
      name: 'Total de Clientes',
      value: clients.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Oportunidades',
      value: opportunities.length,
      icon: Target,
      color: 'bg-green-500',
    },
    {
      name: 'Valor Pipeline',
      value: `$${getTotalValue().toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      name: 'Tareas Pendientes',
      value: tasksByStatus.pendiente?.length || 0,
      icon: CheckSquare,
      color: 'bg-yellow-500',
    },
    {
      name: 'Tareas Vencidas',
      value: overdueTasks.length,
      icon: Calendar,
      color: 'bg-red-500',
    },
    {
      name: 'Actividades Hoy',
      value: interactions.filter(interaction => {
        const today = new Date().toDateString()
        return new Date(interaction.date).toDateString() === today
      }).length,
      icon: MessageCircle,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Dashboard CRM
            </h1>
            <p className="text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
              Bienvenido a tu centro de control empresarial. Monitorea métricas clave y toma decisiones informadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                  Actividad Reciente
                </h2>
              </div>
              <div className="p-8">
                {clients.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-4">
                      <Users className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay clientes</h3>
                    <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                      Comienza construyendo tu base de clientes para ver la actividad aquí.
                    </p>
                    <Link
                      href="/clients"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Agregar Primer Cliente
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {clients.slice(0, 5).map((client, index) => (
                      <div key={client.id} className={`flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50/80 transition-colors duration-200 ${index !== clients.length - 1 ? 'border-b border-slate-100/50 pb-6' : ''}`}>
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-slate-900 truncate">
                            {client.name}
                          </p>
                          <p className="text-sm text-slate-500">{client.position || 'Sin cargo'}</p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-slate-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(client.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {clients.length > 5 && (
                      <div className="text-center pt-6">
                        <Link
                          href="/clients"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
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
        </div>
      </div>
    </ProtectedRoute>
  )
}
