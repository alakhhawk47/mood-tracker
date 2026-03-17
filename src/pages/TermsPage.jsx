import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-wellness-gradient dark:bg-dark-wellness-gradient flex items-center justify-center p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 dark:bg-dark-card/70 backdrop-blur-2xl border border-white/50 dark:border-dark-border/50 rounded-3xl shadow-glass-lg p-8 max-w-2xl w-full max-h-[85vh] flex flex-col"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-dark-text">Terms & Conditions</h1>
          <p className="text-sm text-slate-500 dark:text-dark-muted mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-sm text-slate-600 dark:text-dark-muted custom-scrollbar">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-200 mb-2">1. Introduction</h2>
            <p>Welcome to EmoGraph. By accessing or using our application, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you may not use our service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-200 mb-2">2. User Responsibilities</h2>
            <p>You must be at least 13 years old to use EmoGraph. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide accurate and complete registration information.</li>
              <li>Do not use the service for any illegal or unauthorized purpose.</li>
              <li>Do not violate any laws in your jurisdiction while using the app.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-200 mb-2">3. Platform Usage Rules</h2>
            <p>EmoGraph is a wellness companion app and is not a substitute for professional mental health advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-200 mb-2">4. Privacy Policy</h2>
            <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and share your personal information. By using EmoGraph, you consent to our data practices as described in the Privacy Policy.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-dark-border/50 text-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-deep-purple hover:bg-soft-purple text-white font-semibold py-3 px-8 rounded-full shadow-md transition-colors"
            >
              Back to Login
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
