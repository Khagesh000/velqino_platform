"use client";

import React, { useMemo } from 'react';
import { Check, User, Users, Sparkles } from '@/utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

const SKIN_TONES = [
  { key: 'all', label: 'All Tones', color: null },
  { key: 'fair', label: 'Fair / Porcelain', color: '#F3D2C1' },
  { key: 'olive', label: 'Warm Olive', color: '#DDB892' },
  { key: 'tan', label: 'Golden Tan', color: '#C68B59' },
  { key: 'bronze', label: 'Rich Bronze', color: '#8D5B4C' },
  { key: 'dark', label: 'Deep Espresso', color: '#4A3428' },
];

const BODY_FITS = [
  { key: 'all', label: 'All Builds' },
  { key: 'athletic', label: 'Athletic / Toned' },
  { key: 'regular', label: 'Classic Regular' },
  { key: 'slim', label: 'Modern Slim' },
  { key: 'curvy', label: 'Curvy / Fit' },
];

export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const base = BASE_IMAGE_URL || 'http://localhost:8000';
  return `${base}${url}`;
};

export default function ModelSelector({
  models = [],
  selectedModel,
  onSelectModel,
  activeDemographic,
  onChangeDemographic,
  activeSkinTone,
  onChangeSkinTone,
  activeBodyType,
  onChangeBodyType,
  isLoading = false
}) {
  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      const matchDemo = !activeDemographic || m.demographic === activeDemographic;
      const matchSkin = activeSkinTone === 'all' || m.skin_tone === activeSkinTone;
      const matchFit = activeBodyType === 'all' || m.body_type === activeBodyType;
      return matchDemo && matchSkin && matchFit;
    });
  }, [models, activeDemographic, activeSkinTone, activeBodyType]);

  const demoCounts = useMemo(() => {
    const counts = { men: 0, women: 0, kids: 0 };
    models.forEach((m) => {
      if (counts[m.demographic] !== undefined) {
        counts[m.demographic]++;
      }
    });
    return counts;
  }, [models]);

  return (
    <div className="studio-card">
      {/* Step Header */}
      <div className="card-step-header">
        <div className="step-label-group">
          <div className="step-number">1</div>
          <div className="step-title">Select AI Human Model</div>
        </div>
        <div className="step-badge">
          6 Angles Included • Faceless Focus
        </div>
      </div>

      {/* Demographic Tabs */}
      <div className="demographic-tab-group">
        <button
          type="button"
          className={`demo-tab-btn ${activeDemographic === 'men' ? 'active' : ''}`}
          onClick={() => onChangeDemographic('men')}
        >
          <User size={15} />
          <span>Men ({demoCounts.men || 5})</span>
        </button>

        <button
          type="button"
          className={`demo-tab-btn ${activeDemographic === 'women' ? 'active' : ''}`}
          onClick={() => onChangeDemographic('women')}
        >
          <Users size={15} />
          <span>Women ({demoCounts.women || 5})</span>
        </button>

        <button
          type="button"
          className={`demo-tab-btn ${activeDemographic === 'kids' ? 'active' : ''}`}
          onClick={() => onChangeDemographic('kids')}
        >
          <Sparkles size={15} />
          <span>Kids ({demoCounts.kids || 5})</span>
        </button>
      </div>

      {/* Skin Tone Chips */}
      <div className="filter-row">
        <div className="filter-label">
          <span>Realistic Skin Undertones</span>
          <span className="text-[11px] normal-case text-gray-500">
            Natural skin preserved across all 6 angles
          </span>
        </div>
        <div className="filter-chips">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone.key}
              type="button"
              className={`skin-chip-btn ${activeSkinTone === tone.key ? 'active' : ''}`}
              onClick={() => onChangeSkinTone(tone.key)}
            >
              {tone.color && (
                <span
                  className="color-dot"
                  style={{ backgroundColor: tone.color }}
                />
              )}
              <span>{tone.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body Fit Chips */}
      <div className="filter-row">
        <div className="filter-label">
          <span>Body Fit & Physique</span>
        </div>
        <div className="filter-chips">
          {BODY_FITS.map((fit) => (
            <button
              key={fit.key}
              type="button"
              className={`fit-chip-btn ${activeBodyType === fit.key ? 'active' : ''}`}
              onClick={() => onChangeBodyType(fit.key)}
            >
              {fit.label}
            </button>
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div className="models-grid">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            Loading AI Studio human models...
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            No models match the selected filter. Try selecting "All Tones".
          </div>
        ) : (
          filteredModels.map((model) => {
            const isSelected = selectedModel?.slug === model.slug;
            const previewUrl = resolveImageUrl(model.preview_image_url);

            return (
              <div
                key={model.slug}
                className={`model-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectModel(model)}
              >
                {isSelected && (
                  <div className="select-check">
                    <Check size={13} strokeWidth={3} />
                  </div>
                )}

                <div className="model-img-wrapper">
                  <img
                    src={previewUrl}
                    alt={model.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/favicon.ico';
                    }}
                  />
                </div>

                <div className="model-info">
                  <div className="model-name" title={model.name}>
                    {model.name}
                  </div>
                  <div className="model-meta-row">
                    <span
                      className="skin-indicator"
                      style={{ backgroundColor: model.skin_hex }}
                    />
                    <span className="model-tone-text">{model.skin_tone_label}</span>
                  </div>
                  <div className="model-stats">
                    <span>{model.height_cm} cm</span>
                    <span className="uppercase">{model.body_type}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
