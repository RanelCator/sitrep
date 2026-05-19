// src/shared/lib/api-interceptor.ts

import { api } from "@/shared/lib/api"

let interceptorRegistered = false

export function setupAxiosInterceptors() {
  if (interceptorRegistered) return

  interceptorRegistered = true

  api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  )
}