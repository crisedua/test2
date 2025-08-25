'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User, Users, Home, Target, CheckSquare, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
  }

  // Solo mostrar navegación si hay usuario autenticado
  if (!user) return null

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CRM</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Home className="h-4 w-4 inline mr-2" />
              Dashboard
            </Link>
            <Link
              href="/clients"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/clients'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Clientes
            </Link>
            <Link
              href="/opportunities"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/opportunities'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              Oportunidades
            </Link>
            <Link
              href="/tasks"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/tasks'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <CheckSquare className="h-4 w-4 inline mr-2" />
              Tareas
            </Link>
            <Link
              href="/interactions"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/interactions'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <MessageCircle className="h-4 w-4 inline mr-2" />
              Actividades
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
