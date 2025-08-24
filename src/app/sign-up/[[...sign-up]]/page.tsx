import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="h-screen-safe flex items-center justify-center gradient-bg-neutral dark:bg-gradient-to-br dark:from-neutral-900 dark:via-stone-900 dark:to-slate-900 mobile-compact mobile-scroll-container">
      <div className="w-full max-w-md px-4 mobile-safe-bottom">
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