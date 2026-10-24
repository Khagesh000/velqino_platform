"use client";

import React from 'react';
import { Check } from '@/utils/icons';

const FIT_OPTIONS = [
  { key: 'slim', label: 'Slim Fit', desc: 'Contoured athletic torso taper' },
  { key: 'regular', label: 'Regular Fit', desc: 'Natural standard drape' },
  { key: 'relaxed', label: 'Relaxed Fit', desc: 'Easy comfortable room' },
  { key: 'oversized', label: 'Oversized', desc: 'Dropped shoulder boxy silhouette' },
];

const TUCK_OPTIONS = [
  { key: 'untucked', label: 'Untucked', desc: 'Casual drape over waist' },
  { key: 'tucked', label: 'Tucked In', desc: 'Clean waistline fold' },
];

const BACKDROP_OPTIONS = [
  { key: 'pure_white', label: 'Pure White (#FFFFFF)', desc: 'Amazon / Myntra standard' },
  { key: 'soft_shadow', label: 'Soft Shadow Studio', desc: 'Commercial catalog lighting' },
  { key: 'warm_canvas', label: 'Warm Brand Canvas', desc: 'Velqino premium aesthetic' },
  { key: 'transparent', label: 'Transparent PNG', desc: 'For graphic banners' },
];

const ALL_ANGLES = [
  { key: 'front', label: 'Front 0°' },
  { key: 'back', label: 'Back 180°' },
  { key: 'left_three_quarter', label: 'Left 3/4 (-45°)' },
  { key: 'right_three_quarter', label: 'Right 3/4 (+45°)' },
  { key: 'left_side', label: 'Left Profile (-90°)' },
  { key: 'right_side', label: 'Right Profile (+90°)' },
];

export default function StudioControls({
  fitSilhouette,
  onChangeFitSilhouette,
  tuckStyle,
  onChangeTuckStyle,
  backdropStyle,
  onChangeBackdropStyle,
  selectedAngles,
  onToggleAngle,
  onSelectAllAngles,
  onSelectFrontBackOnly,
}) {
  const isAllSelected = selectedAngles.length === ALL_ANGLES.length;
  const isFrontBackOnly = selectedAngles.length === 2 && selectedAngles.includes('front') && selectedAngles.includes('back');

  return (
    <div className="studio-card">
      {/* Step Header */}
      <div className="card-step-header">
        <div className="step-label-group">
          <div className="step-number">3</div>
          <div className="step-title">Fit, Drape & Studio Camera</div>
        </div>
        <div className="step-badge">
          Custom Shading
        </div>
      </div>

      {/* Fit Silhouette */}
      <div className="filter-row">
        <div className="filter-label">
          <span>Garment Fit Silhouette</span>
        </div>
        <div className="filter-chips">
          {FIT_OPTIONS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`fit-chip-btn ${fitSilhouette === f.key ? 'active' : ''}`}
              onClick={() => onChangeFitSilhouette(f.key)}
              title={f.desc}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tuck Style */}
      <div className="filter-row">
        <div className="filter-label">
          <span>Tucking & Hem Style</span>
        </div>
        <div className="filter-chips">
          {TUCK_OPTIONS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`fit-chip-btn ${tuckStyle === t.key ? 'active' : ''}`}
              onClick={() => onChangeTuckStyle(t.key)}
              title={t.desc}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Studio Backdrop */}
      <div className="filter-row">
        <div className="filter-label">
          <span>Studio Lighting Backdrop</span>
        </div>
        <div className="filter-chips">
          {BACKDROP_OPTIONS.map((b) => (
            <button
              key={b.key}
              type="button"
              className={`fit-chip-btn ${backdropStyle === b.key ? 'active' : ''}`}
              onClick={() => onChangeBackdropStyle(b.key)}
              title={b.desc}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Angles Selection */}
      <div className="filter-row mb-0">
        <div className="filter-label">
          <span>Angles to Generate</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`angle-quick-link ${isAllSelected ? 'active' : ''}`}
              onClick={onSelectAllAngles}
            >
              All 6 Angles
            </button>
            <span className="text-gray-300 text-xs">|</span>
            <button
              type="button"
              className={`angle-quick-link ${isFrontBackOnly ? 'active' : ''}`}
              onClick={onSelectFrontBackOnly}
            >
              Front & Back Only
            </button>
          </div>
        </div>

        <div className="filter-chips">
          {ALL_ANGLES.map((ang) => {
            const isChecked = selectedAngles.includes(ang.key);
            return (
              <button
                key={ang.key}
                type="button"
                className={`fit-chip-btn ${isChecked ? 'active' : ''}`}
                onClick={() => onToggleAngle(ang.key)}
              >
                {isChecked && <Check size={12} className="inline mr-1" />}
                {ang.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
