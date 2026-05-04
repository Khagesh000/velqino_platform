"use client";

import React from 'react';
import { MapPin, CreditCard, CheckCircle } from '../../../../../utils/icons';

export default function CheckoutSteps({ currentStep, setCurrentStep }) {
  const steps = [
    { id: 1, name: 'Address', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Confirm', icon: CheckCircle }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => currentStep >= step.id && setCurrentStep(step.id)}>
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${currentStep >= step.id 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'}
              `}>
                {currentStep > step.id ? <CheckCircle size={18} /> : step.id}
              </div>
              <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'}`}>
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                <div className={`h-full bg-primary-500 transition-all duration-300 ${currentStep > step.id ? 'w-full' : 'w-0'}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}