import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black p-4">

      {/* Aurora Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-black opacity-80"></div>

      {/* Floating blurred orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse delay-300"></div>

      {/* Main Card */}
      <div className="relative max-w-md w-full bg-white/10 backdrop-blur-2xl 
                      rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.4)]
                      p-10 animate-fadeInUp">
        
        <h1 className="text-4xl font-extrabold text-center text-white drop-shadow mb-4">
          Welcome Back
        </h1>

        <p className="text-center text-gray-300 mb-10">
          Sign in to continue your shopping journey
        </p>

        {/* Clerk UI */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                card: "bg-transparent shadow-none",
                formButtonPrimary:
                  "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all",
                formFieldInput:
                  "bg-white/20 text-white placeholder-gray-300 border-white/30 focus:border-indigo-400 focus:ring-0 rounded-xl",
                dividerLine: "bg-white/20",
                dividerText: "text-gray-300",
              },
            }}
          />
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease forwards;
        }
      `}</style>
    </div>
  );
}
