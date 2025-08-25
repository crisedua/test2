import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const clientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres'),
  company: z.string().min(2, 'El nombre de la empresa debe tener al menos 2 caracteres'),
  position: z.string().optional(),
  status: z.enum(['prospecto', 'cliente', 'inactivo']),
  notes: z.string().optional(),
  lastContact: z.string().optional(),
})

export const opportunitySchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  value: z.number().min(0, 'El valor debe ser positivo').optional(),
  stage: z.enum(['prospecto', 'calificado', 'propuesta', 'negociacion', 'ganada', 'perdida']),
  probability: z.number().min(0).max(100).optional(),
  expected_close_date: z.string().optional(),
  client_id: z.string().min(1, 'Debe seleccionar un cliente'),
})

export const taskSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  type: z.enum(['llamada', 'email', 'reunion', 'seguimiento', 'demo', 'otros']),
  priority: z.enum(['baja', 'media', 'alta', 'urgente']),
  due_date: z.string().optional(),
  client_id: z.string().optional(),
  opportunity_id: z.string().optional(),
})

export const interactionSchema = z.object({
  type: z.enum(['llamada', 'email', 'reunion', 'nota', 'demo', 'propuesta']),
  subject: z.string().min(2, 'El asunto debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  duration: z.number().min(0).optional(),
  outcome: z.string().optional(),
  client_id: z.string().optional(),
  opportunity_id: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ClientFormData = z.infer<typeof clientSchema>
export type OpportunityFormData = z.infer<typeof opportunitySchema>
export type TaskFormData = z.infer<typeof taskSchema>
export type InteractionFormData = z.infer<typeof interactionSchema>
