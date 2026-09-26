"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  ChevronRight, 
  Apple, 
  Smartphone, 
  Mail, 
  Phone, 
  MapPin,
  Truck,
  Shield,
  Store,
  ArrowUp,
  Lock,
  CheckCircle,
  Sparkles
} from '../../../../utils/icons';
import '../../../../styles/common/HomePage/Footer.scss';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const trustPrivileges = [
    {
      icon: <Truck size={18} />,
      title: 'Pan-India B2B Logistics',
      desc: 'Express dispatch across 19,000+ PIN codes',
    },
    {
      icon: <Shield size={18} />,
      title: 'Escrow Trade Guarantee',
      desc: '100% protected payments until delivery verification',
    },
    {
      icon: <Store size={18} />,
      title: 'Direct Factory Drops',
      desc: 'Authentic mill pricing with zero middleman markups',
    },
    {
      icon: <Phone size={18} />,
      title: '24/7 Dedicated Concierge',
      desc: 'Priority assistance for volume wholesale buyers',
    },
  ];

  const wholesaleHubLinks = [
    { name: 'About VELTRIX', href: '/about' },
    { name: 'Direct Factory Drops', href: '/products' },
    { name: 'Denim & Apparel Lots', href: '/category/denim' },
    { name: 'Volume Tiers & MOQ', href: '/wholesale-pricing' },
    { name: 'Verified Mill Network', href: '/brands' },
    { name: 'Onboard as Supplier', href: '/wholesaler/register' },
  ];

  const retailerSolutionsLinks = [
    { name: 'Retailer Portal', href: '/retailer/dashboard' },
    { name: 'Track Bulk Shipments', href: '/track-order' },
    { name: 'GST Tax Invoices', href: '/invoices' },
    { name: 'Working Capital Credit', href: '/credit' },
    { name: 'Sample Swatch Requests', href: '/samples' },
    { name: 'Buyer Protection Policy', href: '/returns' },
  ];

  const helpTrustLinks = [
    { name: 'Help & Knowledge Center', href: '/help' },
    { name: 'Escrow Security Guide', href: '/security' },
    { name: 'Logistics & Warehousing', href: '/shipping' },
    { name: 'Quality Inspection SLA', href: '/quality' },
    { name: 'Grievance Redressal', href: '/grievance' },
    { name: 'Frequently Asked Questions', href: '/faq' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook size={16} />, href: 'https://facebook.com' },
    { name: 'Instagram', icon: <Instagram size={16} />, href: 'https://instagram.com' },
    { name: 'Twitter', icon: <Twitter size={16} />, href: 'https://twitter.com' },
    { name: 'Youtube', icon: <Youtube size={16} />, href: 'https://youtube.com' },
    { name: 'Linkedin', icon: <Linkedin size={16} />, href: 'https://linkedin.com' },
  ];

  return (
    <footer ref={sectionRef} className="footer-section">
      <div className="footer-ambient-overlay" />

      <div className="footer-container">
        
        {/* Top Section - B2B Trust Privileges Bar */}
        <div className="footer-trust-bar">
          <div className="container">
            <div className="footer-trust-grid">
              {trustPrivileges.map((item, idx) => (
                <div key={idx} className="footer-trust-item">
                  <div className="footer-trust-icon-box">
                    {item.icon}
                  </div>
                  <div className="footer-trust-text-group">
                    <span className="footer-trust-title">{item.title}</span>
                    <span className="footer-trust-desc">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container footer-main-wrap">
          <div className="footer-grid">
            
            {/* Column 1: Brand & Mission */}
            <div className="footer-col">
              <div className="footer-brand-header">
                <Link href="/" className="footer-logo">
                  VELTRIX<span className="footer-logo-dot">.</span>
                </Link>
              </div>

              <div className="footer-badge">
                <span className="footer-badge-dot" />
                <span>Direct-From-Mill Wholesale</span>
              </div>

              <p className="footer-description">
                India's premier digital textile & denim trading platform. Connecting verified manufacturing mills with 4,800+ independent retail store owners and boutique buyers across the country.
              </p>

              {/* Direct Contact Links */}
              <div className="footer-contact-list">
                <a href="mailto:support@veltrix.com" className="footer-contact-link">
                  <Mail size={14} className="footer-contact-mini-icon" />
                  <span>support@veltrix.com</span>
                </a>
                <a href="tel:+9118001234567" className="footer-contact-link">
                  <Phone size={14} className="footer-contact-mini-icon" />
                  <span>+91 1800 123 4567 (Mon-Sat, 9AM-8PM)</span>
                </a>
                <div className="footer-contact-link">
                  <MapPin size={14} className="footer-contact-mini-icon" />
                  <span>Hyderabad & Surat Fulfillment Hubs</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="footer-social-wrap">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer-social-link" 
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Wholesale Hub */}
            <div className="footer-col">
              <h3 className="footer-title">Wholesale Hub</h3>
              <ul className="footer-links">
                {wholesaleHubLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">
                      <ChevronRight size={13} />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Retailer Solutions */}
            <div className="footer-col">
              <h3 className="footer-title">Retailer Portal</h3>
              <ul className="footer-links">
                {retailerSolutionsLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">
                      <ChevronRight size={13} />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Help & Assurance */}
            <div className="footer-col">
              <h3 className="footer-title">Help & Trust</h3>
              <ul className="footer-links">
                {helpTrustLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">
                      <ChevronRight size={13} />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Enterprise Apps & Compliance */}
            <div className="footer-col">
              <h3 className="footer-title">VELTRIX Mobile</h3>
              <p className="footer-app-text">
                Manage live factory bids, claim limited lots, and track freight shipments in real time.
              </p>

              <div className="footer-app-buttons">
                <a href="#" className="footer-app-btn">
                  <Apple size={22} className="text-white" />
                  <div>
                    <span>Download on the</span>
                    <strong>App Store</strong>
                  </div>
                </a>
                <a href="#" className="footer-app-btn">
                  <Smartphone size={22} className="text-white" />
                  <div>
                    <span>Get it on</span>
                    <strong>Google Play</strong>
                  </div>
                </a>
              </div>

              {/* B2B Security & Standards Seals */}
              <div className="footer-compliance-box">
                <div className="footer-compliance-item">
                  <Lock size={13} />
                  <span>256-Bit SSL Encrypted Escrow</span>
                </div>
                <div className="footer-compliance-item">
                  <CheckCircle size={13} />
                  <span>GST Registered & Compliant</span>
                </div>
                <div className="footer-compliance-item">
                  <Sparkles size={13} />
                  <span>Verified Direct Mill Inspection SLA</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                © {new Date().getFullYear()} VELTRIX Wholesale Technologies Pvt Ltd. All rights reserved.
              </p>

              <div className="footer-bottom-links">
                <Link href="/terms">Terms of Trade</Link>
                <span className="footer-bottom-divider">|</span>
                <Link href="/privacy">Privacy Policy</Link>
                <span className="footer-bottom-divider">|</span>
                <Link href="/escrow-policy">Escrow Guarantee</Link>
                <span className="footer-bottom-divider">|</span>
                <Link href="/anti-counterfeit">Anti-Counterfeit</Link>
                <span className="footer-bottom-divider">|</span>
                <Link href="/sitemap">Sitemap</Link>
              </div>

              <button 
                type="button" 
                onClick={scrollToTop} 
                className="footer-back-to-top"
                aria-label="Scroll back to top"
              >
                <span>Back to top</span>
                <ArrowUp size={12} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
