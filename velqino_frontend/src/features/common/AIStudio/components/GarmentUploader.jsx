"use client";

import React, { useRef, useState } from 'react';
import { Upload, X, Package, Sparkles, Image as ImageIcon } from '@/utils/icons';

const SAMPLE_PRESETS = [
  {
    name: 'Plain White Crewneck',
    type: 'top',
    frontUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    backUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Midnight Black Polo',
    type: 'top',
    frontUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    backUrl: null,
  },
  {
    name: 'Olive Cotton T-Shirt',
    type: 'top',
    frontUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    backUrl: null,
  },
  {
    name: 'Classic Chinos / Pants',
    type: 'bottom',
    frontUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    backUrl: null,
  },
];

export default function GarmentUploader({
  frontImage,
  frontPreview,
  onFrontChange,
  onFrontRemove,
  backImage,
  backPreview,
  onBackChange,
  onBackRemove,
  garmentType,
  onChangeGarmentType,
  selectedProduct,
  onOpenCatalogModal,
}) {
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);
  const [activeMode, setActiveMode] = useState('upload');

  const handleFrontFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onFrontChange(file, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onBackChange(file, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadPreset = (preset) => {
    onChangeGarmentType(preset.type);
    onFrontChange(null, preset.frontUrl);
    if (preset.backUrl) {
      onBackChange(null, preset.backUrl);
    } else {
      onBackRemove();
    }
  };

  return (
    <div className="studio-card garment-upload-container">
      {/* Step Header */}
      <div className="card-step-header">
        <div className="step-label-group">
          <div className="step-number">2</div>
          <div className="step-title">Garment Photos (Front & Back)</div>
        </div>
        <div className="step-badge">
          Dual-Angle Fitting
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="mode-toggle">
        <button
          type="button"
          className={`mode-btn ${activeMode === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveMode('upload')}
        >
          <Upload size={15} />
          <span>Upload Custom Photos</span>
        </button>

        <button
          type="button"
          className={`mode-btn ${activeMode === 'catalog' ? 'active' : ''}`}
          onClick={() => {
            setActiveMode('catalog');
            onOpenCatalogModal();
          }}
        >
          <Package size={15} />
          <span>
            {selectedProduct ? `Selected: ${selectedProduct.name}` : 'Pick from Store Catalog'}
          </span>
        </button>
      </div>

      {/* Garment Category Tabs */}
      <div className="filter-row">
        <div className="filter-label">
          <span>Garment Category</span>
        </div>
        <div className="filter-chips">
          <button
            type="button"
            className={`fit-chip-btn ${garmentType === 'top' ? 'active' : ''}`}
            onClick={() => onChangeGarmentType('top')}
          >
            Topwear (Shirts, T-Shirts, Polos)
          </button>
          <button
            type="button"
            className={`fit-chip-btn ${garmentType === 'bottom' ? 'active' : ''}`}
            onClick={() => onChangeGarmentType('bottom')}
          >
            Bottomwear (Pants, Trousers, Shorts)
          </button>
          <button
            type="button"
            className={`fit-chip-btn ${garmentType === 'outfit' ? 'active' : ''}`}
            onClick={() => onChangeGarmentType('outfit')}
          >
            Full Outfit (Set)
          </button>
        </div>
      </div>

      {/* Dual Dropzone: Front View & Back View */}
      <div className="dropzones-grid dual-dropzone-grid grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
        {/* Front Dropzone */}
        <div
          className={`dropzone-box ${frontPreview ? 'has-image has-file' : ''}`}
          onClick={() => !frontPreview && frontInputRef.current?.click()}
        >
          <input
            ref={frontInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFrontFile}
          />

          <div className="dropzone-tag dropzone-badge primary">
            Frontside Photo (Required)
          </div>

          {frontPreview ? (
            <div className="preview-pane preview-thumb-box">
              <img
                src={frontPreview}
                alt="Front Garment"
              />
              <button
                type="button"
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onFrontRemove();
                }}
                title="Remove Front Image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <Upload size={24} />
              </div>
              <div className="upload-title">
                Upload Plain Shirt / Front View
              </div>
              <div className="upload-sub">
                PNG, JPG, WebP up to 15MB
              </div>
            </>
          )}
        </div>

        {/* Back Dropzone */}
        <div
          className={`dropzone-box ${backPreview ? 'has-image has-file' : ''}`}
          onClick={() => !backPreview && backInputRef.current?.click()}
        >
          <input
            ref={backInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBackFile}
          />

          <div className="dropzone-tag optional-tag dropzone-badge secondary">
            Backside Photo (Recommended)
          </div>

          {backPreview ? (
            <div className="preview-pane preview-thumb-box">
              <img
                src={backPreview}
                alt="Back Garment"
              />
              <button
                type="button"
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onBackRemove();
                }}
                title="Remove Back Image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <ImageIcon size={24} />
              </div>
              <div className="upload-title">
                Upload Backside View
              </div>
              <div className="upload-sub">
                Auto-synthesized if left empty
              </div>
            </>
          )}
        </div>
      </div>

      {/* 1-Click Plain Presets */}
      <div className="sample-garments-row">
        <div className="sample-label">
          <Sparkles size={14} className="inline mr-1" />
          Quick Test with Plain Presets:
        </div>
        <div className="sample-buttons">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className="sample-btn"
              onClick={() => loadPreset(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
