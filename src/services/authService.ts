import apiClient from './apiClient'
import type { LoginRequest, LoginResponse } from '../types/auth.types'

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data)
    return response.data
  },
}