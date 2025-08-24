import { redirect } from 'next/navigation'

export default function Dashboard() {
  // Redirect to chat page since that's our main interface
  redirect('/chat')
}