import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/admin-auth';
import { AdminLogin } from '@/components/admin/admin-login';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  // Already signed in → go straight to the dashboard.
  if (await isAdminAuthed()) {
    redirect('/admin');
  }
  return <AdminLogin />;
}
