import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="app-scrollable-content flex items-center justify-center gradient-bg-neutral dark:bg-gradient-to-br dark:from-neutral-900 dark:via-stone-900 dark:to-slate-900 adaptive-compact">
      <div className="w-full max-w-md responsive-spacing safe-area-bottom component-isolated">
        <SignIn 
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/chat"
        />
      </div>
    </div>
  )
}