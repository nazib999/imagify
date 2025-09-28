import React from 'react'
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="auth-card">
      <SignIn
        appearance={{}}
        // Optionally control redirects; adjust as needed for your app
        // afterSignInUrl="/"
        // signUpUrl="/sign-up"
      />
    </div>
  )
}
