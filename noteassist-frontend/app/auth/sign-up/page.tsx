import { SignUpForm } from "@/components/auth/sign-up-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignUpPage() {
  return (
    <AuthLayout title="Create an account" description="Enter your details below to create your account">
      <SignUpForm />
    </AuthLayout>
  )
}
