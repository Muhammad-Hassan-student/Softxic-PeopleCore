import { ReactNode } from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col ">
      <header className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href={"/"}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Home />
            <span>𝙎𝙤𝙛𝙩𝙭𝙞𝙘 𝒫𝑒𝑜𝓅𝓁𝑒𝒞𝑜𝓇𝑒</span>
          </Link>
        </div>
      </header>

      {/* Main Component */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-4  px-6 text-center text-gray-600 text-sm">
        <p>© 2026 𝙎𝙤𝙛𝙩𝙭𝙞𝙘 𝒫𝑒𝑜𝓅𝓁𝑒𝒞𝑜𝓇𝑒 SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
