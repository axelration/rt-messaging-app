import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  // If token exists, redirect to chat page, otherwise to login page
  if (token && token.value !== "") {
    redirect('/chat');
  } else {
    redirect('/login');
  }
}
