/**
 * THE BOMBING OF DARWIN — HISTORICAL SPATIAL ENGINE
 * Cartography Manager
 * 
 * Configures the restrained, dark, architectural cartography.
 * Deep void oceans (#07090B), muted landforms, subtle coastlines, zero commercial POIs.
 * Provides resilient fallback if external map tiles cannot be fetched.
 */

import type * as CesiumType from 'cesium';

export class CartographyManager {
  private Cesium: typeof CesiumType;
  private viewer: CesiumType.Viewer;
  private primaryLayer: CesiumType.ImageryLayer | null = null;
  private hasTriggeredFallback: boolean = false;
  private isDestroyed: boolean = false;

  constructor(Cesium: typeof CesiumType, viewer: CesiumType.Viewer) {
    this.Cesium = Cesium;
    this.viewer = viewer;
    this.applyAtmosphereAndSceneTuning();
    this.applyDarkBasemap();
  }

  /**
   * Suppress default flashy gaming/satellite atmosphere in favor of
   * a quiet, museum-grade, architectural dark environment.
   */
  private applyAtmosphereAndSceneTuning(): void {
    const scene = this.viewer.scene;
    const globe = scene.globe;

    // Void background with deep blue-charcoal foundation
    scene.backgroundColor = this.Cesium.Color.fromCssColorString('#07090B');
    globe.baseColor = this.Cesium.Color.fromCssColorString('#0E1217');

    // Turn off distracting celestial bodies
    if (scene.skyBox) scene.skyBox.show = false;
    if (scene.sun) scene.sun.show = false;
    if (scene.moon) scene.moon.show = false;

    // Suppress bright day/night lighting simulation for consistent legibility
    globe.enableLighting = false;
    globe.showGroundAtmosphere = false;

    // Fog tuning for architectural depth and oblique legibility
    if (scene.fog) {
      scene.fog.enabled = true;
      scene.fog.density = 0.00010;
      scene.fog.minimumBrightness = 0.16;
    }
  }

  /**
   * Exposure parameters for the Archival Charcoal Map.
   * Lifts land into distinct graphite tone (~#282C32) while holding water in deep blue-charcoal (~#111418).
   * Provides slightly elevated exposure for mobile displays in bright viewing conditions.
   */
  public getExposureParams() {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return isMobile
      ? { brightness: 1.48, contrast: 1.05, gamma: 1.10, saturation: 0.08 }
      : { brightness: 1.42, contrast: 1.04, gamma: 1.08, saturation: 0.06 };
  }

  public updateResponsiveExposure(): void {
    if (!this.primaryLayer || this.isDestroyed) return;
    const exposure = this.getExposureParams();
    this.primaryLayer.brightness = exposure.brightness;
    this.primaryLayer.contrast = exposure.contrast;
    this.primaryLayer.gamma = exposure.gamma;
    this.primaryLayer.saturation = exposure.saturation;
    this.viewer.scene.requestRender();
  }

  /**
   * Applies the restrained dark cartographic basemap.
   * Primary: CARTO Dark Matter raster tiles authenticated via PUBLIC_CARTO_BASEMAP_KEY.
   * Documented Endpoint: https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key={key}
   * Fallback: Bundled local Natural Earth II TMS tiles (unauthenticated CARTO requests prohibited).
   */
  public async applyDarkBasemap(): Promise<void> {
    if (this.isDestroyed) return;
    const scene = this.viewer.scene;
    const layers = scene.imageryLayers;
    layers.removeAll();

    const basemapKey: string = 
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_CARTO_BASEMAP_KEY) ||
      '';

    // If PUBLIC_CARTO_BASEMAP_KEY is unavailable, fall back immediately to local Natural Earth.
    // Unauthenticated production CARTO requests are strictly prohibited.
    if (!basemapKey) {
      console.info('[SpatialEngine] PUBLIC_CARTO_BASEMAP_KEY is unavailable. Proceeding directly to local Natural Earth II fallback (unauthenticated production CARTO requests are prohibited).');
      await this.applyLocalFallbackBasemap();
      return;
    }

    let provider: CesiumType.ImageryProvider | null = null;

    try {
      // Primary: Restrained dark monochrome tiles using documented CARTO rastertiles endpoint with key parameter
      provider = new this.Cesium.UrlTemplateImageryProvider({
        url: `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${encodeURIComponent(basemapKey)}`,
        subdomains: ['a', 'b', 'c', 'd'],
        maximumLevel: 18,
        credit: new this.Cesium.Credit('<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>, <a href="https://carto.com/attributions" target="_blank" rel="noopener">© CARTO</a>', false),
      });

      // Catch tile network failures and automatically switch to local fallback
      if (provider.errorEvent) {
        provider.errorEvent.addEventListener((_tileError: unknown) => {
          if (!this.hasTriggeredFallback && !this.isDestroyed) {
            this.hasTriggeredFallback = true;
            console.warn('[SpatialEngine] External CARTO basemap network error; falling back to local Natural Earth II.');
            this.applyLocalFallbackBasemap();
          }
        });
      }

      this.primaryLayer = layers.addImageryProvider(provider);
      
      // Archival Charcoal Map: tuned exposure for land/water separation and clear geometry
      const exposure = this.getExposureParams();
      this.primaryLayer.brightness = exposure.brightness;
      this.primaryLayer.contrast = exposure.contrast;
      this.primaryLayer.gamma = exposure.gamma;
      this.primaryLayer.saturation = exposure.saturation;
      scene.requestRender();
    } catch (err) {
      console.warn('[SpatialEngine] Failed to initialize external dark tiles, falling back to local imagery:', err);
      this.applyLocalFallbackBasemap();
    }
  }

  /**
   * Local offline fallback basemap utilizing the bundled NaturalEarthII TMS tiles.
   * Located at: /cesium/Assets/Textures/NaturalEarthII (475 KB, Public Domain).
   */
  public async applyLocalFallbackBasemap(): Promise<void> {
    if (this.isDestroyed) return;
    const scene = this.viewer.scene;
    const layers = scene.imageryLayers;
    layers.removeAll();

    try {
      const naturalEarthUrl = this.Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII');
      let fallbackProvider: CesiumType.ImageryProvider;

      if (typeof (this.Cesium.TileMapServiceImageryProvider as any).fromUrl === 'function') {
        fallbackProvider = await (this.Cesium.TileMapServiceImageryProvider as any).fromUrl(naturalEarthUrl);
      } else {
        fallbackProvider = new this.Cesium.TileMapServiceImageryProvider({
          url: naturalEarthUrl,
        });
      }

      if (this.isDestroyed) return;

      this.primaryLayer = layers.addImageryProvider(fallbackProvider);
      // Archival charcoal transformation on natural earth
      this.primaryLayer.brightness = 0.58;
      this.primaryLayer.contrast = 1.16;
      this.primaryLayer.gamma = 1.10;
      this.primaryLayer.saturation = 0.04;
      scene.requestRender();
    } catch (e) {
      console.error('[SpatialEngine] Local fallback basemap failed:', e);
      // Globe baseColor (#0E1217) will continue rendering cleanly
      scene.requestRender();
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.primaryLayer = null;
  }
}
