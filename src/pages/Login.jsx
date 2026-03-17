import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { supabase } from "../lib/supabaseClient"

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error(error.message)
  }

  return data
}

export default function Login() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleGoogleLogin = async () => {
    if (!agreed) return alert("Please agree to the Terms & Conditions before logging in.");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err) {
      alert('Login failed. Please try again.');
    }
  };

  const handleAuthNavigation = (e, path) => {
    if (!agreed) {
      e.preventDefault();
      return alert("Please agree to the Terms & Conditions before continuing.");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Your mental wellness journey starts here."
    >
      <div className="space-y-4">
        <motion.button
          whileHover={agreed ? { scale: 1.02, y: -2 } : {}}
          whileTap={agreed ? { scale: 0.98 } : {}}
          onClick={handleGoogleLogin}
          className={`
            w-full flex items-center justify-center gap-3
            border font-semibold py-3.5 rounded-xl
            transition-all duration-300
            ${agreed
              ? 'bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-dark-card-hover border-slate-200 dark:border-dark-border/50 hover:border-soft-purple/40 dark:hover:border-dark-accent/40 text-slate-700 dark:text-dark-text shadow-sm hover:shadow-md cursor-pointer'
              : 'bg-slate-100 dark:bg-dark-card-hover border-slate-200 dark:border-dark-border opacity-60 text-slate-400 cursor-not-allowed'}
          `}
        >
          {/* Google icon SVG */}
          <svg className={`w-5 h-5 ${!agreed && 'grayscale opacity-50'}`} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </motion.button>

        <Link to="/login/email" className="block w-full" onClick={(e) => handleAuthNavigation(e, '/login/email')}>
          <motion.button
            whileHover={agreed ? { scale: 1.02, y: -2 } : {}}
            whileTap={agreed ? { scale: 0.98 } : {}}
            className={`
              w-full flex items-center justify-center gap-3
              border font-semibold py-3.5 rounded-xl
              transition-all duration-300
              ${agreed
                ? 'bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-dark-card-hover border-slate-200 dark:border-dark-border/50 hover:border-soft-purple/40 dark:hover:border-dark-accent/40 text-slate-700 dark:text-dark-text shadow-sm hover:shadow-md cursor-pointer'
                : 'bg-slate-100 dark:bg-dark-card-hover border-slate-200 dark:border-dark-border opacity-60 text-slate-400 cursor-not-allowed'}
            `}
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Continue with Email
          </motion.button>
        </Link>
      </div>

      <div className="flex items-start gap-2 pt-6">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-soft-purple focus:ring-soft-purple"
        />
        <label htmlFor="terms" className="text-sm text-slate-600 dark:text-dark-muted">
          I agree to the <Link to="/terms" className="text-soft-purple font-medium hover:underline">Terms & Conditions</Link>
        </label>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-dark-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="text-soft-purple font-semibold hover:underline">Sign Up</Link>
      </p>
    </AuthLayout>
  );
}