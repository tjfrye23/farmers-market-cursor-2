class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleApiError = (error: unknown): never => {
  if (error instanceof ApiError) {
    throw error
  }
  if (error instanceof Error) {
    throw new ApiError(500, error.message)
  }
  throw new ApiError(500, 'An unexpected error occurred')
}

export const api = {
  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new ApiError(
          response.status,
          `HTTP error! status: ${response.status}`
        )
      }
      return response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  async post<T>(url: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new ApiError(
          response.status,
          `HTTP error! status: ${response.status}`
        )
      }
      return response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  async put<T>(url: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new ApiError(
          response.status,
          `HTTP error! status: ${response.status}`
        )
      }
      return response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new ApiError(
          response.status,
          `HTTP error! status: ${response.status}`
        )
      }
      return response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },
}
