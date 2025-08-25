'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { useClients } from '@/hooks/useClients'
import { useOpportunities } from '@/hooks/useOpportunities'
import ProtectedRoute from '@/components/ProtectedRoute'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import { Plus, CheckSquare, Clock, AlertTriangle } from 'lucide-react'
import type { Database } from '@/lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']

export default function TasksPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  
  const { tasks, loading, getTasksByStatus, getOverdueTasks, deleteTask } = useTasks()
  const { clients } = useClients()
  const { opportunities } = useOpportunities()

  const handleAddTask = () => {
    setEditingTask(null)
    setShowForm(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDeleteTask = async (task: Task) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`)) {
      await deleteTask(task.id)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  const tasksByStatus = getTasksByStatus()
  const overdueTasks = getOverdueTasks()

  const stats = [
    {
      name: 'Tareas Pendientes',
      value: tasksByStatus.pendiente?.length || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'En Progreso',
      value: tasksByStatus.en_progreso?.length || 0,
      icon: CheckSquare,
      color: 'bg-blue-500',
    },
    {
      name: 'Completadas',
      value: tasksByStatus.completada?.length || 0,
      icon: CheckSquare,
      color: 'bg-green-500',
    },
    {
      name: 'Vencidas',
      value: overdueTasks.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ]

  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
    return true
  })

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
              Gestión de Tareas
            </h1>
            <p className="text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
              Organiza y realiza seguimiento de todas tus tareas y recordatorios con un sistema inteligente.
            </p>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-2xl ${stat.color} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.name}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Alerta de tareas vencidas */}
        {overdueTasks.length > 0 && (
          <div className="group relative mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gradient-to-r from-red-50 to-pink-50 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200/50 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-red-800 mb-2">
                    ⚠️ Tienes {overdueTasks.length} tarea{overdueTasks.length > 1 ? 's' : ''} vencida{overdueTasks.length > 1 ? 's' : ''}
                  </h3>
                  <div className="text-red-700">
                    <ul className="space-y-2">
                      {overdueTasks.slice(0, 3).map((task) => (
                        <li key={task.id} className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          <span className="font-medium">{task.title}</span>
                          <span className="text-sm ml-2 opacity-75">
                            - Vencía el {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sin fecha'}
                          </span>
                        </li>
                      ))}
                      {overdueTasks.length > 3 && (
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          <span className="font-medium">Y {overdueTasks.length - 3} más...</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los Estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas las Prioridades</option>
                <option value="urgente">Urgente</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>

        {showForm ? (
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
                </h2>
                <p className="text-slate-600">
                  {editingTask 
                    ? 'Modifica la información de la tarea seleccionada.'
                    : 'Completa el formulario para agregar una nueva tarea.'
                  }
                </p>
              </div>
              
              <TaskForm
                task={editingTask}
                clients={clients}
                opportunities={opportunities}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
