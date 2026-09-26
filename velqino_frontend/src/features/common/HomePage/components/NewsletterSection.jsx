"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Shield, 
  ArrowRight,
  Store,
  Tag,
  Clock,
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin 
} from '../../../../utils/icons';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('Retail Store');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const roles = ['Retail Store', 'Online Boutique', 'Wholesale Buyer'];

  const socialLinks = [
    { name: 'Instagram', icon: <Instagram size={15} />, url: 'https://instagram.com', label: '24k Retailers' },
    { name: 'Facebook', icon: <Facebook size={15} />, url: 'https://facebook.com', label: 'Community' },
    { name: 'Linkedin', icon: <Linkedin size={15} />, url: 'https://linkedin.com', label: 'B2B Network' },
    { name: 'Twitter', icon: <Twitter size={15} />, url: 'https://twitter.com', label: 'Alerts' },
  ];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your business email');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail('');
    
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <section ref={sectionRef} className="newsletter-section py-8 sm:py-10 lg:py-12 bg-primary-100/50 border-y border-primary-200/80">
      <div className="container">
        
        {/* Asymmetric Modern VIP Wholesale Club Showcase - Vibrant Warm Terracotta */}
        <div className="bg-gradient-to-br from-primary-500 via-primary-500 to-primary-600 rounded-3xl border-2 border-primary-300/90 p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
          
          {/* Subtle Decorative Ambient Lighting */}
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Editorial Value Proposition (7 Columns on Desktop) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* VIP Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-xs w-fit mb-3">
                <Sparkles size={12} className="text-accent-300" />
                <span>VELQINO VIP WHOLESALE PASS</span>
              </div>

              {/* Bold Magazine-Style Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-2.5">
                Unlock Direct Factory Drops &{' '}
                <span className="text-accent-200">
                  Instant 10% First-Order Credit
                </span>
              </h2>

              {/* Descriptive Subtitle */}
              <p className="text-xs sm:text-sm text-primary-100 max-w-xl leading-relaxed mb-6 font-medium">
                Join 4,800+ retail store owners and boutique buyers across India. Get instant WhatsApp & email alerts on fresh denim lots, high-margin liquidations, and seasonal collections before public release.
              </p>

              {/* High-Value Commercial Privileges (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Tag size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">10% Welcome Credit</h4>
                    <p className="text-[11px] text-primary-100 leading-snug">Applied instantly to your first bulk wholesale order</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Store size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Pre-Release Access</h4>
                    <p className="text-[11px] text-primary-100 leading-snug">48hr early claim window on trending baggy & sherpa lots</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Clock size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Flash Liquidation Alerts</h4>
                    <p className="text-[11px] text-primary-100 leading-snug">Hourly notifications for factory clearance steals</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Shield size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Commercial Privacy</h4>
                    <p className="text-[11px] text-primary-100 leading-snug">Zero spam. Unsubscribe in 1-click at any time</p>
                  </div>
                </div>

              </div>

              {/* Social Proof & Community Follow */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-white/90 mr-1">Join Our Buyer Community:</span>
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors text-xs font-semibold backdrop-blur-xs"
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>

            </div>

            {/* Right Column: Elevated VIP Pass Card (5 Columns on Desktop) */}
            <div className="lg:col-span-5">
              
              <div className="bg-white rounded-2xl border-2 border-white/90 p-6 sm:p-7 shadow-xl text-gray-900">
                
                {/* Live Drop Pill */}
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[11px] font-bold text-gray-800">Next Factory Lot Drop</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                    Tomorrow, 10 AM
                  </span>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Activate Your Wholesale Pass
                </h3>
                <p className="text-xs text-gray-500 mb-4 font-normal">
                  Select your store profile to receive tailored catalog pricing:
                </p>

                {/* Business Role Selector */}
                <div className="flex items-center gap-1.5 mb-4">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                        selectedRole === role
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your business email"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-gray-900 placeholder-gray-400 shadow-2xs font-medium"
                      disabled={isSubmitting}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-1.5 text-red-600 text-xs text-left">
                      <AlertCircle size={13} />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gray-950 hover:bg-black active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Pass...</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle size={16} />
                        <span>10% Pass Activated!</span>
                      </>
                    ) : (
                      <>
                        <span>Claim Wholesale Pass</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>

                {/* Privacy Guarantee */}
                <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-gray-400">
                  <Shield size={12} className="text-gray-400" />
                  <span>Verified B2B Encrypted Gateway. No spam.</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
