import Link from 'next/link'

export default function page () {
  
    return <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-lg">Welcome to your dashboard!</p>
          <Link href={'/api/auth/signout'} className="text-blue-500 hover:underline">
            Sign Out
          </Link>
        </main>
       
        </div>

  } 