'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Building,
  User,
  MapPin,
  Package,
  CreditCard,
  Check,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Award,
  Store
} from '../../../utils/icons';
import { useRegisterWholesalerMutation } from '@/redux/wholesaler/slices/wholesalerSlice';
import ClientOnly from '@/app/ClientOnly';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WholesalerLoginModal from '@/features/common/WholesalerLoginModal';

function RegistrationFormContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mutation
  const [registerWholesaler, { isLoading }] = useRegisterWholesalerMutation();

  // Form State
  const [formData, setFormData] = useState({
    // Personal Info
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    password: '',
    confirm_password: '',

    // Business Info
    business_name: '',
    business_type: 'Wholesaler',
    gst_number: '',
    pan_number: '',
    business_description: '',

    // Address
    shop_address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',

    // Product Info
    categories: [],
    minimum_order_quantity: 10,
    price_range: 'Mid-Range',

    // Bank Details
    account_holder: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    upi_id: '',

    // Terms
    terms_accepted: true
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [touched, setTouched] = useState({});

  const availableCategories = [
    "Men's Clothing",
    "Women's Clothing", 
    "Kids Wear",
    "Footwear",
    "Fashion Accessories",
    "Traditional Wear",
    "Western Wear",
    "Fabrics & Textiles",
    "Jewelry & Watches",
    "Leather Goods"
  ];

  const businessTypes = [
    "Wholesaler",
    "Manufacturer", 
    "Authorized Distributor",
    "Direct Importer"
  ];

  const priceRanges = [
    "Budget-Friendly (₹100 - ₹500)",
    "Mid-Range (₹500 - ₹2,000)",
    "Premium (₹2,000 - ₹5,000)",
    "Luxury High-End (₹5,000+)"
  ];

  const indianStates = [
    "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
    "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => {
      const exists = prev.categories.includes(category);
      const updated = exists
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: updated };
    });

    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateSingleField(field);
  };

  const validateSingleField = (field) => {
    const newErrors = { ...errors };

    // Step 1 Fields
    if (field === 'first_name') {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required.';
      else if (formData.first_name.trim().length < 2) newErrors.first_name = 'First name must be at least 2 characters.';
      else delete newErrors.first_name;
    }

    if (field === 'mobile') {
      const mob = formData.mobile.replace(/\D/g, '');
      if (!mob) newErrors.mobile = 'Mobile number is required.';
      else if (!/^[6-9]\d{9}$/.test(mob)) newErrors.mobile = 'Enter a valid 10-digit number starting with 6, 7, 8, or 9.';
      else delete newErrors.mobile;
    }

    if (field === 'email') {
      const em = formData.email.trim();
      if (!em) newErrors.email = 'Business email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) newErrors.email = 'Please enter a valid email address.';
      else delete newErrors.email;
    }

    if (field === 'password') {
      const pass = formData.password;
      if (!pass) newErrors.password = 'Password is required.';
      else if (pass.length < 8) newErrors.password = 'Password must be at least 8 characters long.';
      else if (!/[A-Za-z]/.test(pass) || !/\d/.test(pass)) newErrors.password = 'Must contain both letters and numbers.';
      else delete newErrors.password;
    }

    if (field === 'confirm_password') {
      if (!formData.confirm_password) newErrors.confirm_password = 'Confirm password is required.';
      else if (formData.confirm_password !== formData.password) newErrors.confirm_password = 'Passwords do not match.';
      else delete newErrors.confirm_password;
    }

    // Step 2 Fields
    if (field === 'business_name') {
      if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required.';
      else delete newErrors.business_name;
    }

    if (field === 'gst_number' && formData.gst_number) {
      const gst = formData.gst_number.trim().toUpperCase();
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)) {
        newErrors.gst_number = 'Enter a valid 15-character GST number (e.g. 22AAAAA0000A1Z5).';
      } else {
        delete newErrors.gst_number;
      }
    }

    if (field === 'pan_number' && formData.pan_number) {
      const pan = formData.pan_number.trim().toUpperCase();
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
        newErrors.pan_number = 'Enter a valid 10-character PAN number (e.g. ABCDE1234F).';
      } else {
        delete newErrors.pan_number;
      }
    }

    // Step 3 Fields
    if (field === 'shop_address') {
      if (!formData.shop_address.trim()) newErrors.shop_address = 'Shop or warehouse address is required.';
      else delete newErrors.shop_address;
    }
    if (field === 'city') {
      if (!formData.city.trim()) newErrors.city = 'City is required.';
      else delete newErrors.city;
    }
    if (field === 'state') {
      if (!formData.state) newErrors.state = 'State is required.';
      else delete newErrors.state;
    }
    if (field === 'pincode') {
      const pin = formData.pincode.replace(/\D/g, '');
      if (!pin) newErrors.pincode = 'Pincode is required.';
      else if (!/^\d{6}$/.test(pin)) newErrors.pincode = 'Pincode must be exactly 6 digits.';
      else delete newErrors.pincode;
    }

    // Step 5 Fields
    if (field === 'account_holder') {
      if (!formData.account_holder.trim()) newErrors.account_holder = 'Account holder name is required.';
      else delete newErrors.account_holder;
    }
    if (field === 'bank_name') {
      if (!formData.bank_name.trim()) newErrors.bank_name = 'Bank name is required.';
      else delete newErrors.bank_name;
    }
    if (field === 'account_number') {
      if (!formData.account_number.trim()) newErrors.account_number = 'Bank account number is required.';
      else if (!/^\d{9,18}$/.test(formData.account_number.trim())) newErrors.account_number = 'Enter valid account number (9-18 digits).';
      else delete newErrors.account_number;
    }
    if (field === 'ifsc_code') {
      const ifsc = formData.ifsc_code.trim().toUpperCase();
      if (!ifsc) newErrors.ifsc_code = 'IFSC code is required.';
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) newErrors.ifsc_code = 'Enter a valid 11-digit IFSC code (e.g. HDFC0001234).';
      else delete newErrors.ifsc_code;
    }

    setErrors(newErrors);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required.';
      const mob = formData.mobile.replace(/\D/g, '');
      if (!mob) newErrors.mobile = 'Mobile number is required.';
      else if (!/^[6-9]\d{9}$/.test(mob)) newErrors.mobile = 'Enter valid 10-digit mobile starting with 6-9.';
      
      const em = formData.email.trim();
      if (!em) newErrors.email = 'Business email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) newErrors.email = 'Enter a valid email address.';

      if (!formData.password) newErrors.password = 'Password is required.';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long.';
      else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
        newErrors.password = 'Must contain both letters and numbers.';
      }

      if (!formData.confirm_password) newErrors.confirm_password = 'Confirm password is required.';
      else if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match.';
    }

    if (step === 2) {
      if (!formData.business_name.trim()) newErrors.business_name = 'Business / Store name is required.';
      if (!formData.business_type) newErrors.business_type = 'Business type is required.';

      if (formData.gst_number) {
        const gst = formData.gst_number.trim().toUpperCase();
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)) {
          newErrors.gst_number = 'Enter a valid 15-character GST number.';
        }
      }
      if (formData.pan_number) {
        const pan = formData.pan_number.trim().toUpperCase();
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
          newErrors.pan_number = 'Enter a valid 10-character PAN number.';
        }
      }
    }

    if (step === 3) {
      if (!formData.shop_address.trim()) newErrors.shop_address = 'Address is required.';
      if (!formData.city.trim()) newErrors.city = 'City is required.';
      if (!formData.state) newErrors.state = 'State is required.';
      const pin = formData.pincode.replace(/\D/g, '');
      if (!pin) newErrors.pincode = 'Pincode is required.';
      else if (!/^\d{6}$/.test(pin)) newErrors.pincode = 'Enter a valid 6-digit pincode.';
    }

    if (step === 4) {
      if (formData.categories.length === 0) newErrors.categories = 'Please select at least one product category.';
      if (!formData.price_range) newErrors.price_range = 'Price range is required.';
      if (!formData.minimum_order_quantity || formData.minimum_order_quantity < 1) {
        newErrors.minimum_order_quantity = 'MOQ must be at least 1 unit.';
      }
    }

    if (step === 5) {
      if (!formData.account_holder.trim()) newErrors.account_holder = 'Account holder name is required.';
      if (!formData.bank_name.trim()) newErrors.bank_name = 'Bank name is required.';
      if (!formData.account_number.trim()) newErrors.account_number = 'Account number is required.';
      else if (!/^\d{9,18}$/.test(formData.account_number.trim())) {
        newErrors.account_number = 'Enter valid account number (9-18 digits).';
      }

      const ifsc = formData.ifsc_code.trim().toUpperCase();
      if (!ifsc) newErrors.ifsc_code = 'IFSC code is required.';
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
        newErrors.ifsc_code = 'Enter a valid 11-digit IFSC code.';
      }

      if (!formData.terms_accepted) {
        newErrors.terms_accepted = 'You must accept the terms and conditions.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } else {
      toast.error('Please resolve the highlighted errors before continuing.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200', width: 'w-0' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = getPasswordStrength(formData.password);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    // Validate current step
    if (!validateStep(5)) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        mobile: formData.mobile.replace(/\D/g, ''),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirm_password: formData.confirm_password,

        business_name: formData.business_name.trim(),
        business_type: formData.business_type,
        gst_number: formData.gst_number ? formData.gst_number.trim().toUpperCase() : null,
        pan_number: formData.pan_number ? formData.pan_number.trim().toUpperCase() : null,
        business_description: formData.business_description.trim(),

        shop_address: formData.shop_address.trim(),
        city: formData.city.trim(),
        state: formData.state,
        pincode: formData.pincode.replace(/\D/g, ''),
        landmark: formData.landmark.trim(),

        categories: formData.categories,
        minimum_order_quantity: parseInt(formData.minimum_order_quantity, 10) || 1,
        price_range: formData.price_range,

        account_holder: formData.account_holder.trim(),
        bank_name: formData.bank_name.trim(),
        account_number: formData.account_number.trim(),
        ifsc_code: formData.ifsc_code.trim().toUpperCase(),
        upi_id: formData.upi_id.trim()
      };

      const response = await registerWholesaler(payload).unwrap();

      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      localStorage.setItem('user_role', 'wholesaler');
      
      const userName = response.data?.business_name || formData.business_name;
      localStorage.setItem('user_name', userName);
      localStorage.setItem('user_id', response.user_id || response.data?.user?.id || response.data?.id);
      localStorage.setItem('is_wholesaler_registered', 'true');

      toast.success('Wholesaler registered successfully! Welcome to Velqino.');

      setTimeout(() => {
        router.push('/wholesaler/wholesalerdashboard');
      }, 800);

    } catch (err) {
      console.error('Registration submission failed:', err);
      const backendErrors = err?.errors || err?.data?.errors || err?.response?.data?.errors;
      const backendMsg = err?.message || err?.data?.message || err?.response?.data?.message || 'Registration failed. Please check your inputs.';

      if (backendErrors && typeof backendErrors === 'object') {
        const fieldErrors = {};
        Object.entries(backendErrors).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages) ? messages[0] : String(messages);
        });
        setErrors(fieldErrors);

        // Step mapping so user jumps to the error step
        if (fieldErrors.email || fieldErrors.mobile || fieldErrors.password || fieldErrors.first_name) {
          setCurrentStep(1);
        } else if (fieldErrors.business_name || fieldErrors.gst_number || fieldErrors.pan_number) {
          setCurrentStep(2);
        } else if (fieldErrors.shop_address || fieldErrors.city || fieldErrors.pincode) {
          setCurrentStep(3);
        } else if (fieldErrors.categories || fieldErrors.minimum_order_quantity) {
          setCurrentStep(4);
        } else if (fieldErrors.account_number || fieldErrors.ifsc_code) {
          setCurrentStep(5);
        }

        const firstErr = Object.values(fieldErrors)[0];
        setGeneralError(backendMsg || firstErr);
        toast.error(firstErr || backendMsg);
      } else {
        setGeneralError(backendMsg);
        toast.error(backendMsg);
      }
    }
  };

  const steps = [
    { number: 1, name: 'Personal Info', icon: User },
    { number: 2, name: 'Business Details', icon: Building },
    { number: 3, name: 'Address & Location', icon: MapPin },
    { number: 4, name: 'Product Categories', icon: Package },
    { number: 5, name: 'Bank Details', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/40 via-surface-0 to-surface-1 py-6 sm:py-10 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-secondary-600 hover:text-primary-700 transition-colors"
          >
            <span>← Back to Store</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary-500">
            <span>Wholesale Network</span>
            <span>•</span>
            <span className="text-primary-700 font-bold">Step {currentStep} of 5</span>
          </div>
        </div>

        {/* 60/40 Split Grid on Laptop/Large Screens; Natural Stack on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (60-65%): Header + Stepper + Form */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">

            {/* Hero Header (Left-aligned, sleek, visible above the fold on laptop) */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/80 border border-primary-200 text-primary-800 text-xs font-bold tracking-wide uppercase shadow-2xs">
                <Store size={14} className="text-primary-600" />
                <span>Vendor Partner Registration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-secondary-900 tracking-tight">
                Register as a Verified Wholesaler
              </h1>
              <p className="text-xs sm:text-sm text-secondary-600 leading-relaxed max-w-2xl">
                Expand your wholesale business to verified retailers with automated B2B invoicing, fast settlements, and dedicated supplier support.
              </p>
            </div>

            {/* Multi-Step Stepper Header */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-primary-100 shadow-2xs">
              <div className="flex items-center justify-between relative px-2">
                {/* Background connecting bar */}
                <div className="absolute top-4 sm:top-5 left-6 right-6 h-1 bg-secondary-200 -z-0">
                  <div 
                    className="h-full bg-primary-600 transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                  />
                </div>

                {steps.map((s) => {
                  const isPassed = currentStep > s.number;
                  const isCurrent = currentStep === s.number;
                  const StepIcon = s.icon;

                  return (
                    <div key={s.number} className="flex flex-col items-center relative z-10">
                      <button
                        type="button"
                        onClick={() => {
                          if (s.number < currentStep) setCurrentStep(s.number);
                        }}
                        disabled={s.number > currentStep}
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm ${
                          isPassed
                            ? 'bg-emerald-600 text-white border-2 border-emerald-600'
                            : isCurrent
                            ? 'bg-primary-600 text-white border-2 border-primary-600 ring-4 ring-primary-100'
                            : 'bg-white text-secondary-400 border-2 border-secondary-200 cursor-not-allowed'
                        }`}
                      >
                        {isPassed ? <Check size={16} /> : <StepIcon size={16} />}
                      </button>
                      <span className={`text-[10px] sm:text-xs font-semibold mt-1.5 hidden sm:block ${
                        isCurrent ? 'text-primary-700' : isPassed ? 'text-emerald-700' : 'text-secondary-400'
                      }`}>
                        {s.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-primary-200/60 p-5 sm:p-8 relative overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700" />

          {/* General Error Banner */}
          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-fadeIn">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-red-800">
                <span className="font-semibold block">Registration Notice</span>
                {generalError}
              </div>
              <button
                type="button"
                onClick={() => setGeneralError('')}
                className="text-red-400 hover:text-red-600 p-0.5"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ================= STEP 1: PERSONAL & LOGIN INFO ================= */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-secondary-100 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-secondary-900">Step 1: Contact & Credentials</h2>
                  <p className="text-xs text-secondary-500 mt-0.5">Please provide your personal contact info and credentials to manage your store.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('first_name')}
                        placeholder="e.g. Ramesh"
                        className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                          errors.first_name
                            ? 'border-red-500 ring-2 ring-red-100'
                            : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                        }`}
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.first_name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Last Name
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="e.g. Patel"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border border-secondary-200 bg-secondary-50/40 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                      <input
                        type="tel"
                        name="mobile"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('mobile')}
                        placeholder="10-digit mobile number"
                        className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                          errors.mobile
                            ? 'border-red-500 ring-2 ring-red-100'
                            : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                        }`}
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.mobile}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Business Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('email')}
                        placeholder="business@example.com"
                        className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                          errors.email
                            ? 'border-red-500 ring-2 ring-red-100'
                            : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('password')}
                        placeholder="Min. 8 characters"
                        className={`w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                          errors.password
                            ? 'border-red-500 ring-2 ring-red-100'
                            : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-primary-600 p-1"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {formData.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-medium text-secondary-500">
                          <span>Strength: <span className="font-semibold text-secondary-700">{strength.label}</span></span>
                          <span>{strength.score}/4</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary-100 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('confirm_password')}
                        placeholder="Re-enter password"
                        className={`w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                          errors.confirm_password
                            ? 'border-red-500 ring-2 ring-red-100'
                            : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-primary-600 p-1"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.confirm_password}</span>
                      </p>
                    )}
                    {!errors.confirm_password && formData.confirm_password && formData.password === formData.confirm_password && (
                      <p className="text-emerald-600 text-xs mt-1.5 flex items-center gap-1">
                        <CheckCircle size={13} />
                        <span>Passwords match</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 2: BUSINESS INFORMATION ================= */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-secondary-100 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-secondary-900">Step 2: Business Information</h2>
                  <p className="text-xs text-secondary-500 mt-0.5">Enter details regarding your business organization and tax credentials.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Business / Store Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('business_name')}
                        placeholder="e.g. Apex Wholesale Apparels"
                        className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                          errors.business_name
                            ? 'border-red-500 ring-2 ring-red-100'
                            : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                        }`}
                      />
                    </div>
                    {errors.business_name && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.business_name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Business Model Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border border-secondary-200 bg-secondary-50/40 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                    >
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      GST Number <span className="text-secondary-400 font-normal">(Recommended)</span>
                    </label>
                    <input
                      type="text"
                      name="gst_number"
                      maxLength={15}
                      value={formData.gst_number}
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase();
                        handleInputChange(e);
                      }}
                      onBlur={() => handleBlur('gst_number')}
                      placeholder="e.g. 22AAAAA0000A1Z5"
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border uppercase bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.gst_number
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    {errors.gst_number && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.gst_number}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      PAN Number <span className="text-secondary-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="pan_number"
                      maxLength={10}
                      value={formData.pan_number}
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase();
                        handleInputChange(e);
                      }}
                      onBlur={() => handleBlur('pan_number')}
                      placeholder="e.g. ABCDE1234F"
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border uppercase bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.pan_number
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    {errors.pan_number && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.pan_number}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                    Business Overview / Description
                  </label>
                  <textarea
                    name="business_description"
                    rows={3}
                    value={formData.business_description}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your bulk manufacturing capabilities, warehouse space, or supply background..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-secondary-200 bg-secondary-50/40 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* ================= STEP 3: ADDRESS & LOGISTICS ================= */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-secondary-100 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-secondary-900">Step 3: Warehouse & Billing Address</h2>
                  <p className="text-xs text-secondary-500 mt-0.5">Where can retailers schedule logistics or inspect consignment dispatches?</p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                    Shop / Warehouse Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3.5 top-3 text-secondary-400 pointer-events-none" />
                    <textarea
                      name="shop_address"
                      rows={2}
                      value={formData.shop_address}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('shop_address')}
                      placeholder="e.g. Unit 4B, Industrial Estate, Phase 2"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.shop_address
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                  </div>
                  {errors.shop_address && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>{errors.shop_address}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('city')}
                      placeholder="e.g. Surat"
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.city
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('state')}
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.state
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    >
                      <option value="">Select State</option>
                      {indianStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.state}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('pincode')}
                      placeholder="6-digit PIN"
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.pincode
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    {errors.pincode && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.pincode}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                    Landmark <span className="text-secondary-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Near Transport Hub or Junction"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-secondary-200 bg-secondary-50/40 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* ================= STEP 4: PRODUCTS & MOQ ================= */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-secondary-100 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-secondary-900">Step 4: Product Categories & Pricing</h2>
                  <p className="text-xs text-secondary-500 mt-0.5">Select the segments you supply and your typical bulk order thresholds.</p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-2">
                    Product Categories Handled <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableCategories.map((cat) => {
                      const isSelected = formData.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className={`p-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between ${
                            isSelected
                              ? 'bg-primary-50 border-primary-500 text-primary-800 shadow-2xs font-semibold'
                              : 'bg-secondary-50/50 border-secondary-200 text-secondary-700 hover:bg-white hover:border-secondary-300'
                          }`}
                        >
                          <span>{cat}</span>
                          {isSelected && <Check size={16} className="text-primary-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {errors.categories && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>{errors.categories}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Minimum Order Quantity (MOQ) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Package size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                      <input
                        type="number"
                        min="1"
                        name="minimum_order_quantity"
                        value={formData.minimum_order_quantity}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('minimum_order_quantity')}
                        placeholder="e.g. 10"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border border-secondary-200 bg-secondary-50/40 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-secondary-500 mt-1">Units per order variant</p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Price Segment Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="price_range"
                      value={formData.price_range}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border border-secondary-200 bg-secondary-50/40 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                    >
                      {priceRanges.map(pr => (
                        <option key={pr} value={pr}>{pr}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 5: BANK & SETTLEMENT ================= */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-secondary-100 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-secondary-900">Step 5: Settlement Bank Account</h2>
                  <p className="text-xs text-secondary-500 mt-0.5">Where should payments from retail order dispatches be remitted?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="account_holder"
                      value={formData.account_holder}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('account_holder')}
                      placeholder="e.g. Apex Apparels Pvt Ltd"
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.account_holder
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    {errors.account_holder && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.account_holder}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('bank_name')}
                      placeholder="e.g. HDFC Bank"
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.bank_name
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    {errors.bank_name && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.bank_name}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('account_number')}
                      placeholder="9 to 18 digits"
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.account_number
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    {errors.account_number && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.account_number}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ifsc_code"
                      maxLength={11}
                      value={formData.ifsc_code}
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase();
                        handleInputChange(e);
                      }}
                      onBlur={() => handleBlur('ifsc_code')}
                      placeholder="e.g. HDFC0001234"
                      className={`w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border uppercase bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
                        errors.ifsc_code
                          ? 'border-red-500 ring-2 ring-red-100'
                          : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                      }`}
                    />
                    {errors.ifsc_code && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={13} />
                        <span>{errors.ifsc_code}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1.5">
                    UPI ID <span className="text-secondary-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="upi_id"
                    value={formData.upi_id}
                    onChange={handleInputChange}
                    placeholder="businessname@okhdfcbank"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-secondary-200 bg-secondary-50/40 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="terms_accepted"
                      checked={formData.terms_accepted}
                      onChange={handleInputChange}
                      className="mt-0.5 w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-secondary-600 leading-snug">
                      I certify that the provided GST, bank, and business credentials are valid, and I agree to the Velqino{' '}
                      <span className="text-primary-700 font-semibold hover:underline">Wholesale Vendor Terms</span>.
                    </span>
                  </label>
                  {errors.terms_accepted && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>{errors.terms_accepted}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Stepper Navigation Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-secondary-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-5 py-2.5 rounded-xl border border-secondary-200 text-secondary-700 font-semibold text-sm hover:bg-secondary-50 transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <span>Continue</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Wholesaler Registration</span>
                      <Check size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-secondary-400 font-medium">
                Already registered as a Wholesaler?
              </span>
            </div>
          </div>

          {/* Mobile-only Sign In Trigger */}
          <div className="lg:hidden text-center mt-6 pt-6 border-t border-secondary-100">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-primary-200 text-primary-700 font-bold text-xs hover:bg-primary-50 transition-colors"
            >
              <span>Sign In to Existing Wholesaler Account</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Mobile-only Benefits Grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
          <div className="p-4 bg-white rounded-2xl border border-primary-100/70 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100/70 flex items-center justify-center text-primary-700 flex-shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-secondary-800">Guaranteed Settlements</h4>
              <p className="text-[11px] text-secondary-500">Automated payouts upon delivery</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-primary-100/70 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100/70 flex items-center justify-center text-primary-700 flex-shrink-0">
              <Award size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-secondary-800">Direct Retail Connections</h4>
              <p className="text-[11px] text-secondary-500">10,000+ verified buyers across India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (35-40%): Sticky Information Sidebar on Large Screens */}
      <div className="hidden lg:block lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20 space-y-6">
        
        {/* Sidebar Card 1: Wholesaler Partner Advantage */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Building size={24} className="text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-200">
                Velqino Supplier Hub
              </span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                Wholesale Supplier Network
              </h3>
              <p className="text-xs text-primary-100/90 mt-1 leading-relaxed">
                Reach verified retail store owners across India with automated order dispatch, instant settlements, and zero sales commissions for 30 days.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-white/15">
              <div className="flex items-start gap-2.5 text-xs text-white/95">
                <CheckCircle size={16} className="text-primary-200 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">10,000+ Verified Retail Buyers</strong>
                  <span className="text-primary-100/80">Direct B2B purchase orders without brokers or distributors.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-white/95">
                <CheckCircle size={16} className="text-primary-200 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Guaranteed Direct Bank Payouts</strong>
                  <span className="text-primary-100/80">Fast bank settlements released right after verified delivery.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-white/95">
                <CheckCircle size={16} className="text-primary-200 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Automated GST & E-Way Billing</strong>
                  <span className="text-primary-100/80">Fully compliant invoices generated automatically per order.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Card 2: Interactive Step Progress Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-secondary-200/80 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-secondary-100">
            <h4 className="text-xs font-bold text-secondary-900 uppercase tracking-wider">
              Onboarding Checklist
            </h4>
            <span className="text-xs font-bold text-primary-600">
              {currentStep} / 5 Completed
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((s) => {
              const isPassed = currentStep > s.number;
              const isCurrent = currentStep === s.number;
              const StepIcon = s.icon;

              return (
                <div
                  key={s.number}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-primary-50/80 border border-primary-200/80 text-primary-900 font-bold'
                      : isPassed
                      ? 'bg-secondary-50/60 text-secondary-700 font-medium'
                      : 'text-secondary-400 opacity-70'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                      isPassed
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-primary-600 text-white ring-2 ring-primary-200'
                        : 'bg-secondary-200 text-secondary-500'
                    }`}
                  >
                    {isPassed ? <Check size={14} /> : <span>{s.number}</span>}
                  </div>
                  <div className="text-xs flex-1">
                    <span>{s.name}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] uppercase font-bold text-primary-600 px-2 py-0.5 rounded-full bg-primary-100">
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Card 3: Already have an account? Sign In */}
        <div className="bg-white rounded-3xl p-6 border border-secondary-200/80 shadow-md">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
              <Store size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-secondary-900">Existing Wholesaler?</h4>
              <p className="text-xs text-secondary-500">Access your supplier dashboard</p>
            </div>
          </div>
          <p className="text-xs text-secondary-600 mb-4 leading-relaxed">
            Already verified on Velqino? Sign in to manage your wholesale catalog, process retail orders, and view settlement status.
          </p>
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl border-2 border-primary-200 hover:border-primary-400 bg-primary-50/60 hover:bg-primary-50 text-primary-700 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <span>Sign in to Wholesaler Portal</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Sidebar Card 4: Supplier Trust & Protection */}
        <div className="bg-secondary-50/70 rounded-3xl p-5 border border-secondary-200/80 space-y-2.5">
          <div className="flex items-center gap-2 text-secondary-900 font-bold text-xs">
            <ShieldCheck size={17} className="text-emerald-600" />
            <span>Supplier Protection Guarantee</span>
          </div>
          <p className="text-[11px] text-secondary-600 leading-relaxed">
            Velqino verifies retail buyers before orders are placed. All payments are secured in escrow and settled promptly into your linked business account.
          </p>
        </div>
      </div>
    </div>
  </div>

      {/* Embedded Wholesaler Login Modal */}
      <WholesalerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => {
          setIsLoginModalOpen(false);
          router.push('/wholesaler/wholesalerdashboard');
        }}
      />
    </div>
  );
}

export default function RegistrationForm() {
  return (
    <ClientOnly>
      <RegistrationFormContent />
    </ClientOnly>
  );
}
