/**
 * THE BOMBING OF DARWIN — HISTORICAL SPATIAL ENGINE
 * Camera Choreographer
 * 
 * Executes deliberate, weighted camera transitions between geographic compositions.
 * Governed by the rhythm: SCROLL → TRANSITION → COMPOSITION → READ.
 * Strictly respects prefers-reduced-motion with instant/static compositions.
 * Responsive across desktop widescreen, tablet, mobile portrait, and mobile landscape.
 */

import type * as CesiumType from 'cesium';
import type { CameraPose, SpatialDemonstrationState } from './spatial-types';

export interface CameraTransitionOptions {
  forceInstant?: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
}

export class CameraChoreographer {
  private Cesium: typeof CesiumType;
  private camera: CesiumType.Camera;
  private scene: CesiumType.Scene;
  private isReducedMotion: boolean = false;
  private activeTargetStateId: string | null = null;
  private isFlying: boolean = false;
  private mediaQueryList: MediaQueryList | null = null;
  private mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null;

  constructor(Cesium: typeof CesiumType, camera: CesiumType.Camera, scene: CesiumType.Scene) {
    this.Cesium = Cesium;
    this.camera = camera;
    this.scene = scene;
    this.initReducedMotionListener();
  }

  private initReducedMotionListener(): void {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.isReducedMotion = this.mediaQueryList.matches;
      this.mediaQueryHandler = (e: MediaQueryListEvent) => {
        this.isReducedMotion = e.matches;
        if (this.isReducedMotion && this.isFlying) {
          this.cancelFlight();
        }
      };
      this.mediaQueryList.addEventListener('change', this.mediaQueryHandler);
    }
  }

  /**
   * Determine the appropriate camera pose according to viewport aspect ratio and width.
   * Desktop widescreen (>= 1100px), Tablet (768px - 1099px),
   * Mobile Portrait (< 768px portrait), Mobile Landscape (< 1024px landscape).
   */
  public selectPose(state: SpatialDemonstrationState): CameraPose {
    if (typeof window === 'undefined') return state.desktopCamera;

    const w = window.innerWidth;
    const h = window.innerHeight;

    if (w >= 1100) {
      return state.desktopCamera;
    }

    if (w >= 768 && w < 1100) {
      return state.tabletCamera || state.desktopCamera;
    }

    if (w < 1024 && w > h) {
      // Mobile / small landscape
      return state.mobileLandscapeCamera || state.desktopCamera;
    }

    // Default mobile portrait
    return state.mobilePortraitCamera || state.tabletCamera || state.desktopCamera;
  }

  /**
   * Transition the camera to the specified demonstration state composition.
   */
  public transitionTo(
    state: SpatialDemonstrationState, 
    options: CameraTransitionOptions = {}
  ): void {
    const pose = this.selectPose(state);
    
    // Prevent redundant flights if already targeting this exact state
    if (this.activeTargetStateId === state.id && this.isFlying && !options.forceInstant) {
      return;
    }

    this.activeTargetStateId = state.id;

    const destination = this.Cesium.Cartesian3.fromDegrees(
      pose.longitude,
      pose.latitude,
      pose.altitudeM
    );

    const orientation = {
      heading: this.Cesium.Math.toRadians(pose.headingDeg),
      pitch: this.Cesium.Math.toRadians(pose.pitchDeg),
      roll: this.Cesium.Math.toRadians(pose.rollDeg),
    };

    // Instant cut if user prefers reduced motion or instant is forced
    if (this.isReducedMotion || options.forceInstant) {
      this.cancelFlight();
      this.camera.setView({
        destination,
        orientation,
      });
      this.scene.requestRender();
      options.onComplete?.();
      return;
    }

    // Weighted, calm, deliberate cinematic flight
    const durationSeconds = Math.max(1.4, (state.durationMs || 2200) / 1000);

    this.isFlying = true;
    this.camera.flyTo({
      destination,
      orientation,
      duration: durationSeconds,
      easingFunction: this.Cesium.EasingFunction.QUADRATIC_OUT,
      complete: () => {
        this.isFlying = false;
        this.scene.requestRender();
        options.onComplete?.();
      },
      cancel: () => {
        this.isFlying = false;
        this.scene.requestRender();
        options.onCancel?.();
      },
    });
  }

  public cancelFlight(): void {
    this.camera.cancelFlight();
    this.isFlying = false;
    this.scene.requestRender();
  }

  public getIsReducedMotion(): boolean {
    return this.isReducedMotion;
  }

  public destroy(): void {
    this.cancelFlight();
    if (this.mediaQueryList && this.mediaQueryHandler) {
      this.mediaQueryList.removeEventListener('change', this.mediaQueryHandler);
    }
    this.mediaQueryList = null;
    this.mediaQueryHandler = null;
  }
}
