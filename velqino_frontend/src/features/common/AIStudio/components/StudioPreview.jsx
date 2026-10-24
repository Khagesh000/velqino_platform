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
      <div className="hero-viewer-box">
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
            />

            {/* Floating angle tag */}
            <div className="floating-angle-pill">
              <span className="live-dot-mini">●</span>
              <span>
                {selectedModel?.name?.split(' - ')[0] || selectedModel?.name || 'Model'} • {ANGLE_NAMES[activeAngleKey] || activeAngleKey}
              </span>
            </div>

            {/* Zoom Inspection Button */}
            <button
              type="button"
              className="zoom-button zoom-inspect-btn"
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
      <div className="angle-scrubber-bar">
        <div className="scrubber-header scrubber-label-row">
          <div className="scrubber-label">
            <span>Camera Angle Rotation</span>
          </div>
          <div className="scrubber-hint">
            {ANGLE_NAMES[activeAngleKey] || 'Front (0°)'}
          </div>
        </div>

        <div className="scrubber-chips angle-buttons-strip">
          {ANGLE_KEYS_ORDER.map((key) => {
            const isActive = activeAngleKey === key;
            const hasRenderForAngle = renders.some((r) => r.angle_key === key);
            const info = ANGLE_DISPLAY_MAP[key] || { label: key, deg: '' };

            return (
              <button
                key={key}
                type="button"
                className={`scrubber-chip angle-strip-btn ${isActive ? 'active' : ''} ${hasRenderForAngle ? 'has-render' : ''}`}
                onClick={() => onSelectAngle(key)}
              >
                <span className="chip-name">{info.label}</span>
                <span className="chip-deg">{info.deg}</span>
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
              className="btn-action-alt bg-[#FAF4E5] border-[#B17A5B] text-[#94664C]"
              onClick={onOpenExportModal}
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
            className="modal-card-dialog max-w-[800px] max-h-[90vh]"
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
            <div className="modal-body text-center bg-[#F8F5F2]">
              <img
                src={displayImageUrl}
                alt="High Resolution Inspection"
                className="max-h-[72vh] max-w-full object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
