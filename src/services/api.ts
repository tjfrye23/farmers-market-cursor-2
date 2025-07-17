class ApiError extends Error {
  data: unknown

  constructor(
    public status: number,
    message: string,
    data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    this.data = data
  }
}

export const handleApiError = (error: unknown): never => {
  let apiError: ApiError
  if (error instanceof ApiError) {
    apiError = error
  }
  if (error instanceof Error) {
    apiError = new ApiError(500, error.message)
  }
  apiError = new ApiError(500, 'An unexpected error occurred', error)
  console.error(apiError)

  throw apiError
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
