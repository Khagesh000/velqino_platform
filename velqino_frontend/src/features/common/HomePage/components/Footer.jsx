"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, ChevronRight, Apple, Smartphone, Mail, Phone, MapPin } from '../../../../utils/icons';
import '../../../../styles/common/HomePage/Footer.scss'

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

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ];

  const customerService = [
    { name: 'Returns Policy', href: '/returns' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Help Center', href: '/help' },
    { name: 'Size Guide', href: '/size-guide' },
  ];

  const myAccount = [
    { name: 'My Account', href: '/account' },
    { name: 'My Orders', href: '/orders' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Wallet', href: '/wallet' },
    { name: 'Settings', href: '/settings' },
  ];

  const socialIcons = [
    { name: 'Facebook', icon: <Facebook size={18} />, href: 'https://facebook.com' },
    { name: 'Instagram', icon: <Instagram size={18} />, href: 'https://instagram.com' },
    { name: 'Twitter', icon: <Twitter size={18} />, href: 'https://twitter.com' },
    { name: 'Youtube', icon: <Youtube size={18} />, href: 'https://youtube.com' },
    { name: 'Linkedin', icon: <Linkedin size={18} />, href: 'https://linkedin.com' },
  ];

  const contactInfo = [
    { icon: <Mail size={14} />, text: 'support@veltrix.com' },
    { icon: <Phone size={14} />, text: '+91 1800 123 4567' },
    { icon: <MapPin size={14} />, text: 'Hyderabad, India' },
  ];

  return (
    <footer ref={sectionRef} className="footer-section">
      <div className="footer-container">
        {/* Top Section - Contact Bar */}
        <div className="footer-contact-bar">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="footer-contact-grid">
              {contactInfo.map((info, idx) => (
                <div key={idx} className={`footer-contact-item fade-in-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <span className="footer-contact-icon">{info.icon}</span>
                  <span>{info.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="footer-grid">
            
            {/* Column 1: Brand */}
            <div className={`footer-col fade-in-up ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0s' }}>
              <Link href="/" className="footer-logo">VELTRIX</Link>
              <p className="footer-description">
                Your trusted platform for connecting wholesalers, retailers, and customers. 
                Quality products, best prices, secure transactions.
              </p>
              <div className="footer-social">
                {socialIcons.map((social) => (
                  <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label={social.name}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className={`footer-col fade-in-up ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.1s' }}>
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">
                      <ChevronRight size={12} />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Customer Service */}
            <div className={`footer-col fade-in-up ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.2s' }}>
              <h3 className="footer-title">Customer Service</h3>
              <ul className="footer-links">
                {customerService.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">
                      <ChevronRight size={12} />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: My Account */}
            <div className={`footer-col fade-in-up ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.3s' }}>
              <h3 className="footer-title">My Account</h3>
              <ul className="footer-links">
                {myAccount.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="footer-link">
                      <ChevronRight size={12} />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Download App */}
            <div className={`footer-col fade-in-up ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.4s' }}>
              <h3 className="footer-title">Download App</h3>
              <p className="footer-app-text">Get the best experience on our app</p>
              <div className="footer-app-buttons">
                <a href="#" className="footer-app-btn">
                  <Apple size={20} />
                  <div>
                    <span>Download on</span>
                    <strong>App Store</strong>
                  </div>
                </a>
                <a href="#" className="footer-app-btn">
                  <Smartphone size={20} />
                  <div>
                    <span>Get it on</span>
                    <strong>Google Play</strong>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                © {new Date().getFullYear()} VELTRIX. All rights reserved.
              </p>
              <div className="footer-bottom-links">
                <Link href="/terms">Terms & Conditions</Link>
                <span className="footer-bottom-divider">|</span>
                <Link href="/privacy">Privacy Policy</Link>
                <span className="footer-bottom-divider">|</span>
                <Link href="/sitemap">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}