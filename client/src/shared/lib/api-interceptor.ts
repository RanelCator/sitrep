// src/shared/lib/api-interceptor.ts
import type { AxiosError, InternalAxiosRequestConfig } from "axios"

import { router } from "@/router"
import { authStore } from "@/features/auth/services/auth-store"
import { api, publicApi } from "@/shared/lib/api"

let interceptorRegistered = false
let isRefreshing = false
let refreshQueue: Array<() => void> = []

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

function processQueue() {
  refreshQueue.forEach((callback) => callback())
  refreshQueue = []
}

function isAuthRoute(url = "") {
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout")
  )
}

export function setupAxiosInterceptors() {
  if (interceptorRegistered) return
  interceptorRegistered = true

  api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const status = error.response?.status
      const originalRequest = error.config as RetryRequestConfig | undefined

      if (!originalRequest) {
        return Promise.reject(error)
      }

      if (status !== 401 || isAuthRoute(originalRequest.url)) {
        return Promise.reject(error)
      }

      if (originalRequest._retry) {
        authStore.clear()

        await router.navigate({
          to: "/login",
          replace: true,
        })

        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push(() => resolve(api(originalRequest)))
        })
      }

      isRefreshing = true

      try {
        const refreshResponse = await publicApi.post("/auth/refresh")

        if (refreshResponse.data?.success) {
          processQueue()
          return api(originalRequest)
        }

        throw new Error("Refresh failed")
      } catch (refreshError) {
        processQueue()
        authStore.clear()

        await router.navigate({
          to: "/login",
          replace: true,
        })

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    },
  )
}