import React from 'react'
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="auth-card">
      <SignUp
        appearance={{}}
        // Optionally control redirects; adjust as needed for your app
        // afterSignUpUrl="/"
        // signInUrl="/sign-in"
      />
    </div>
  )
}
