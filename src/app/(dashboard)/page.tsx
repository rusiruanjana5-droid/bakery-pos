import { getSession } from '@/lib/session';
import EnhancedDashboard from '@/components/EnhancedDashboard';

export default async function Home() {
  const session = await getSession();

  // Serialize session to plain object to avoid Next.js serialization errors
  const plainSession = session ? {
    userId: session.userId,
    username: session.username,
    role: session.role,
    isLoggedIn: session.isLoggedIn
  } : null;

  return <EnhancedDashboard session={plainSession} />;
}
