import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-neutral dark:bg-gradient-to-br dark:from-neutral-900 dark:via-stone-900 dark:to-slate-900">
      <SignIn 
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/chat"
      />
    </div>
  )
}