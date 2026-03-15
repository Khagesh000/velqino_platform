'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Building, User, MapPin, Package, CreditCard, Check, Upload } from 'lucide-react';
import { useRegisterWholesalerMutation } from '@/redux/wholesaler/slices/wholesalerSlice';

export default function RegistrationForm() {
  
  const [registerWholesaler, {  loading, error, isSuccess,  }] = useRegisterWholesalerMutation();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    
    // Business Info
    businessName: '',
    businessType: '',
    gstNumber: '',
    panNumber: '',
    businessDesc: '',
    
    // Address
    shopAddress: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    
    // Product Categories
    categories: [],
    moq: '',
    priceRange: '',
    
    // Bank Details
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    
    // Password (for registration)
    password: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    "Men's Clothing",
    "Women's Clothing", 
    "Kids Wear",
    "Footwear",
    "Accessories",
    "Traditional Wear",
    "Western Wear"
  ];

  const businessTypes = [
    "Manufacturer",
    "Wholesaler", 
    "Distributor",
    "Retailer"
  ];

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  
  // Clear error for this field when user starts typing
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

const handleCategoryToggle = (category) => {
  setFormData(prev => ({
    ...prev,
    categories: prev.categories.includes(category)
      ? prev.categories.filter(c => c !== category)
      : [...prev.categories, category]
  }));
  
  // Clear categories error when user toggles selection
  if (errors.categories) {
    setErrors(prev => ({ ...prev, categories: '' }));
  }
};

  const validateStep = (step) => {
  const newErrors = {};
  
  switch(step) {
    case 1:
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
      else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Enter valid 10-digit number';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter valid email';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (!otpSent || !otp) newErrors.otp = 'Please verify OTP';
      break;
      
    case 2:
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      break;
      
    case 3:
      if (!formData.shopAddress) newErrors.shopAddress = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.pincode) newErrors.pincode = 'Pincode is required';
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';
      break;
      
    case 4:
      if (formData.categories.length === 0) newErrors.categories = 'Select at least one category';
      break;
      
    case 5:
      // Optional validation for bank details
      break;
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleNext = () => {
  if (validateStep(currentStep)) {
    setCurrentStep(currentStep + 1);
    setErrors({}); // Clear errors when moving to next step
  }
};

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Line 68-75 - Replace handleSubmit with:
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Basic validation
  if (!formData.email || !formData.password || !formData.businessName) {
    alert('Please fill required fields');
    return;
  }
  
  // Call the mutation directly, not dispatch
  registerWholesaler(formData);
};

  useEffect(() => {
  if (isSuccess) {
    alert('Registration successful!');
    // Reset form
    setFormData({
      firstName: '', lastName: '', mobile: '', email: '', password: '',
      businessName: '', businessType: '', gstNumber: '', panNumber: '',
      businessDesc: '', shopAddress: '', city: '', state: '',
      pincode: '', landmark: '', categories: [], moq: '', priceRange: '',
      accountHolder: '', bankName: '', accountNumber: '', ifscCode: '', upiId: ''
    });
    setCurrentStep(1);
    setOtpSent(false);
    setOtp('');
    // Remove this line: dispatch(clearSuccess());
  }
}, [isSuccess]); // Remove dispatch from dependency array

