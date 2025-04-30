import { LoginForm } from "@/components/kokonutui/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-amber-100 dark:border-gray-700 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
