export type ActionState = ActionSuccess | ActionError

export interface ActionSuccess {
  success: true
  count: number
}

export interface ActionError {
  success: false
  message: string
  errors?: Record<string, string[]>
}