// Line 99-103 - Replace error useEffect with:
useEffect(() => {
  if (error) {
    alert(`Error: ${error?.data?.message || error?.message || 'Registration failed'}`);
    // Remove this line: dispatch(clearError());
  }
}, [error]);

  const steps = [
    { number: 1, name: 'Personal Info', icon: User },
    { number: 2, name: 'Business Info', icon: Building },
    { number: 3, name: 'Address', icon: MapPin },
    { number: 4, name: 'Products', icon: Package },
    { number: 5, name: 'Bank Details', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">Vendor Registration</h2>
          <p className="text-secondary text-lg">Join as a wholesale partner and grow your business</p>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-secondary">Submitting registration...</p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 text-center relative z-10">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep > step.number 
                      ? 'bg-accent-500 border-accent-500 text-inverse' 
                      : currentStep === step.number
                      ? 'border-primary-500 bg-primary-500 text-inverse'
                      : 'border-medium bg-surface-1 text-secondary'
                  }`}>
                    {currentStep > step.number ? <Check size={20} /> : <step.icon size={20} />}
                  </div>
                  <span className={`text-xs sm:text-sm mt-2 hidden sm:block ${
                    currentStep >= step.number ? 'text-primary-600 font-medium' : 'text-tertiary'
                  }`}>
                    {step.name}
                  </span>
                </div>
              </div>
            ))}
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-medium -z-10">
              <div 
                className="h-full bg-accent-500 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-radius-2xl border-2 border-medium shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
  {/* Step 1: Personal Information */}
  {currentStep === 1 && (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-primary-600 mb-6">Personal Information</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-text-secondary font-medium mb-2">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
              errors.firstName ? 'border-error-500' : 'border-medium focus:border-focus'
            }`}
            placeholder="Enter first name"
            required
          />
          {errors.firstName && (
            <p className="text-error-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-text-secondary font-medium mb-2">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
              errors.lastName ? 'border-error-500' : 'border-medium focus:border-focus'
            }`}
            placeholder="Enter last name"
            required
          />
          {errors.lastName && (
            <p className="text-error-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-text-secondary font-medium mb-2">Mobile Number *</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
              errors.mobile ? 'border-error-500' : 'border-medium focus:border-focus'
            }`}
            placeholder="Enter 10 digit number"
            maxLength="10"
            required
          />
          {errors.mobile && (
            <p className="text-error-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>
        
        <div>
          <label className="block text-text-secondary font-medium mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
              errors.email ? 'border-error-500' : 'border-medium focus:border-focus'
            }`}
            placeholder="Enter email address"
            required
          />
          {errors.email && (
            <p className="text-error-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-text-secondary font-medium mb-2">Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.password ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Create a password"
          required
        />
        {errors.password && (
          <p className="text-error-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* OTP Section */}
      <div className="bg-primary-50 p-6 rounded-radius-xl border-2 border-primary-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary text-center sm:text-left tracking-widest font-mono ${
                errors.otp ? 'border-error-500' : 'border-medium focus:border-focus'
              }`}
              maxLength="6"
              disabled={!otpSent}
            />
          </div>
          <button
            type="button"
            onClick={() => setOtpSent(true)}
            className="px-6 py-3 bg-accent-500 text-text-inverse rounded-radius-lg font-medium hover:bg-accent-600 transition-fast whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formData.mobile || !formData.email}
          >
            {otpSent ? 'Resend OTP' : 'Send OTP'}
          </button>
        </div>
        {errors.otp && (
          <p className="text-error-500 text-sm mt-2">{errors.otp}</p>
        )}
        {otpSent && !errors.otp && (
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-text-tertiary">
              OTP sent to {formData.mobile}
            </p>
            <p className="text-xs text-accent-600 cursor-pointer hover:underline">
              Change number?
            </p>
          </div>
        )}
      </div>
    </div>
  )}

  {/* Step 2: Business Information */}
  {currentStep === 2 && (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-primary-600 mb-6">Business Information</h3>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">Business/Store Name *</label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.businessName ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter business name"
          required
        />
        {errors.businessName && (
          <p className="text-error-500 text-sm mt-1">{errors.businessName}</p>
        )}
      </div>

      <div>
        <label className="block text-text-secondary font-medium mb-2">Business Type *</label>
        <select
          name="businessType"
          value={formData.businessType}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.businessType ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          required
        >
          <option value="">Select business type</option>
          {businessTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.businessType && (
          <p className="text-error-500 text-sm mt-1">{errors.businessType}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-text-secondary font-medium mb-2">GST Number</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
            placeholder="Enter GST number"
          />
        </div>
        
        <div>
          <label className="block text-text-secondary font-medium mb-2">PAN Number</label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
            placeholder="Enter PAN number"
          />
        </div>
      </div>

      <div>
        <label className="block text-text-secondary font-medium mb-2">Business Description</label>
        <textarea
          name="businessDesc"
          value={formData.businessDesc}
          onChange={handleInputChange}
          rows="3"
          className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
          placeholder="Tell us about your business..."
        />
      </div>
    </div>
  )}

  {/* Step 3: Address Details */}
  {currentStep === 3 && (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-primary-600 mb-6">Address Details</h3>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">Shop/Office Address *</label>
        <input
          type="text"
          name="shopAddress"
          value={formData.shopAddress}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
            errors.shopAddress ? 'border-error-500' : 'border-medium focus:border-focus'
          }`}
          placeholder="Enter full address"
          required
        />
        {errors.shopAddress && (
          <p className="text-error-500 text-sm mt-1">{errors.shopAddress}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-text-secondary font-medium mb-2">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
              errors.city ? 'border-error-500' : 'border-medium focus:border-focus'
            }`}
            placeholder="Enter city"
            required
          />
          {errors.city && (
            <p className="text-error-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>
        
        <div>
          <label className="block text-text-secondary font-medium mb-2">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
              errors.state ? 'border-error-500' : 'border-medium focus:border-focus'
            }`}
            placeholder="Enter state"
            required
          />
          {errors.state && (
            <p className="text-error-500 text-sm mt-1">{errors.state}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-text-secondary font-medium mb-2">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-radius-lg focus:outline-none bg-surface-1 text-text-primary ${
              errors.pincode ? 'border-error-500' : 'border-medium focus:border-focus'
            }`}
            placeholder="Enter pincode"
            maxLength="6"
            required
          />
          {errors.pincode && (
            <p className="text-error-500 text-sm mt-1">{errors.pincode}</p>
          )}
        </div>
        
        <div>
          <label className="block text-text-secondary font-medium mb-2">Landmark</label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
            placeholder="Nearby landmark"
          />
        </div>
      </div>
    </div>
  )}

  {/* Step 4: Product Categories */}
  {currentStep === 4 && (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-primary-600 mb-6">Product Categories</h3>
      
      <div>
        <label className="block text-text-secondary font-medium mb-3">Select Categories</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map(category => (
            <label
              key={category}
              className={`flex items-center p-3 border-2 rounded-radius-lg cursor-pointer transition-all ${
                formData.categories.includes(category)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-medium hover:border-primary-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.categories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-primary-500 border-2 border-medium rounded focus:ring-primary-300"
              />
              <span className="ml-3 text-text-primary">{category}</span>
            </label>
          ))}
        </div>
        {errors.categories && (
          <p className="text-error-500 text-sm mt-2">{errors.categories}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-text-secondary font-medium mb-2">Minimum Order Quantity</label>
          <input
            type="number"
            name="moq"
            value={formData.moq}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
            placeholder="Enter MOQ"
          />
        </div>
        
        <div>
          <label className="block text-text-secondary font-medium mb-2">Price Range</label>
          <select
            name="priceRange"
            value={formData.priceRange}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
          >
            <option value="">Select price range</option>
            <option value="budget">Budget (Under ₹500)</option>
            <option value="mid">Mid-range (₹500 - ₹2000)</option>
            <option value="premium">Premium (₹2000 - ₹5000)</option>
            <option value="luxury">Luxury (₹5000+)</option>
          </select>
        </div>
      </div>
    </div>
  )}

  {/* Step 5: Bank Details */}
  {currentStep === 5 && (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-primary-600 mb-6">Bank Details</h3>
      
      <div>
        <label className="block text-text-secondary font-medium mb-2">Account Holder Name</label>
        <input
          type="text"
          name="accountHolder"
          value={formData.accountHolder}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
          placeholder="Enter account holder name"
        />
      </div>

      <div>
        <label className="block text-text-secondary font-medium mb-2">Bank Name</label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
          placeholder="Enter bank name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-text-secondary font-medium mb-2">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
            placeholder="Enter account number"
          />
        </div>
        
        <div>
          <label className="block text-text-secondary font-medium mb-2">IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
            placeholder="Enter IFSC code"
          />
        </div>
      </div>

      <div>
        <label className="block text-text-secondary font-medium mb-2">UPI ID (Optional)</label>
        <input
          type="text"
          name="upiId"
          value={formData.upiId}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-medium rounded-radius-lg focus:border-focus focus:outline-none bg-surface-1 text-text-primary"
          placeholder="Enter UPI ID"
        />
      </div>

      {/* Document Upload */}
      <div className="border-2 border-dashed border-medium rounded-radius-xl p-6 text-center hover:border-primary-400 transition-all cursor-pointer">
        <Upload className="mx-auto text-text-tertiary mb-2" size={32} />
        <p className="text-text-secondary font-medium">Upload Cancelled Cheque</p>
        <p className="text-xs text-text-tertiary mt-1">PDF or Image (Max 2MB)</p>
      </div>
    </div>
  )}

  {/* Navigation Buttons */}
  <div className="flex justify-between mt-8 pt-6 border-t border-light">
    <button
      type="button"
      onClick={handlePrevious}
      className={`flex items-center gap-2 px-6 py-3 rounded-radius-lg border-2 border-medium text-text-secondary hover:bg-primary-100 transition-fast ${
        currentStep === 1 ? 'invisible' : ''
      }`}
    >
      <ChevronLeft size={20} />
      Previous
    </button>
    
    {currentStep === 5 ? (
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center gap-2 px-8 py-3 bg-accent-500 text-text-inverse rounded-radius-lg font-medium hover:bg-accent-600 transition-fast disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Submitting...' : 'Submit'}
        {!isLoading && <Check size={20} />}
      </button>
    ) : (
      <button
        type="button"
        onClick={handleNext}
        className="flex items-center gap-2 px-8 py-3 bg-primary-500 text-text-inverse rounded-radius-lg font-medium hover:bg-primary-600 transition-fast"
      >
        Next
        <ChevronRight size={20} />
      </button>
    )}
  </div>
</form>
        </div>
      </div>
    </div>
  );
}