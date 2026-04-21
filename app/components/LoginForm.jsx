export default function LoginForm() {
  let email = $state("")
  let password = $state("")
  let status = $state("")

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      status = "Please enter credentials"
      return
    }
    status = "Authenticating..."
    setTimeout(() => {
      status = "Login successful!"
      console.log({ email: email, password: password })
    }, 1000)
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div class="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
        {/* Animated Background Glow */}
        <div class="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
        <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full group-hover:bg-purple-500/30 transition-colors duration-500"></div>

        <div class="relative z-10">
          <div class="text-center mb-10">
            <h1 class="text-4xl font-black bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p class="text-slate-400 text-sm">Enter your details to access your account</p>
          </div>

          <form onsubmit={handleLogin} class="space-y-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                oninput={(e) => email = e.target.value}
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                oninput={(e) => password = e.target.value}
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
              />
            </div>

            <div class="flex items-center justify-between text-xs">
              <label class="flex items-center text-slate-400 cursor-pointer">
                <input type="checkbox" class="mr-2 rounded-sm border-white/10 bg-slate-950 accent-indigo-500" />
                Remember me
              </label>
              <a href="#" class="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
            </div>

            <button type="submit" class="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200">
              Sign In
            </button>
          </form>

          <div class="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <a href="#" class="text-white hover:underline">Sign up</a>
          </div>

          {status && (
            <div class="mt-6 text-center text-sm font-medium text-slate-500 bg-slate-50 py-3 rounded-lg border border-slate-100">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
