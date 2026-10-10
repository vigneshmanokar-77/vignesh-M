import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Mail, 
  UserCheck, 
  BadgeCheck, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
  X
} from 'lucide-react';

interface UserAccount {
  name: string;
  username: string;
  email: string;
  role: string;
  passwordHash?: string;
}

interface LoginViewProps {
  onLoginSuccess: (user: { name: string; role: string }) => void;
}

const DEFAULT_USERS: UserAccount[] = [
  {
    name: 'Deepika',
    username: 'deepika',
    email: 'deepika@soc.defense.net',
    role: 'Lead Security Analyst',
    passwordHash: 'secretIDS2026'
  },
  {
    name: 'Vignesh Manokaran',
    username: 'vignesh',
    email: 'vigneshmanokaran12@gmail.com',
    role: 'Network Administrator',
    passwordHash: 'admin2026'
  }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  // Mode: 'login' | 'signup'
  const [activeMode, setActiveMode] = useState<'login' | 'signup'>('login');

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('Deepika');
  const [loginPassword, setLoginPassword] = useState('••••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign Up Form States
  const [signupFullName, setSignupFullName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState('Lead Security Analyst');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupError, setSignupError] = useState('');
  const [signupSuccessMsg, setSignupSuccessMsg] = useState('');

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Registered Accounts (persisted in localStorage)
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem('ids_registered_users');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_USERS;
  });

  // Calculate password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: 'None', score: 0, color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { label: 'Weak', score, color: 'bg-red-500' };
    if (score <= 4) return { label: 'Medium', score, color: 'bg-amber-500' };
    return { label: 'Strong', score, color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(signupPassword);

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername.trim()) {
      setLoginError('Please enter your username or email.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const cleanUser = loginUsername.trim().toLowerCase();

      // Find user in registered list
      const matched = registeredUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanUser ||
          u.email.toLowerCase() === cleanUser ||
          u.name.toLowerCase() === cleanUser
      );

      if (matched) {
        onLoginSuccess({ name: matched.name, role: matched.role });
      } else {
        // Allow login with entered name for flexibility
        onLoginSuccess({ name: loginUsername.trim(), role: 'Security Analyst' });
      }
    }, 400);
  };

  // Handle Sign Up Submit
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccessMsg('');

    if (!signupFullName.trim()) {
      setSignupError('Full Name is required.');
      return;
    }
    if (!signupUsername.trim()) {
      setSignupError('Username is required.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setSignupError('Please provide a valid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setSignupError('Please agree to security operations policy.');
      return;
    }

    // Check if username/email already exists
    const cleanUser = signupUsername.trim().toLowerCase();
    const cleanEmail = signupEmail.trim().toLowerCase();
    const exists = registeredUsers.some(
      (u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      setSignupError('An account with this username or email already exists.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newUser: UserAccount = {
        name: signupFullName.trim(),
        username: signupUsername.trim(),
        email: signupEmail.trim(),
        role: signupRole,
        passwordHash: signupPassword
      };

      const updated = [newUser, ...registeredUsers];
      setRegisteredUsers(updated);
      try {
        localStorage.setItem('ids_registered_users', JSON.stringify(updated));
      } catch {
        // ignore storage error
      }

      setSignupSuccessMsg('Account created successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess({ name: newUser.name, role: newUser.role });
      }, 700);
    }, 500);
  };

  // Quick Demo Login Handler
  const handleQuickDemo = (user: UserAccount) => {
    setLoginUsername(user.name);
    setLoginPassword(user.passwordHash || 'password123');
    onLoginSuccess({ name: user.name, role: user.role });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-4 sm:p-6 md:p-10 select-none">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-200">
        
        {/* Left Side: Brand Shield Graphic (Matches Screenshot 1. Login Page) */}
        <div className="bg-[#0B1528] relative p-8 md:p-12 flex flex-col items-center justify-center text-center text-white overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -top-10 -left-10" />
          <div className="absolute w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />

          {/* Central Shield Graphic with Lock */}
          <div className="relative mb-8 z-10">
            <div className="w-32 h-36 rounded-3xl bg-linear-to-b from-blue-500/20 via-blue-600/10 to-transparent border-2 border-blue-400/50 shadow-2xl shadow-blue-500/30 flex items-center justify-center p-3">
              <div className="w-full h-full rounded-2xl bg-[#0F224A] border border-blue-400/40 flex flex-col items-center justify-center">
                <div className="p-3 bg-blue-500/20 rounded-full mb-2">
                  <Lock className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Brand Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 z-10">
            AI Driven <br />
            <span className="text-blue-400">Intrusion Detection System</span>
          </h1>

          {/* Subtitle / Tagline */}
          <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide z-10">
            Secure Networks &nbsp;|&nbsp; Detect Threats &nbsp;|&nbsp; Ensure Safety
          </p>

          <div className="mt-8 pt-6 border-t border-slate-800/80 w-full flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Real-Time ML Engine
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              CICIDS2017 Trained
            </span>
          </div>

          {/* Live System Indicator */}
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-slate-900/80 rounded-full border border-slate-700/60 text-[10px] text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>IDS Engine: 24/7 Active Protection</span>
          </div>
        </div>

        {/* Right Side: Form Card (Dual Login / Sign Up Tabs) */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white overflow-y-auto max-h-[85vh]">
          <div>
            {/* Top Switcher Tabs: Sign In / Sign Up */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('login');
                  setLoginError('');
                  setSignupError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'login'
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In (Login)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode('signup');
                  setLoginError('');
                  setSignupError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'signup'
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>Sign Up (Register)</span>
              </button>
            </div>

            {/* Header Titles */}
            {activeMode === 'login' ? (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Login
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Welcome back! Please login to your security console.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Create Account
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Register a security analyst profile to begin monitoring traffic.
                </p>
              </div>
            )}

            {/* Error / Success Notifications */}
            {loginError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {signupError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            {signupSuccessMsg && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{signupSuccessMsg}</span>
              </div>
            )}

            {/* ================= MODE 1: LOGIN ================= */}
            {activeMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Username or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Enter username or email"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember credentials</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotSuccess(false);
                      setForgotEmail('');
                    }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer mt-2"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Login'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4 ml-1" />}
                </button>
              </form>
            )}

            {/* ================= MODE 2: SIGN UP ================= */}
            {activeMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                {/* Full Name & Username in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        placeholder="e.g. Deepika"
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      placeholder="e.g. deepika_soc"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="analyst@soc.defense.net"
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Security Role */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Security Role / Designation
                  </label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Lead Security Analyst">Lead Security Analyst</option>
                    <option value="Network Administrator">Network Administrator</option>
                    <option value="SOC Incident Responder">SOC Incident Responder</option>
                    <option value="Threat Intelligence Specialist">Threat Intelligence Specialist</option>
                  </select>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Password Strength Meter */}
                {signupPassword && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Password Strength:</span>
                      <span className="font-semibold text-slate-700">{pwdStrength.label}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${pwdStrength.color} transition-all duration-300`}
                        style={{ width: `${(pwdStrength.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2 text-[11px] text-slate-600 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="cursor-pointer">
                    I agree to adhere to strict network telemetry compliance & authorization.
                  </label>
                </div>

                {/* Submit Sign Up Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer mt-2"
                >
                  <span>{isSubmitting ? 'Creating Profile...' : 'Create Account & Enter Console'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4 ml-1" />}
                </button>
              </form>
            )}

            {/* Toggle bottom link */}
            <div className="mt-5 text-center text-xs text-slate-600">
              {activeMode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode('signup');
                      setLoginError('');
                      setSignupError('');
                    }}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Register here
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode('login');
                      setLoginError('');
                      setSignupError('');
                    }}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Quick Demo Pre-filled Logins Section */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick One-Click Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo(DEFAULT_USERS[0])}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                title="Log in directly as Deepika (Lead Security Analyst)"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="truncate">Login: <strong>Deepika</strong></span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(DEFAULT_USERS[1])}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                title="Log in directly as Vignesh (Network Administrator)"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span className="truncate">Login: <strong>Vignesh</strong></span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Reset Credentials</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    A secure password reset link has been dispatched to{' '}
                    <strong>{forgotEmail || 'your email'}</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail) setForgotSuccess(true);
                }}
                className="space-y-3"
              >
                <p className="text-xs text-slate-500">
                  Enter your registered work email to receive verification reset instructions.
                </p>
                <div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="deepika@soc.defense.net"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
