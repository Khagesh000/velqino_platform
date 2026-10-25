"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Sparkles, Package, X } from '@/utils/icons';
import {
  useGetAIModelsQuery,
  useUpdateAIModelMutation,
  useGenerateTryOnMutation,
  useExportToProductMutation,
  useGetCatalogProductsQuery
} from '@/redux/common/slices/aiStudioSlice';
import ModelSelector from './components/ModelSelector';
import GarmentUploader from './components/GarmentUploader';
import StudioControls from './components/StudioControls';
import StudioPreview from './components/StudioPreview';
import { resolveImageUrl } from '@/utils/apiConfig';
import '@/styles/common/AIStudio.scss';

export default function AIStudio({ sellerRole = 'retailer' }) {
  // 1. Fetch AI Models via Redux RTK Query
  const { data: modelsResponse, isLoading: isLoadingModels } = useGetAIModelsQuery();
  const models = useMemo(() => modelsResponse?.models || [], [modelsResponse]);

  // Selected Model State
  const [selectedModel, setSelectedModel] = useState(null);

  // Filters State
  const [activeDemographic, setActiveDemographic] = useState('men');
  const [activeSkinTone, setActiveSkinTone] = useState('all');
  const [activeBodyType, setActiveBodyType] = useState('all');

  // Garment Input State
  const [frontFile, setFrontFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [garmentType, setGarmentType] = useState('top');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Studio Fit & Camera State
  const [fitSilhouette, setFitSilhouette] = useState('regular');
  const [tuckStyle, setTuckStyle] = useState('untucked');
  const [backdropStyle, setBackdropStyle] = useState('pure_white');
  const [selectedAngles, setSelectedAngles] = useState([
    'front',
    'back',
    'left_three_quarter',
    'right_three_quarter',
    'left_side',
    'right_side'
  ]);

  // Active View & Generation State
  const [activeAngleKey, setActiveAngleKey] = useState('front');
  const [generationPhase, setGenerationPhase] = useState('');
  const [renders, setRenders] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // RTK Query Mutations
  const [updateAIModelMutation, { isLoading: isUpdatingModel }] = useUpdateAIModelMutation();
  const [generateTryOnMutation, { isLoading: isGenerating }] = useGenerateTryOnMutation();
  const [exportToProductMutation, { isLoading: isExporting }] = useExportToProductMutation();

  // Catalog Products for Modal
  const { data: catalogProducts = [], isLoading: isLoadingCatalog } = useGetCatalogProductsQuery(sellerRole);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTargetProductId, setExportTargetProductId] = useState(null);

  // Default model when models load (respecting backend is_default)
  useEffect(() => {
    if (models.length > 0) {
      if (!selectedModel) {
        // Backend default for current demographic
        const backendDefault = models.find((m) => m.demographic === activeDemographic && m.is_default)
          || models.find((m) => m.demographic === activeDemographic)
          || models[0];
        setSelectedModel(backendDefault);
      } else {
        // Sync selected model if its is_default flag updated on backend
        const latestVersion = models.find((m) => m.slug === selectedModel.slug);
        if (latestVersion && latestVersion.is_default !== selectedModel.is_default) {
          setSelectedModel(latestVersion);
        }
      }
    }
  }, [models, selectedModel, activeDemographic]);

  // Handle demographic tab change
  const handleDemographicChange = useCallback((demo) => {
    setActiveDemographic(demo);
    const defaultForDemo = models.find((m) => m.demographic === demo && m.is_default)
      || models.find((m) => m.demographic === demo);
    if (defaultForDemo) {
      setSelectedModel(defaultForDemo);
    }
  }, [models]);

  // Handle setting/updating model default on backend (PATCH)
  const handleUpdateDefaultModel = useCallback(async (modelToUpdate) => {
    if (!modelToUpdate?.slug) return;
    try {
      const response = await updateAIModelMutation({
        slug: modelToUpdate.slug,
        data: { is_default: true }
      }).unwrap();

      if (response?.success) {
        toast.success(response.message || 'Model updated successfully');
        if (response.model) {
          setSelectedModel(response.model);
        }
      } else {
        toast.error(response?.message || 'Failed to update model');
      }
    } catch (err) {
      const errorMsg = err?.data?.message || err?.message || 'Failed to update model';
      toast.error(errorMsg);
    }
  }, [updateAIModelMutation]);

  // Angle toggle handlers
  const handleToggleAngle = (angleKey) => {
    if (selectedAngles.includes(angleKey)) {
      if (selectedAngles.length === 1) {
        toast.info('At least one angle must be selected.');
        return;
      }
      setSelectedAngles(selectedAngles.filter((a) => a !== angleKey));
    } else {
      setSelectedAngles([...selectedAngles, angleKey]);
    }
  };

  const handleSelectAllAngles = () => {
    setSelectedAngles(['front', 'back', 'left_three_quarter', 'right_three_quarter', 'left_side', 'right_side']);
  };

  const handleSelectFrontBackOnly = () => {
    setSelectedAngles(['front', 'back']);
  };

  // Handle Catalog Garment Selection
  const handleSelectCatalogProduct = (prod) => {
    setSelectedProduct(prod);
    setIsCatalogModalOpen(false);

    const primaryImg = prod.images?.find((img) => img.is_front) || prod.images?.[0];
    const backImg = prod.images?.find((img) => !img.is_front);

    if (primaryImg?.image) {
      setFrontPreview(resolveImageUrl(primaryImg.image));
      setFrontFile(null);
    }
    if (backImg?.image) {
      setBackPreview(resolveImageUrl(backImg.image));
      setBackFile(null);
    } else {
      setBackPreview(null);
      setBackFile(null);
    }
    toast.success(`Loaded images from product: ${prod.name}`);
  };

  // 2. Generate Virtual Try-On Photoshoot
  const handleGenerate = async () => {
    if (!frontFile && !frontPreview) {
      toast.warn('Please upload a frontside photo of the shirt or select a product.');
      return;
    }

    if (!selectedModel) {
      toast.warn('Please select an AI model.');
      return;
    }

    setGenerationPhase('Removing garment background...');

    try {
      setTimeout(() => setGenerationPhase('Warping garment to 3D body contour...'), 700);
      setTimeout(() => setGenerationPhase('Projecting authentic muscle shading & seam folds...'), 1400);
      setTimeout(() => setGenerationPhase('Rendering studio lighting across all angles...'), 2100);

      const formData = new FormData();
      formData.append('model_slug', selectedModel.slug);
      formData.append('garment_type', garmentType);
      formData.append('fit_silhouette', fitSilhouette);
      formData.append('tuck_style', tuckStyle);
      formData.append('backdrop_style', backdropStyle);
      formData.append('seller_type', sellerRole);

      selectedAngles.forEach((ang) => {
        formData.append('angles', ang);
      });

      if (frontFile) {
        formData.append('front_image', frontFile);
      } else if (frontPreview) {
        formData.append('front_image_base64', frontPreview);
      }

      if (backFile) {
        formData.append('back_image', backFile);
      } else if (backPreview) {
        formData.append('back_image_base64', backPreview);
      }

      if (selectedProduct) {
        formData.append('product_id', selectedProduct.id);
      }

      const response = await generateTryOnMutation(formData).unwrap();

      if (response?.success) {
        const renderData = response.data?.renders || [];
        setRenders(renderData);
        setCurrentSessionId(response.session_id);
        setActiveAngleKey(renderData[0]?.angle_key || 'front');
        toast.success(`Generated ${renderData.length} multi-angle studio photos!`);
      } else {
        toast.error(response?.error || 'Generation failed. Please try again.');
      }
    } catch (err) {
      console.error('TryOn generation error:', err);
      toast.error(err?.error || err?.data?.error || 'An error occurred during photoshoot generation.');
    } finally {
      setGenerationPhase('');
    }
  };

  // 3. Download Images Helper
  const downloadImage = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadFrontBack = () => {
    const frontRender = renders.find((r) => r.is_front || r.angle_key === 'front');
    const backRender = renders.find((r) => r.is_back || r.angle_key === 'back');

    if (frontRender) {
      const url = frontRender.base64_url || resolveImageUrl(frontRender.image_url);
      downloadImage(url, `tryon_${selectedModel.slug}_front.jpg`);
    }
    if (backRender) {
      setTimeout(() => {
        const bUrl = backRender.base64_url || resolveImageUrl(backRender.image_url);
        downloadImage(bUrl, `tryon_${selectedModel.slug}_back.jpg`);
      }, 300);
    }
    toast.success('Downloaded Front and Back studio photos.');
  };

  const handleDownloadAll = () => {
    renders.forEach((r, idx) => {
      setTimeout(() => {
        const url = r.base64_url || resolveImageUrl(r.image_url);
        downloadImage(url, `tryon_${selectedModel.slug}_${r.angle_key}.jpg`);
      }, idx * 250);
    });
    toast.success(`Downloading all ${renders.length} angles.`);
  };

  // 4. Export to Product Gallery
  const handleExportToProduct = async () => {
    if (!exportTargetProductId) {
      toast.warn('Please select a product to attach the photos to.');
      return;
    }

    try {
      const res = await exportToProductMutation({
        session_id: currentSessionId,
        product_id: exportTargetProductId,
        angles: selectedAngles,
      }).unwrap();

      if (res?.success) {
        toast.success(res.message || 'Photos successfully attached to product gallery!');
        setIsExportModalOpen(false);
      } else {
        toast.error(res?.error || 'Export failed.');
      }
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export photos to product.');
    }
  };

  return (
    <div className="ai-studio-container">
      {/* Studio Header Banner */}
      <div className="studio-header">
        <div className="badge-pill">
          <Sparkles size={14} />
          <span>Velqino AI Fashion Studio • {sellerRole.toUpperCase()}</span>
        </div>
        <h1 className="studio-title">
          AI Model Virtual Photoshoot & <span className="highlight-ai">Multi-Angle Fitting</span>
        </h1>
        <p className="studio-subtitle">
          Upload frontside and backside photos of plain shirts, t-shirts, tops, or trousers. Our AI instantly fits them onto realistic faceless human models with accurate skin tones, authentic lighting, natural fabric drape, and all 6 camera angles (Front, Back, 3/4 Turns, and Profiles).
        </p>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="studio-layout-grid">
        {/* Left Column: Configuration Panels */}
        <div className="studio-config-panel">
          {/* Step 1: Model Selection */}
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            activeDemographic={activeDemographic}
            onChangeDemographic={handleDemographicChange}
            activeSkinTone={activeSkinTone}
            onChangeSkinTone={setActiveSkinTone}
            activeBodyType={activeBodyType}
            onChangeBodyType={setActiveBodyType}
            isLoading={isLoadingModels}
            onUpdateDefaultModel={handleUpdateDefaultModel}
            isUpdatingModel={isUpdatingModel}
          />

          {/* Step 2: Garment Uploader */}
          <GarmentUploader
            frontImage={frontFile}
            frontPreview={frontPreview}
            onFrontChange={(file, preview) => {
              setFrontFile(file);
              setFrontPreview(preview);
            }}
            onFrontRemove={() => {
              setFrontFile(null);
              setFrontPreview(null);
            }}
            backImage={backFile}
            backPreview={backPreview}
            onBackChange={(file, preview) => {
              setBackFile(file);
              setBackPreview(preview);
            }}
            onBackRemove={() => {
              setBackFile(null);
              setBackPreview(null);
            }}
            garmentType={garmentType}
            onChangeGarmentType={setGarmentType}
            selectedProduct={selectedProduct}
            onOpenCatalogModal={() => setIsCatalogModalOpen(true)}
          />

          {/* Step 3: Studio Controls */}
          <StudioControls
            fitSilhouette={fitSilhouette}
            onChangeFitSilhouette={setFitSilhouette}
            tuckStyle={tuckStyle}
            onChangeTuckStyle={setTuckStyle}
            backdropStyle={backdropStyle}
            onChangeBackdropStyle={setBackdropStyle}
            selectedAngles={selectedAngles}
            onToggleAngle={handleToggleAngle}
            onSelectAllAngles={handleSelectAllAngles}
            onSelectFrontBackOnly={handleSelectFrontBackOnly}
          />
        </div>

        {/* Right Column: Interactive Studio Showcase & 360 Viewer */}
        <StudioPreview
          selectedModel={selectedModel}
          renders={renders}
          activeAngleKey={activeAngleKey}
          onSelectAngle={setActiveAngleKey}
          isGenerating={isGenerating}
          generationPhase={generationPhase}
          canGenerate={Boolean(frontFile || frontPreview) && Boolean(selectedModel)}
          onGenerate={handleGenerate}
          onDownloadAll={handleDownloadAll}
          onDownloadFrontBack={handleDownloadFrontBack}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          sellerRole={sellerRole}
        />
      </div>

      {/* Catalog Apparel Picker Modal */}
      {isCatalogModalOpen && !isExportModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCatalogModalOpen(false)}>
          <div className="modal-card-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Select Apparel from Store Inventory</div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsCatalogModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {isLoadingCatalog ? (
                <div className="p-8 text-center text-gray-500">
                  Loading inventory products...
                </div>
              ) : catalogProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No products found in inventory. You can directly upload custom garment photos using the dropzone.
                </div>
              ) : (
                <div className="product-pick-grid">
                  {catalogProducts.map((prod) => {
                    const primaryImg = prod.images?.find((img) => img.is_front) || prod.images?.[0];
                    return (
                      <div
                        key={prod.id}
                        className="pick-item"
                        onClick={() => handleSelectCatalogProduct(prod)}
                      >
                        <img
                          src={resolveImageUrl(primaryImg?.image) || '/favicon.ico'}
                          alt={prod.name}
                          className="pick-thumb"
                        />
                        <div className="pick-name" title={prod.name}>
                          {prod.name}
                        </div>
                        <div className="pick-sku">SKU: {prod.sku || 'N/A'}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Photos to Catalog Product Modal */}
      {isExportModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsExportModalOpen(false)}>
          <div className="modal-card-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Attach AI Photos to Product Gallery</div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsExportModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="text-[13px] text-gray-500 mb-4">
                Select which product to attach these generated multi-angle photos to. Front views will be marked as Front Cover, and Back views as Back Angle in the customer store.
              </p>

              <div className="product-pick-grid">
                {catalogProducts.map((prod) => {
                  const isChosen = exportTargetProductId === prod.id;
                  const primaryImg = prod.images?.find((img) => img.is_front) || prod.images?.[0];
                  return (
                    <div
                      key={prod.id}
                      className={`pick-item ${isChosen ? 'border-[#CE8E6A] bg-[#FAF4E5]' : ''}`}
                      onClick={() => setExportTargetProductId(prod.id)}
                    >
                      <img
                        src={resolveImageUrl(primaryImg?.image) || '/favicon.ico'}
                        alt={prod.name}
                        className="pick-thumb"
                      />
                      <div className="pick-name" title={prod.name}>
                        {prod.name}
                      </div>
                      <div className="pick-sku">SKU: {prod.sku || 'N/A'}</div>
                      {isChosen && (
                        <div className="text-[#94664C] text-[11px] font-semibold mt-1">
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn-action-alt"
                  onClick={() => setIsExportModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-generate-primary !w-auto px-5 py-2.5"
                  disabled={!exportTargetProductId || isExporting}
                  onClick={handleExportToProduct}
                >
                  {isExporting ? 'Attaching to Product...' : 'Confirm & Save to Product Gallery'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
