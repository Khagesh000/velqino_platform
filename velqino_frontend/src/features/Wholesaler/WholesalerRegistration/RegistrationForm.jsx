'use client';

import React, { useState } from 'react';
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
  Store,
  FileText
} from '../../../utils/icons';
import { useRegisterWholesalerMutation } from '@/redux/wholesaler/slices/wholesalerSlice';
import ClientOnly from '@/app/ClientOnly';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WholesalerLoginModal from '@/features/common/WholesalerLoginModal';
import { setAuthTokens } from '@/utils/cookieUtils';

const availableCategories = [
  "Men's Clothing", "Women's Clothing", "Kids Wear", "Footwear",
  "Fashion Accessories", "Traditional Wear", "Western Wear",
  "Fabrics & Textiles", "Jewelry & Watches", "Leather Goods"
];

const businessTypes = ["Wholesaler", "Manufacturer", "Authorized Distributor", "Direct Importer"];

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

const steps = [
  { number: 1, name: 'Personal Info', icon: User },
  { number: 2, name: 'Business Details', icon: Building },
  { number: 3, name: 'Address & Location', icon: MapPin },
  { number: 4, name: 'Product Categories', icon: Package },
  { number: 5, name: 'Bank Details', icon: CreditCard }
];

function RegistrationFormContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerWholesaler, { isLoading }] = useRegisterWholesalerMutation();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    password: '',
    confirm_password: '',
    business_name: '',
    business_type: 'Wholesaler',
    gst_number: '',
    pan_number: '',
    business_description: '',
    shop_address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    categories: [],
    minimum_order_quantity: 10,
    price_range: 'Mid-Range (₹500 - ₹2,000)',
    account_holder: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    upi_id: '',
    terms_accepted: true
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [touched, setTouched] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    if (name === 'gst_number' || name === 'pan_number' || name === 'ifsc_code') val = value.toUpperCase();
    if (name === 'mobile') val = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'pincode') val = value.replace(/\D/g, '').slice(0, 6);

    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (generalError) setGeneralError('');
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    if (errors.categories) setErrors(prev => ({ ...prev, categories: '' }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateSingleField(field);
  };

  const validateSingleField = (field) => {
    const newErrors = { ...errors };
    if (field === 'first_name') {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required.';
      else delete newErrors.first_name;
    }
    if (field === 'mobile') {
      const mob = formData.mobile.replace(/\D/g, '');
      if (!mob || !/^[6-9]\d{9}$/.test(mob)) newErrors.mobile = 'Enter valid 10-digit number starting with 6-9.';
      else delete newErrors.mobile;
    }
    if (field === 'email') {
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Enter valid email.';
      else delete newErrors.email;
    }
    if (field === 'password') {
      if (!formData.password || formData.password.length < 8) newErrors.password = 'Must be at least 8 characters.';
      else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) newErrors.password = 'Must contain letters & numbers.';
      else delete newErrors.password;
    }
    if (field === 'confirm_password') {
      if (formData.confirm_password !== formData.password) newErrors.confirm_password = 'Passwords do not match.';
      else delete newErrors.confirm_password;
    }
    if (field === 'business_name' && !formData.business_name.trim()) newErrors.business_name = 'Business name is required.';
    if (field === 'shop_address' && !formData.shop_address.trim()) newErrors.shop_address = 'Address is required.';
    if (field === 'city' && !formData.city.trim()) newErrors.city = 'City is required.';
    if (field === 'state' && !formData.state) newErrors.state = 'State is required.';
    if (field === 'pincode' && (!formData.pincode || formData.pincode.length !== 6)) newErrors.pincode = 'Valid 6-digit PIN required.';
    if (field === 'account_holder' && !formData.account_holder.trim()) newErrors.account_holder = 'Account holder is required.';
    if (field === 'bank_name' && !formData.bank_name.trim()) newErrors.bank_name = 'Bank name is required.';
    if (field === 'account_number' && (!formData.account_number || !/^\d{9,18}$/.test(formData.account_number.trim()))) {
      newErrors.account_number = 'Enter valid account number (9-18 digits).';
    }
    if (field === 'ifsc_code' && (!formData.ifsc_code || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code.trim().toUpperCase()))) {
      newErrors.ifsc_code = 'Enter valid 11-digit IFSC code.';
    }
    setErrors(newErrors);
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required.';
      if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = 'Valid 10-digit mobile required.';
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Valid email required.';
      if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be 8+ chars with letters & numbers.';
      if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match.';
    }
    if (step === 2) {
      if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required.';
      if (!formData.business_type) newErrors.business_type = 'Business type is required.';
      if (formData.gst_number && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number.trim())) {
        newErrors.gst_number = 'Enter valid 15-character GSTIN.';
      }
    }
    if (step === 3) {
      if (!formData.shop_address.trim()) newErrors.shop_address = 'Address is required.';
      if (!formData.city.trim()) newErrors.city = 'City is required.';
      if (!formData.state) newErrors.state = 'State is required.';
      if (!formData.pincode || formData.pincode.length !== 6) newErrors.pincode = 'Valid 6-digit PIN required.';
    }
    if (step === 4) {
      if (formData.categories.length === 0) newErrors.categories = 'Select at least one product category.';
      if (!formData.minimum_order_quantity || formData.minimum_order_quantity < 1) newErrors.minimum_order_quantity = 'MOQ must be 1+.';
    }
    if (step === 5) {
      if (!formData.account_holder.trim()) newErrors.account_holder = 'Account holder is required.';
      if (!formData.bank_name.trim()) newErrors.bank_name = 'Bank name is required.';
      if (!formData.account_number || !/^\d{9,18}$/.test(formData.account_number.trim())) newErrors.account_number = 'Valid account number required.';
      if (!formData.ifsc_code || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code.trim().toUpperCase())) newErrors.ifsc_code = 'Valid 11-digit IFSC required.';
      if (!formData.terms_accepted) newErrors.terms_accepted = 'Must accept terms.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      toast.error('Please resolve the highlighted errors before continuing.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
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
      setAuthTokens({ access: response.access, refresh: response.refresh });
      localStorage.setItem('user_role', 'wholesaler');
      localStorage.setItem('user_name', response.data?.business_name || formData.business_name);
      localStorage.setItem('user_id', response.user_id || response.data?.user?.id || response.data?.id);
      localStorage.setItem('is_wholesaler_registered', 'true');

      toast.success('Wholesaler registered successfully! Welcome to Velqino.');
      setTimeout(() => router.push('/wholesaler/wholesalerdashboard'), 800);
    } catch (err) {
      console.error('Registration submission failed:', err);
      const backendErrors = err?.errors || err?.data?.errors || err?.response?.data?.errors;
      const backendMsg = err?.message || err?.data?.message || err?.response?.data?.message || 'Registration failed.';

      if (backendErrors && typeof backendErrors === 'object') {
        const fieldErrors = {};
        Object.entries(backendErrors).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages) ? messages[0] : String(messages);
        });
        setErrors(fieldErrors);

        if (fieldErrors.email || fieldErrors.mobile || fieldErrors.password || fieldErrors.first_name) setCurrentStep(1);
        else if (fieldErrors.business_name || fieldErrors.gst_number || fieldErrors.pan_number) setCurrentStep(2);
        else if (fieldErrors.shop_address || fieldErrors.city || fieldErrors.pincode) setCurrentStep(3);
        else if (fieldErrors.categories || fieldErrors.minimum_order_quantity) setCurrentStep(4);
        else if (fieldErrors.account_number || fieldErrors.ifsc_code) setCurrentStep(5);

        setGeneralError(Object.values(fieldErrors)[0] || backendMsg);
      } else {
        setGeneralError(backendMsg);
      }
      toast.error(backendMsg);
    }
  };

  const inputCls = (err, hasIcon = true) =>
    `w-full ${hasIcon ? 'pl-10' : 'pl-3.5'} pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-secondary-50/40 hover:bg-white focus:bg-white focus:outline-none transition-all ${
      err ? 'border-red-500 ring-2 ring-red-100' : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/40 via-surface-0 to-surface-1 py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-secondary-600 hover:text-primary-700">
            ← Back to Store
          </Link>
          <div className="text-xs font-semibold text-secondary-500">
            Wholesale Network • <span className="text-primary-700 font-bold">Step {currentStep} of 5</span>
          </div>
        </div>

        {/* 60/40 Split Grid on Laptop; Natural Stack on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (60-65%): Form */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-5">
            {/* Header */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100/80 text-primary-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Store size={14} className="text-primary-600" /> Vendor Partner Registration
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
                Register as a Verified Wholesaler
              </h1>
              <p className="text-xs sm:text-sm text-secondary-600 mt-1">
                Expand your wholesale business to verified retailers with automated B2B invoicing and direct settlements.
              </p>
            </div>

            {/* Stepper Header */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-primary-100 shadow-2xs">
              <div className="flex items-center justify-between relative px-2">
                <div className="absolute top-4 sm:top-5 left-5 right-5 h-1 bg-secondary-200 -z-0">
                  <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${((currentStep - 1) / 4) * 100}%` }} />
                </div>
                {steps.map(s => {
                  const isPassed = currentStep > s.number;
                  const isCurrent = currentStep === s.number;
                  const StepIcon = s.icon;
                  return (
                    <div key={s.number} className="flex flex-col items-center relative z-10">
                      <button
                        type="button"
                        onClick={() => s.number < currentStep && setCurrentStep(s.number)}
                        disabled={s.number > currentStep}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                          isPassed ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-white text-secondary-400 border border-secondary-200'
                        }`}
                      >
                        {isPassed ? <Check size={14} /> : <StepIcon size={14} />}
                      </button>
                      <span className={`text-[10px] font-semibold mt-1 hidden sm:block ${isCurrent ? 'text-primary-700' : isPassed ? 'text-emerald-700' : 'text-secondary-400'}`}>
                        {s.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Banner */}
            {generalError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-800">
                <div className="flex items-center gap-2"><AlertCircle size={16} className="text-red-600" /><span>{generalError}</span></div>
                <button type="button" onClick={() => setGeneralError('')} className="text-red-400 hover:text-red-600">✕</button>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-primary-200/60 p-5 sm:p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-primary-700" />

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* STEP 1: Personal & Login Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="border-b border-secondary-100 pb-2">
                      <h2 className="text-sm sm:text-base font-bold text-secondary-900">Step 1: Contact & Credentials</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">First Name *</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                          <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} onBlur={() => handleBlur('first_name')} placeholder="Ramesh" className={inputCls(errors.first_name)} />
                        </div>
                        {errors.first_name && <p className="text-red-600 text-xs mt-1">{errors.first_name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Last Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                          <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Patel" className={inputCls(false)} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Mobile Number *</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                          <input type="tel" name="mobile" maxLength={10} value={formData.mobile} onChange={handleInputChange} onBlur={() => handleBlur('mobile')} placeholder="9876543210" className={inputCls(errors.mobile)} />
                        </div>
                        {errors.mobile && <p className="text-red-600 text-xs mt-1">{errors.mobile}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Business Email *</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={() => handleBlur('email')} placeholder="wholesaler@business.com" className={inputCls(errors.email)} />
                        </div>
                        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Password *</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                          <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} onBlur={() => handleBlur('password')} placeholder="Min 8 chars" className={`${inputCls(errors.password)} pr-9`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Confirm Password *</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                          <input type={showConfirmPassword ? 'text' : 'password'} name="confirm_password" value={formData.confirm_password} onChange={handleInputChange} onBlur={() => handleBlur('confirm_password')} placeholder="Repeat password" className={`${inputCls(errors.confirm_password)} pr-9`} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.confirm_password && <p className="text-red-600 text-xs mt-1">{errors.confirm_password}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Business & Identity Details */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="border-b border-secondary-100 pb-2">
                      <h2 className="text-sm sm:text-base font-bold text-secondary-900">Step 2: Business & Identity</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Business Name *</label>
                        <input type="text" name="business_name" value={formData.business_name} onChange={handleInputChange} onBlur={() => handleBlur('business_name')} placeholder="e.g. Apex Textiles" className={inputCls(errors.business_name, false)} />
                        {errors.business_name && <p className="text-red-600 text-xs mt-1">{errors.business_name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Business Type *</label>
                        <select name="business_type" value={formData.business_type} onChange={handleInputChange} className={inputCls(errors.business_type, false)}>
                          {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">GSTIN Number (Optional)</label>
                        <input type="text" name="gst_number" maxLength={15} value={formData.gst_number} onChange={handleInputChange} onBlur={() => handleBlur('gst_number')} placeholder="22AAAAA0000A1Z5" className={`${inputCls(errors.gst_number, false)} font-mono`} />
                        {errors.gst_number && <p className="text-red-600 text-xs mt-1">{errors.gst_number}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">PAN Number (Optional)</label>
                        <input type="text" name="pan_number" maxLength={10} value={formData.pan_number} onChange={handleInputChange} onBlur={() => handleBlur('pan_number')} placeholder="ABCDE1234F" className={`${inputCls(errors.pan_number, false)} font-mono`} />
                        {errors.pan_number && <p className="text-red-600 text-xs mt-1">{errors.pan_number}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-secondary-700 mb-1">Business Overview (Optional)</label>
                      <textarea name="business_description" value={formData.business_description} onChange={handleInputChange} rows="2" placeholder="Brief summary of your wholesale supply business..." className={`${inputCls(false, false)} resize-none`} />
                    </div>
                  </div>
                )}

                {/* STEP 3: Address & Location */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="border-b border-secondary-100 pb-2">
                      <h2 className="text-sm sm:text-base font-bold text-secondary-900">Step 3: Shop & Dispatch Address</h2>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary-700 mb-1">Warehouse / Shop Address *</label>
                      <textarea name="shop_address" value={formData.shop_address} onChange={handleInputChange} onBlur={() => handleBlur('shop_address')} rows="2" placeholder="Unit, Building, Industrial Area" className={`${inputCls(errors.shop_address, false)} resize-none`} />
                      {errors.shop_address && <p className="text-red-600 text-xs mt-1">{errors.shop_address}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">City *</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} onBlur={() => handleBlur('city')} placeholder="Mumbai" className={inputCls(errors.city, false)} />
                        {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">State *</label>
                        <select name="state" value={formData.state} onChange={handleInputChange} onBlur={() => handleBlur('state')} className={inputCls(errors.state, false)}>
                          <option value="">Select State</option>
                          {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">PIN Code *</label>
                        <input type="text" name="pincode" maxLength={6} value={formData.pincode} onChange={handleInputChange} onBlur={() => handleBlur('pincode')} placeholder="400001" className={inputCls(errors.pincode, false)} />
                        {errors.pincode && <p className="text-red-600 text-xs mt-1">{errors.pincode}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Product Categories & MOQ */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="border-b border-secondary-100 pb-2">
                      <h2 className="text-sm sm:text-base font-bold text-secondary-900">Step 4: Product Supply & MOQ</h2>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-secondary-700 mb-2">Select Supply Categories *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableCategories.map(cat => {
                          const isSel = formData.categories.includes(cat);
                          return (
                            <button
                              type="button"
                              key={cat}
                              onClick={() => handleCategoryToggle(cat)}
                              className={`p-2 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                                isSel ? 'border-primary-500 bg-primary-50/80 text-primary-900 font-bold' : 'border-secondary-200 hover:bg-secondary-50 text-secondary-700'
                              }`}
                            >
                              <span>{cat}</span>
                              {isSel && <Check size={14} className="text-primary-600" />}
                            </button>
                          );
                        })}
                      </div>
                      {errors.categories && <p className="text-red-600 text-xs mt-1.5">{errors.categories}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Minimum Order Qty (MOQ) *</label>
                        <input type="number" name="minimum_order_quantity" min="1" value={formData.minimum_order_quantity} onChange={handleInputChange} className={inputCls(errors.minimum_order_quantity, false)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Price Range *</label>
                        <select name="price_range" value={formData.price_range} onChange={handleInputChange} className={inputCls(false, false)}>
                          {priceRanges.map(pr => <option key={pr} value={pr}>{pr}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Bank Details & Verification */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="border-b border-secondary-100 pb-2">
                      <h2 className="text-sm sm:text-base font-bold text-secondary-900">Step 5: Settlement Bank Account</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Account Holder Name *</label>
                        <input type="text" name="account_holder" value={formData.account_holder} onChange={handleInputChange} onBlur={() => handleBlur('account_holder')} placeholder="Apex Textiles Pvt Ltd" className={inputCls(errors.account_holder, false)} />
                        {errors.account_holder && <p className="text-red-600 text-xs mt-1">{errors.account_holder}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Bank Name *</label>
                        <input type="text" name="bank_name" value={formData.bank_name} onChange={handleInputChange} onBlur={() => handleBlur('bank_name')} placeholder="HDFC Bank" className={inputCls(errors.bank_name, false)} />
                        {errors.bank_name && <p className="text-red-600 text-xs mt-1">{errors.bank_name}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">Account Number *</label>
                        <input type="text" name="account_number" value={formData.account_number} onChange={handleInputChange} onBlur={() => handleBlur('account_number')} placeholder="5010000000000" className={inputCls(errors.account_number, false)} />
                        {errors.account_number && <p className="text-red-600 text-xs mt-1">{errors.account_number}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-secondary-700 mb-1">IFSC Code *</label>
                        <input type="text" name="ifsc_code" maxLength={11} value={formData.ifsc_code} onChange={handleInputChange} onBlur={() => handleBlur('ifsc_code')} placeholder="HDFC0001234" className={`${inputCls(errors.ifsc_code, false)} font-mono`} />
                        {errors.ifsc_code && <p className="text-red-600 text-xs mt-1">{errors.ifsc_code}</p>}
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-secondary-700">
                        <input type="checkbox" name="terms_accepted" checked={formData.terms_accepted} onChange={handleInputChange} className="w-4 h-4 rounded text-primary-600" />
                        <span>I accept Velqino supplier terms of service and direct settlement policies.</span>
                      </label>
                      {errors.terms_accepted && <p className="text-red-600 text-xs mt-1">{errors.terms_accepted}</p>}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                  {currentStep > 1 ? (
                    <button type="button" onClick={handlePrevious} className="px-5 py-2.5 rounded-xl border border-secondary-200 text-secondary-700 font-semibold text-xs sm:text-sm hover:bg-secondary-50">
                      ← Back
                    </button>
                  ) : <div />}

                  {currentStep < 5 ? (
                    <button type="button" onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md">
                      <span>Continue</span> <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md disabled:opacity-60">
                      {isLoading ? <><Loader2 size={16} className="animate-spin" /><span>Submitting...</span></> : <><span>Complete Registration</span><Check size={16} /></>}
                    </button>
                  )}
                </div>

                {/* Sign-in prompt directly below form */}
                <div className="pt-3 text-center border-t border-secondary-100">
                  <p className="text-xs sm:text-sm text-secondary-600">
                    Already registered?{' '}
                    <button type="button" onClick={() => setIsLoginModalOpen(true)} className="text-primary-600 hover:text-primary-700 font-bold hover:underline">
                      Sign in to Wholesaler Portal
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column (35-40%): Sticky Sidebar on Laptop - hidden on mobile */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20 space-y-5">
            {/* Value Proposition Banner */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-6 text-white shadow-xl space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Building size={22} className="text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-200">Velqino Supplier Hub</span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">Wholesale Supplier Network</h3>
                <p className="text-xs text-primary-100/90 mt-1 leading-relaxed">
                  Reach verified retail store owners across India with automated order dispatch and fast settlements.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/15 text-xs text-white/95">
                <div className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-primary-200 flex-shrink-0 mt-0.5" />
                  <span><strong>10,000+ Retail Buyers:</strong> Direct B2B orders without middlemen.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-primary-200 flex-shrink-0 mt-0.5" />
                  <span><strong>Guaranteed Payouts:</strong> Direct settlements upon verified delivery.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-primary-200 flex-shrink-0 mt-0.5" />
                  <span><strong>Automated Invoicing:</strong> Compliant GST & E-Way bills generated per order.</span>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-3xl p-5 border border-secondary-200/80 shadow-md">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-secondary-100">
                <h4 className="text-xs font-bold text-secondary-900 uppercase tracking-wider">Onboarding Checklist</h4>
                <span className="text-xs font-bold text-primary-600">{currentStep} / 5 Completed</span>
              </div>
              <div className="space-y-2">
                {steps.map(s => {
                  const isPassed = currentStep > s.number;
                  const isCurrent = currentStep === s.number;
                  return (
                    <div
                      key={s.number}
                      className={`flex items-center gap-2.5 p-2 rounded-xl text-xs transition-all ${
                        isCurrent ? 'bg-primary-50 border border-primary-200 text-primary-900 font-bold' : isPassed ? 'bg-secondary-50 text-secondary-700 font-medium' : 'text-secondary-400 opacity-60'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                        isPassed ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-primary-600 text-white' : 'bg-secondary-200 text-secondary-500'
                      }`}>
                        {isPassed ? <Check size={13} /> : s.number}
                      </div>
                      <span className="flex-1">{s.name}</span>
                      {isCurrent && <span className="text-[10px] font-bold text-primary-600 uppercase px-1.5 py-0.5 rounded bg-primary-100">Active</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Protection Guarantee */}
            <div className="bg-secondary-50/70 rounded-3xl p-5 border border-secondary-200/80 space-y-2 text-xs text-secondary-600 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-secondary-900">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Supplier Protection Guarantee</span>
              </div>
              <p>Velqino verifies retail buyers before orders are placed. All payments are secured in escrow and settled promptly into your bank account.</p>
            </div>
          </div>
        </div>
      </div>

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
