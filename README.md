# CRM - Sistema de Gestión de Clientes

Una aplicación CRM moderna y completa construida con Next.js, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- **Autenticación completa**: Login y registro de usuarios
- **Gestión de clientes**: CRUD completo con búsqueda
- **Dashboard interactivo**: Estadísticas y actividad reciente
- **Interfaz responsiva**: Diseño moderno que funciona en todos los dispositivos
- **Seguridad**: Row Level Security (RLS) y validación de datos
- **TypeScript**: Código completamente tipado para mayor robustez

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React
- **Despliegue**: Netlify (recomendado)

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd crm-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Configurar Supabase**
   
   Ve a tu proyecto de Supabase y ejecuta el siguiente SQL para crear las tablas:

   ```sql
   -- Crear tabla de perfiles
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Crear tabla de clientes
   CREATE TABLE clients (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT NOT NULL,
     company TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Habilitar RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

   -- Políticas para perfiles
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   -- Políticas para clientes
   CREATE POLICY "Users can view own clients" ON clients
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own clients" ON clients
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own clients" ON clients
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own clients" ON clients
     FOR DELETE USING (auth.uid() = user_id);

   -- Función para actualizar updated_at
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ language 'plpgsql';

   -- Triggers para updated_at
   CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

   CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── auth/              # Página de autenticación
│   ├── dashboard/         # Dashboard principal
│   ├── clients/           # Gestión de clientes
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/             # Componentes reutilizables
│   ├── AuthForm.tsx       # Formulario de autenticación
│   ├── ClientForm.tsx     # Formulario de cliente
│   ├── ClientList.tsx     # Lista de clientes
│   ├── Navigation.tsx     # Navegación principal
│   └── ProtectedRoute.tsx # Protección de rutas
├── contexts/               # Contextos de React
│   └── AuthContext.tsx    # Contexto de autenticación
├── hooks/                  # Hooks personalizados
│   └── useClients.ts      # Hook para gestión de clientes
└── lib/                    # Utilidades y configuraciones
    ├── schemas.ts          # Esquemas de validación Zod
    └── supabase.ts         # Configuración de Supabase
```

## 🔐 Configuración de Supabase

1. **Crear proyecto**: Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. **Obtener credenciales**: En Settings > API, copia la URL y la anon key
3. **Configurar autenticación**: En Authentication > Settings, configura el sitio URL
4. **Ejecutar SQL**: Usa el SQL proporcionado arriba para crear las tablas

## 🚀 Despliegue en Netlify

1. **Conectar repositorio**: Conecta tu repositorio de GitHub a Netlify
2. **Configurar build**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Variables de entorno**: Agrega las variables de Supabase en Netlify
4. **Desplegar**: Netlify detectará cambios automáticamente

## 📱 Funcionalidades

### Autenticación
- Registro de usuarios con email/contraseña
- Login seguro
- Gestión de sesiones
- Rutas protegidas

### Gestión de Clientes
- Crear nuevos clientes
- Editar información existente
- Eliminar clientes
- Búsqueda en tiempo real
- Validación de formularios

### Dashboard
- Estadísticas en tiempo real
- Actividad reciente
- Navegación intuitiva
- Diseño responsivo

## 🔒 Seguridad

- **Row Level Security (RLS)**: Los usuarios solo ven sus propios datos
- **Validación**: Todos los formularios usan Zod para validación
- **Autenticación**: Sistema robusto de autenticación con Supabase
- **Variables de entorno**: Credenciales seguras

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Next.js](https://nextjs.org/docs)
2. Consulta la documentación de [Supabase](https://supabase.com/docs)
3. Abre un issue en este repositorio

## 🎯 Roadmap

- [ ] Notificaciones por email
- [ ] Exportación de datos
- [ ] Integración con calendario
- [ ] Dashboard avanzado con gráficos
- [ ] API REST para integraciones
- [ ] Aplicación móvil

---

**¡Disfruta construyendo tu CRM! 🚀**
