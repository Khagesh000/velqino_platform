"use client";

import React from 'react';
import { MapPin, Truck, CreditCard, ShieldCheck, CheckCircle } from '@/utils/icons';

export default function CheckoutSteps({ currentStep, setCurrentStep }) {
  const steps = [
    { id: 1, name: 'Address', icon: MapPin },
    { id: 2, name: 'Delivery & Payment', icon: CreditCard },
    { id: 3, name: 'Confirm Order', icon: ShieldCheck }
    /* Future Hub Logistics 4-step flow (uncomment when backend hub API is implemented):
    { id: 1, name: 'Delivery Hub', icon: MapPin },
    { id: 2, name: 'Freight Speed', icon: Truck },
    { id: 3, name: 'Payment Method', icon: CreditCard },
    { id: 4, name: 'Escrow Confirm', icon: ShieldCheck }
    */
  ];

  return (
    <div className="checkout-stepper">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <React.Fragment key={step.id}>
            <div 
              className={`step-item ${isActive ? 'step-active' : ''} ${isCompleted ? 'step-completed' : ''}`}
              onClick={() => isCompleted && setCurrentStep(step.id)}
              role="button"
              tabIndex={isCompleted ? 0 : -1}
              title={isCompleted ? `Return to ${step.name}` : step.name}
            >
              <div className="step-number">
                {isCompleted ? <CheckCircle size={13} className="text-emerald-600" /> : step.id}
              </div>
              <span className="hidden sm:inline">{step.name}</span>
            </div>

            {index < steps.length - 1 && (
              <div 
                className={`step-divider ${currentStep > step.id ? 'step-divider-active' : ''}`} 
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
