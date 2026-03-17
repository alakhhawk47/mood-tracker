import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { supabase } from '../lib/supabaseClient';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return alert("Please agree to the Terms & Conditions.");
    
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: formData.email,
      options: {
        emailRedirectTo: window.location.origin + '/dashboard',
        data: {
          full_name: formData.fullName
        }
      }
    });
    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setLinkSent(true);
    }
  };

  const handleResendLink = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: formData.email,
      options: {
        emailRedirectTo: window.location.origin + '/dashboard',
        data: {
          full_name: formData.fullName
        }
      }
    });
    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("A new secure login link has been sent to your email.");
    }
  };

  return (
    <AuthLayout 
      title={linkSent ? "Check Your Email" : "Create Account"} 
      subtitle={linkSent ? "A secure login link is on its way." : "Join EmoGraph and start your mental wellness journey today."}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          {!linkSent ? (
            <motion.form 
              key="signup-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-dark-card/50 border border-slate-200 dark:border-dark-border/50 focus:border-soft-purple focus:ring-2 focus:ring-soft-purple/20 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-dark-card/50 border border-slate-200 dark:border-dark-border/50 focus:border-soft-purple focus:ring-2 focus:ring-soft-purple/20 transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!agreed || isLoading}
                className={`w-full py-3.5 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                  agreed && !isLoading
                    ? 'bg-gradient-to-r from-soft-purple to-pastel-blue text-white hover:shadow-lg' 
                    : 'bg-slate-300 dark:bg-dark-border text-slate-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Creating Account...' : 'Continue'}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 py-4"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-soft-purple/10 dark:bg-soft-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-soft-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-dark-text">Check your inbox</h3>
                <p className="text-slate-600 dark:text-dark-muted">
                  We've sent a secure login link to <span className="font-semibold text-slate-800 dark:text-dark-text">{formData.email}</span>. Please check your email and spam folder.
                </p>
              </div>

              <div className="pt-6 flex flex-col gap-3">
                <button 
                  onClick={handleResendLink}
                  disabled={isLoading}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-dark-card-hover dark:hover:bg-dark-border text-slate-700 dark:text-dark-text font-semibold py-3.5 rounded-xl shadow-sm transition-all duration-300 disabled:opacity-70"
                >
                  {isLoading ? 'Sending...' : 'Resend Login Link'}
                </button>
                <button 
                  onClick={() => setLinkSent(false)}
                  className="w-full text-center text-sm font-medium text-slate-500 hover:text-soft-purple transition-colors py-2"
                >
                  Use a different email
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-dark-muted">
        Already have an account?{' '}
        <Link to="/" className="text-soft-purple font-semibold hover:underline">Sign In</Link>
      </p>
    </AuthLayout>
  );
}
