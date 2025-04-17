import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignInPage() {
  return (
    <AuthLayout title="Sign in to NoteAssist" description="Enter your email below to sign in to your account">
      <SignInForm />
    </AuthLayout>
  )
}
