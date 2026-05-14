export interface Highlight {
  _id: string
  DateTimeEntered: string
  description: string

  AddedBy: {
    userId: string
    name: string
    username: string
    role: string
  }

  createdAt: string
  updatedAt: string
}

export interface HighlightsResponse {
  success: boolean
  message: string

  data: Highlight[]

  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateHighlightPayload {
  DateTimeEntered: string
  description: string
}