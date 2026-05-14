import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { loginSchema } from "@/features/auth/schema/login.schema"

import { alertError, alertSuccess } from "@/shared/lib/alert"
import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"

type FieldErrorItem = {
  message?: string
}

function FieldErrors({ errors }: { errors?: FieldErrorItem[] }) {
  if (!errors?.length) return null

  const messages = errors
    .map((error) => error.message)
    .filter(Boolean)
    .join(", ")

  if (!messages) return null

  return <p className="text-sm text-destructive">{messages}</p>
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      if (submitting) return

      setSubmitting(true)

      try {
        const result = await login(value.username, value.password)

        if (!result.success || !result.data?.user) {
          await alertError({
            title: "Login Failed",
            text: result.message ?? "Invalid credentials.",
          })
          return
        }

        await alertSuccess({
          title: "Login Successful!",
          showConfirmButton: false,
          timer: 1200,
        })

        await navigate({
          to: "/",
          replace: true,
        })
      } catch (error) {
        console.error("Login error:", error)

        await alertError({
          title: "Login Error",
          text: "Something went wrong. Please try again.",
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await form.handleSubmit()
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleLogin}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to SITREP</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        <form.Field name="username">
          {(field) => (
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Username"
                autoComplete="username"
              />
              <FieldErrors
                errors={field.state.meta.errors as FieldErrorItem[]}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
              <FieldErrors
                errors={field.state.meta.errors as FieldErrorItem[]}
              />
            </Field>
          )}
        </form.Field>

        <Field>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}