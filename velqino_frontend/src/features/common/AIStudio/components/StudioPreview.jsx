"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Maximize2, 
  Package, 
  Check, 
  RefreshCw,
  X
} from '@/utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

const ANGLE_KEYS_ORDER = [
  'front',
  'left_three_quarter',
  'left_side',
  'back',
  'right_side',
  'right_three_quarter',
];

const ANGLE_NAMES = {
  front: 'Front (0°)',
  back: 'Back (180°)',
  left_three_quarter: 'Left 3/4 (-45°)',
  right_three_quarter: 'Right 3/4 (+45°)',
  left_side: 'Left Profile (-90°)',
  right_side: 'Right Profile (+90°)',
};

const ANGLE_DISPLAY_MAP = {
  front: { label: 'Front', deg: '0°' },
  left_three_quarter: { label: 'Left ¾', deg: '-45°' },
  left_side: { label: 'Left Profile', deg: '-90°' },
  back: { label: 'Back', deg: '180°' },
  right_side: { label: 'Right Profile', deg: '+90°' },
  right_three_quarter: { label: 'Right ¾', deg: '+45°' },
};

export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const base = BASE_IMAGE_URL || 'http://localhost:8000';
  return `${base}${url}`;
};

export default function StudioPreview({
  selectedModel,
  renders = [],
  activeAngleKey,
  onSelectAngle,
  isGenerating = false,
  generationPhase = '',
  canGenerate = false,
  onGenerate,
  onDownloadAll,
  onDownloadFrontBack,
  onOpenExportModal,
  sellerRole = 'retailer'
}) {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Active render or base model angle
  const activeRender = renders.find((r) => r.angle_key === activeAngleKey) || renders[0];
  const modelBaseAngle = selectedModel?.angles?.find((a) => a.angle_key === activeAngleKey);
  const fallbackModelUrl = modelBaseAngle?.base_image_url || selectedModel?.preview_image_url;

  const displayImageUrl = activeRender?.base64_url
    ? activeRender.base64_url
    : activeRender?.image_url
    ? resolveImageUrl(activeRender.image_url)
    : fallbackModelUrl
    ? resolveImageUrl(fallbackModelUrl)
    : null;

  const hasRenders = renders.length > 0;

  return (
    <div className="studio-showcase-panel">
      {/* Viewer Header */}
      <div className="viewer-header">
        <div className="viewer-title-group">
          <div className="live-dot" />
          <div className="viewer-title">
            {hasRenders ? 'AI Studio Photoshoot' : 'Model Live Preview'}
          </div>
        </div>
        <div className="angle-badge-current">
          {ANGLE_NAMES[activeAngleKey] || activeAngleKey}
        </div>
      </div>

      {/* Hero Viewer Canvas Box */}
      <div
        className="hero-viewer-box relative w-full h-[480px] bg-gradient-to-b from-white to-[#F5F2EF] border border-[#E2BB99]/35 rounded-2xl overflow-hidden"
        style={{
          position: 'relative',
          width: '100%',
          height: '480px',
          background: 'radial-gradient(circle, #FFFFFF 0%, #F5F2EF 100%)',
          border: '1px solid rgba(226, 187, 153, 0.35)',
          borderRadius: '1rem',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        {/* Generating Overlay Animation */}
        {isGenerating && (
          <div className="generating-overlay absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center z-20 p-6 text-center">
            <div className="spinner-ring w-12 h-12 border-4 border-[#CE8E6A]/25 border-t-[#CE8E6A] rounded-full animate-spin mb-4" />
            <div className="gen-step-text text-base font-bold text-gray-900">
              {generationPhase || 'Generating AI Photoshoot...'}
            </div>
            <div className="gen-progress-sub text-xs text-gray-600 mt-1">
              Fitting garment, calculating 3D body curvature & shading
            </div>
          </div>
        )}

        {displayImageUrl ? (
          <>
            <img
              src={displayImageUrl}
              alt={activeAngleKey}
              className="hero-image hero-render"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center top',
                display: 'block',
              }}
            />

            {/* Floating angle tag */}
            <div
              className="floating-angle-pill"
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(206, 142, 106, 0.35)',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#2D1F2C',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: '#CE8E6A', fontSize: '9px' }}>●</span>
              <span>
                {selectedModel?.name?.split(' - ')[0] || selectedModel?.name || 'Model'} • {ANGLE_NAMES[activeAngleKey] || activeAngleKey}
              </span>
            </div>

            {/* Zoom Inspection Button */}
            <button
              type="button"
              className="zoom-button zoom-inspect-btn"
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                zIndex: 10,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.94)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2D1F2C',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
              }}
              onClick={() => setIsZoomModalOpen(true)}
              title="Inspect High Resolution"
            >
              <Maximize2 size={16} />
            </button>
          </>
        ) : (
          <div className="empty-state-canvas empty-viewer-state flex flex-col items-center justify-center p-8 text-center text-gray-600">
            <div className="empty-icon-ring empty-icon w-16 h-16 rounded-full bg-[#FAF4E5] border border-dashed border-[#CE8E6A]/50 flex items-center justify-center text-[#B17A5B] mb-4">
              <Sparkles size={28} />
            </div>
            <div className="empty-title text-base font-bold text-gray-900">Ready for Virtual Try-On</div>
            <div className="empty-desc text-xs text-gray-600 mt-1 max-w-[280px]">
              Upload plain shirt or garment photos on the left, then click Generate to produce high-definition photos across all angles.
            </div>
          </div>
        )}
      </div>

      {/* 360° Angle Quick Switcher / Scrubber Strip */}
      <div
        className="angle-scrubber-bar"
        style={{
          marginTop: '1rem',
          background: '#FAF8F5',
          padding: '0.85rem 1rem',
          borderRadius: '1rem',
          border: '1px solid rgba(226, 187, 153, 0.35)',
        }}
      >
        <div
          className="scrubber-header scrubber-label-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.65rem',
          }}
        >
          <div
            className="scrubber-label"
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#2D1F2C',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Camera Angle Rotation</span>
          </div>
          <div
            className="scrubber-hint"
            style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#A25690',
              background: 'rgba(162, 86, 144, 0.1)',
              padding: '2px 10px',
              borderRadius: '9999px',
              border: '1px solid rgba(162, 86, 144, 0.25)',
            }}
          >
            {ANGLE_NAMES[activeAngleKey] || 'Front (0°)'}
          </div>
        </div>

        <div
          className="scrubber-chips angle-buttons-strip"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: '0.45rem',
          }}
        >
          {ANGLE_KEYS_ORDER.map((key) => {
            const isActive = activeAngleKey === key;
            const hasRenderForAngle = renders.some((r) => r.angle_key === key);
            const info = ANGLE_DISPLAY_MAP[key] || { label: key, deg: '' };

            return (
              <button
                key={key}
                type="button"
                className={`scrubber-chip angle-strip-btn ${isActive ? 'active' : ''} ${hasRenderForAngle ? 'has-render' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.55rem 0.25rem',
                  borderRadius: '0.75rem',
                  border: isActive
                    ? '1.5px solid #B17A5B'
                    : hasRenderForAngle
                    ? '1.5px solid rgba(34, 197, 94, 0.6)'
                    : '1px solid rgba(210, 200, 195, 0.7)',
                  background: isActive
                    ? '#CE8E6A'
                    : hasRenderForAngle
                    ? '#F0FDF4'
                    : '#FFFFFF',
                  color: isActive
                    ? '#FFFFFF'
                    : hasRenderForAngle
                    ? '#166534'
                    : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 6px rgba(206, 142, 106, 0.35)' : 'none',
                }}
                onClick={() => onSelectAngle(key)}
              >
                <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: 1.2 }}>
                  {info.label}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    opacity: isActive ? 0.9 : 0.65,
                    marginTop: '2px',
                    fontWeight: '500',
                  }}
                >
                  {info.deg}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Angle Gallery Strip (Rendered Results) */}
      {hasRenders && (
        <div className="angle-thumbs-gallery">
          {renders.map((render) => {
            const thumbUrl = render.base64_url ? render.base64_url : resolveImageUrl(render.image_url);
            const isActive = activeAngleKey === render.angle_key;
            return (
              <div
                key={render.angle_key}
                className={`angle-thumb-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectAngle(render.angle_key)}
              >
                <img src={thumbUrl} alt={render.angle_label} />
                <div className="thumb-tag">
                  {render.is_front ? 'FRONT' : render.is_back ? 'BACK' : render.angle_key.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions Footer */}
      <div className="preview-action-row studio-actions-footer">
        <button
          type="button"
          className="btn-generate-primary"
          disabled={!canGenerate || isGenerating}
          onClick={onGenerate}
        >
          <Sparkles size={18} />
          <span>
            {isGenerating
              ? 'Generating Studio Photoshoot...'
              : hasRenders
              ? 'Regenerate Photoshoot'
              : 'Generate AI Photoshoot (All Angles)'}
          </span>
        </button>

        {hasRenders && (
          <div className="btn-row-secondary">
            <button
              type="button"
              className="btn-action-alt"
              onClick={onDownloadFrontBack}
            >
              <Download size={14} />
              <span>Download Front & Back</span>
            </button>

            <button
              type="button"
              className="btn-action-alt"
              onClick={onOpenExportModal}
              style={{ background: '#FAF4E5', borderColor: '#B17A5B', color: '#94664C' }}
            >
              <Package size={14} />
              <span>Save to Product Catalog</span>
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomModalOpen && displayImageUrl && (
        <div className="modal-backdrop" onClick={() => setIsZoomModalOpen(false)}>
          <div
            className="modal-card-dialog"
            style={{ maxWidth: '800px', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title">
                {selectedModel?.name} • {ANGLE_NAMES[activeAngleKey]} (High-Resolution Zoom)
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsZoomModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', background: '#F8F5F2' }}>
              <img
                src={displayImageUrl}
                alt="High Resolution Inspection"
                style={{ maxHeight: '72vh', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
