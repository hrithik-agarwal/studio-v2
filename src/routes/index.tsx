import FullPageLoader from '@/components/FullPageLoader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
   <FullPageLoader />
  )
}