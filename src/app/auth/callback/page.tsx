"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/footer/Footer";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard"); // redireciona para dashboard após confirmação
      } else if (error) {
        router.push("/login");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              Verifying authentication...
            </h2>
            <p className="text-gray-600">Please wait</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
