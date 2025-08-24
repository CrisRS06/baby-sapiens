import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="app-scrollable-content flex items-center justify-center gradient-bg-neutral dark:bg-gradient-to-br dark:from-neutral-900 dark:via-stone-900 dark:to-slate-900 adaptive-compact">
      <div className="w-full max-w-md responsive-spacing safe-area-bottom component-isolated">
        <SignUp 
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          afterSignUpUrl="/chat"
        />
      </div>
    </div>
  )
}