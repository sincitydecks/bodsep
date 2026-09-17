/**
 * THE BOMBING OF DARWIN — HISTORICAL SPATIAL ENGINE
 * Spatial Evidence Overlay
 * 
 * Manages evidence-governed cartographic markers and corridors in CesiumJS.
 * 
 * Strict Governance Rules:
 * 1. TRUTH FIRST: Every marker and corridor corresponds to verified or approximate canonical entities.
 * 2. NEGATIVE CONSTRAINTS:
 *    - NO 1:1 D3A representation until adjudicated.
 *    - NO individual aircraft flight tracks (corridors with uncertainty only).
 *    - 1942 Stokes Hill Wharf geometry remains unresolved (null coordinates).
 *    - MV Neptuna 1942 berth remains unresolved (null coordinates).
 * 3. AESTHETICS: Restrained, archival, institutional palette (Bone #EEE9DF, Gold #C6A15B, Dark #07090B).
 *    Never neon, tactical gaming HUD, or military sci-fi.
 */

import type * as CesiumType from 'cesium';
import type { SpatialDemonstrationStateId } from './spatial-types';

export interface EvidenceSource {
  title: string;
  institution?: string;
  reference?: string;
}

export interface LedgerEntityData {
  id: string;
  title: string;
  time?: string;
  badge?: string;
  classification: string;
  confidence: string;
  known: string;
  uncertain?: string;
  notes?: string;
  sources: EvidenceSource[];
}

export const CANONICAL_EVIDENCE_RECORDS: Record<string, LedgerEntityData> = {
  'timor-launch': {
    id: 'timor-launch',
    title: 'Estimated Launch Area',
    time: '08:00 (approx)',
    badge: 'DIGITAL RECONSTRUCTION',
    classification: 'DIGITAL_RECONSTRUCTION',
    confidence: 'MODERATE',
    known: '1st Carrier Air Fleet was operating in the Timor Sea approximately 220 NM NNW of Darwin. Takeoff commenced ~07:50–08:00 (06:20–06:25 JST), with Fuchida airborne at 06:22 JST.',
    uncertain: 'Exact coordinate of the flagship Akagi during launch is a general operational envelope with a ~40km uncertainty radius.',
    notes: 'Reconstructed parameter. Center point is a mathematical camera anchor, not an observed coordinate. Full operational launch/assembly window ran 08:00 to 08:45 Darwin Local Time.',
    sources: [{ title: 'Senshi Sōsho Vol. 26', institution: 'Japanese Official History' }]
  },
  'bathurst-mission': {
    id: 'bathurst-mission',
    title: 'Sacred Heart Mission, Nguiu',
    time: '09:35',
    badge: 'ARCHIVAL RECORD',
    classification: 'CONTEMPORARY_ARCHIVAL_RECORD',
    confidence: 'VERIFIED',
    known: 'The mission was an established location. Father McGrath sighted the formation and transmitted a warning to Darwin VID.',
    uncertain: 'The exact physical position from which he personally observed the formation is not established to survey precision.',
    notes: '09:35 sighting. 09:37 transmission (Darwin Local Time).',
    sources: [
      { title: 'Lowe Commission Exhibit 3', institution: 'Official Inquiry (1942)' },
      { title: 'Father McGrath Radio Log', institution: 'Contemporary Archive' }
    ]
  },
  'first-wave-approach': {
    id: 'first-wave-approach',
    title: 'First-Wave Approach',
    time: '09:58',
    badge: 'DIGITAL RECONSTRUCTION',
    classification: 'DIGITAL_RECONSTRUCTION',
    confidence: 'MODERATE',
    known: '188-aircraft total is strongly supported. The broad approach over the peninsula is evidence-based.',
    uncertain: 'The 71/72 D3A dive bomber discrepancy exists between official histories and some Australian War Memorial sources. Individual aircraft tracks are not known.',
    notes: 'The rendered corridor is an interpretive reconstruction. The project does not show false precision by rendering 188 individual 3D aircraft tracks.',
    sources: [
      { title: 'Senshi Sōsho Vol. 26', institution: 'Japanese Official History' },
      { title: 'Lowe Commission', institution: 'Official Inquiry (1942)' }
    ]
  },
  'post-office': {
    id: 'post-office',
    title: 'Darwin Post & Telegraph Office',
    time: '10:00',
    badge: 'ESTABLISHED FACT',
    classification: 'ESTABLISHED_FACT',
    confidence: 'VERIFIED',
    known: 'The civilian shelter trench behind the Post Office received a direct bomb hit at approximately 10:00.',
    uncertain: 'Casualty discrepancy: AWM records state 9 staff members killed. LANT and some AWM publications state 10 people sheltering were killed.',
    notes: 'Pending formal adjudication to determine if discrepancy arises from staff classification vs. total occupants.',
    sources: [
      { title: 'Lowe Commission', institution: 'Official Inquiry (1942)' },
      { title: 'Civilian Casualties', institution: 'Commonwealth War Graves Commission' }
    ]
  },
  'peary-underway': {
    id: 'peary-underway',
    title: 'USS Peary Under Attack',
    time: '10:45',
    badge: 'ESTABLISHED FACT',
    classification: 'ESTABLISHED_FACT',
    confidence: 'VERIFIED',
    known: 'USS Peary (DD-226) was targeted by sustained dive-bomber attacks while manoeuvring in Darwin Harbour, struck by five bombs between 10:15 and 10:45.',
    uncertain: 'Exact surface track during evasive manoeuvres within the harbour is reconstructed from survivor testimony.',
    notes: 'Five direct bomb hits confirmed by US Navy action reports and official naval histories.',
    sources: [
      { title: 'DANFS: USS Peary', institution: 'US Naval History and Heritage Command' },
      { title: 'Royal Australian Navy Vol. 1', institution: 'Official History' }
    ]
  },
  'raaf-station': {
    id: 'raaf-station',
    title: 'RAAF Station Darwin (Airfield)',
    time: '12:00',
    badge: 'ESTABLISHED FACT',
    classification: 'ESTABLISHED_FACT',
    confidence: 'VERIFIED',
    known: 'Fifty-four land-based heavy bombers arrived at high altitude (18,000–23,000 ft) to pattern-bomb RAAF Station Darwin at Parap between 11:58 and 12:25.',
    uncertain: 'Radar 311 at Dripstone was on site but not yet calibrated or connected to an operational plotting network.',
    notes: 'Second raid of 19 February 1942 comprised 27 G4M1 Bettys and 27 G3M2 Nells.',
    sources: [
      { title: 'Senshi Sōsho Vol. 26', institution: 'Japanese Official History' },
      { title: 'Royal Australian Air Force 1939–1942', institution: 'Official History (Gillison)' },
      { title: 'Lowe Commission', institution: 'Official Inquiry (1942)' }
    ]
  },
  'peary-wreck': {
    id: 'peary-wreck',
    title: 'USS Peary (DD-226)',
    time: '13:00',
    badge: 'ESTABLISHED FACT',
    classification: 'ESTABLISHED_FACT',
    confidence: 'HIGH',
    known: 'Modern surveyed wreck position on the seabed. Approximate manoeuvre sector during the attack is documented.',
    uncertain: 'Unresolved exact attack trajectory on the surface. Casualty-source disagreement: authoritative sources report different casualty totals (80, 88, or 91 fatalities). The reason for the discrepancy has not been fully reconciled in the current evidence model.',
    notes: 'Do not force a single "correct" casualty source without historical adjudication.',
    sources: [
      { title: 'DANFS: USS Peary', institution: 'US Naval History and Heritage Command' },
      { title: 'Royal Australian Navy Vol. 1', institution: 'Official History' }
    ]
  },
  'stokes-hill-wharf': {
    id: 'stokes-hill-wharf',
    title: 'Stokes Hill Wharf & MV Neptuna',
    time: '10:12',
    badge: 'ARCHIVAL RECORD',
    classification: 'CONTEMPORARY_ARCHIVAL_RECORD',
    confidence: 'VERIFIED',
    known: 'MV Neptuna was berthed at Stokes Hill Wharf laden with depth charges and ammunition. Struck during the first wave, she caught fire and detonated at 10:12, severing a 100-foot section of the wharf.',
    uncertain: 'Exact structural damage extent verified post-raid from aerial photography and public works survey drawings.',
    notes: 'Stokes Hill Wharf is the principal geographic anchor linking 1942 events to the modern waterfront.',
    sources: [
      { title: 'Lowe Commission Exhibit 3', institution: 'Official Inquiry (1942)' },
      { title: 'NAA Darwin Wharf Plans 1942', institution: 'National Archives of Australia' },
      { title: 'AWM 128108 Photograph', institution: 'Australian War Memorial' }
    ]
  }
};

export class SpatialEvidenceOverlay {
  private Cesium: typeof CesiumType;
  private viewer: CesiumType.Viewer;
  private dataSource: CesiumType.CustomDataSource | null = null;
  private stateEntityGroups: Map<string, CesiumType.Entity[]> = new Map();
  private activeStateId: SpatialDemonstrationStateId = 'STATE_00_WORLD';

  constructor(Cesium: typeof CesiumType, viewer: CesiumType.Viewer) {
    this.Cesium = Cesium;
    this.viewer = viewer;
  }

  public async initialize(): Promise<void> {
    const Cesium = this.Cesium;
    this.dataSource = new Cesium.CustomDataSource('darwin-historical-evidence');
    await this.viewer.dataSources.add(this.dataSource);

    this.buildEvidenceEntities();
    this.setupInteraction();
    this.updateVisibility();
  }

  
  private setupInteraction(): void {
    const handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.setInputAction((movement: any) => {
      const pickedObject = this.viewer.scene.pick(movement.position);
      if (this.Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
        const props = pickedObject.id.properties.getValue(this.viewer.clock.currentTime);
        if (props && props.ledgerData) {
          // Send event or call global function
          if (typeof window !== 'undefined' && (window as any).openEvidenceLedger) {
            (window as any).openEvidenceLedger(props.ledgerData);
          }
        }
      }
    }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  private buildEvidenceEntities(): void {
    if (!this.dataSource) return;
    const Cesium = this.Cesium;

    const goldColor = Cesium.Color.fromCssColorString('#C6A15B');
    const boneColor = Cesium.Color.fromCssColorString('#EEE9DF');
    const darkBg = Cesium.Color.fromCssColorString('#07090B');
    const corridorOutline = Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.45)');
    const corridorFill = Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.08)');

    // =========================================================================
    // BEAT 0: TIMOR SEA CARRIER LAUNCH (08:00)
    // Reconstruction Parameter: Regional Origin Envelope (~220 NM NNW Darwin).
    // Uncertainty radius ~40km. Center point is a mathematical camera anchor, not an observed coordinate.
    // =========================================================================
    const beat0Entities: CesiumType.Entity[] = [];

    // Launch envelope (regional origin area)
    const launchArea = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(129.0, -10.5, 500),
      ellipse: {
        semiMajorAxis: 50000,
        semiMinorAxis: 40000,
        material: corridorFill,
        outline: true,
        outlineColor: corridorOutline,
        outlineWidth: 1.5,
      },
      show: false,
    });
    beat0Entities.push(launchArea);

    // General regional ingress corridor line towards Bathurst Island
    const launchCorridor = this.dataSource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          129.0, -10.5, 4000,
          130.627, -11.758, 3500,
        ]),
        width: 1.5,
        material: new Cesium.PolylineDashMaterialProperty({
          color: corridorOutline,
          dashLength: 16.0,
        }),
      },
      show: false,
    });
    beat0Entities.push(launchCorridor);

    // Launch envelope label (Reconstruction Parameter)
    const launchLabel = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['timor-launch'] }),
      position: Cesium.Cartesian3.fromDegrees(129.0, -10.5, 1000),
      point: {
        pixelSize: 5,
        color: goldColor,
        outlineColor: darkBg,
        outlineWidth: 1.5,
      },
      label: {
        text: 'ESTIMATED LAUNCH AREA (~220 NM NNW DARWIN)\nIJN 1ST CARRIER AIR FLEET ENVELOPE (APPROX. 40KM UNCERTAINTY)',
        font: '11px "IBM Plex Mono", monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
        scaleByDistance: new Cesium.NearFarScalar(1e5, 1.0, 5e6, 0.6),
      },
      show: false,
    });
    beat0Entities.push(launchLabel);
    this.stateEntityGroups.set('BEAT_0_TIMOR_LAUNCH', beat0Entities);

    // =========================================================================
    // BEAT 1: BATHURST ISLAND WARNING (09:35)
    // Sacred Heart Mission at Nguiu (verified ground site).
    // Father McGrath sighting (radioed 09:37). Observed flight corridor (~140°).
    // =========================================================================
    const beat1Entities: CesiumType.Entity[] = [];

    const bathurstMission = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['bathurst-mission'] }),
      position: Cesium.Cartesian3.fromDegrees(130.627, -11.758, 50),
      point: {
        pixelSize: 8,
        color: goldColor,
        outlineColor: darkBg,
        outlineWidth: 2,
      },
      label: {
        text: 'SACRED HEART MISSION, NGUIU · 09:35\nLOCATION OF FATHER McGRATH\'S MISSION · WARNING TRANSMITTED 09:37',
        font: '11px "IBM Plex Mono", monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
        scaleByDistance: new Cesium.NearFarScalar(5e4, 1.0, 1e6, 0.7),
      },
      show: false,
    });
    beat1Entities.push(bathurstMission);

    // Observed corridor across Clarence Strait (broad envelope, not individual tracks)
    const bathurstTransitCorridor = this.dataSource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          130.627, -11.758, 3500,
          131.05, -12.30, 3200,
        ]),
        width: 1.5,
        material: new Cesium.PolylineDashMaterialProperty({
          color: corridorOutline,
          dashLength: 14.0,
        }),
      },
      show: false,
    });
    beat1Entities.push(bathurstTransitCorridor);
    this.stateEntityGroups.set('BEAT_1_BATHURST_WARNING', beat1Entities);

    // =========================================================================
    // BEAT 2: HARBOUR STRIKE (09:58)
    // Coordinated first wave attack axis along 315°–345°.
    // Documented target sector. 1942 wharf timber footprint remains unresolved.
    // =========================================================================
    const beat2Entities: CesiumType.Entity[] = [];

    const harbourCentroid = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['first-wave-approach'] }),
      position: Cesium.Cartesian3.fromDegrees(130.8456, -12.4634, 30),
      point: {
        pixelSize: 7,
        color: goldColor,
        outlineColor: darkBg,
        outlineWidth: 2,
      },
      label: {
        text: 'DARWIN HARBOUR & TOWN PENINSULA · 09:58\nDOCUMENTED TARGET SECTOR · FIRST BOMBS IMPACT (RECONSTRUCTED APPROACH 315°–345°)',
        font: '11px "IBM Plex Mono", monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
        scaleByDistance: new Cesium.NearFarScalar(1e4, 1.0, 3e5, 0.7),
      },
      show: false,
    });
    beat2Entities.push(harbourCentroid);

    // Documented ingress corridor line
    const strikeIngressLine = this.dataSource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          130.98, -12.55, 3000,
          130.8456, -12.4634, 1200,
        ]),
        width: 2.0,
        material: new Cesium.PolylineDashMaterialProperty({
          color: corridorOutline,
          dashLength: 12.0,
        }),
      },
      show: false,
    });
    beat2Entities.push(strikeIngressLine);
    this.stateEntityGroups.set('BEAT_2_HARBOUR_STRIKE', beat2Entities);

    // =========================================================================
    // BEAT 3: POST OFFICE DIRECT HIT (10:00)
    // Corner Mitchell and Bennett Streets. Verified civic site (9 civilians killed).
    // =========================================================================
    const beat3Entities: CesiumType.Entity[] = [];

    const postOfficeMarker = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['post-office'] }),
      position: Cesium.Cartesian3.fromDegrees(130.8443, -12.4647, 15),
      point: {
        pixelSize: 8,
        color: goldColor,
        outlineColor: darkBg,
        outlineWidth: 2,
      },
      label: {
        text: 'DARWIN POST & TELEGRAPH OFFICE · 10:00\nTHE SHELTER TRENCH RECEIVED A DIRECT HIT',
        font: '11px "IBM Plex Mono", monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
      },
      show: false,
    });
    beat3Entities.push(postOfficeMarker);
    this.stateEntityGroups.set('BEAT_3_POST_OFFICE', beat3Entities);

    // =========================================================================
    // BEAT 4: USS PEARY UNDER ATTACK IN CHANNEL (10:15–10:45)
    // Active high-speed underway evasive action sector in harbour channel.
    // Represents manoeuvre zone, not a single static pinpoint.
    // =========================================================================
    const beat4Entities: CesiumType.Entity[] = [];

    // Manoeuvre sector ellipse in Darwin Harbour Channel
    const pearyManoeuvreArea = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.832, -12.473, 5),
      ellipse: {
        semiMajorAxis: 1600,
        semiMinorAxis: 800,
        material: corridorFill,
        outline: true,
        outlineColor: corridorOutline,
        outlineWidth: 1.5,
      },
      show: false,
    });
    beat4Entities.push(pearyManoeuvreArea);

    const pearyCombatMarker = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.832, -12.473, 5),
      point: {
        pixelSize: 7,
        color: goldColor,
        outlineColor: darkBg,
        outlineWidth: 2,
      },
      label: {
        text: 'DARWIN HARBOUR CHANNEL · ACTIVE MANOEUVRE SECTOR (APPROXIMATE)\nUSS PEARY (DD-226) UNDER HIGH-SPEED EVASION · STRUCK BY 5 BOMBS',
        font: '11px "IBM Plex Mono", monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
      },
      show: false,
    });
    beat4Entities.push(pearyCombatMarker);
    this.stateEntityGroups.set('BEAT_4_PEARY_ATTACK', beat4Entities);

    // =========================================================================
    // BEAT 5: SECOND WAVE RAAF AIRFIELD (12:00)
    // Fifty-four twin-engine land bombers from Kendari and Ambon.
    // =========================================================================
    const beat5Entities: CesiumType.Entity[] = [];

    const raafMarker = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.875, -12.414, 30),
      point: {
        pixelSize: 8,
        color: goldColor,
        outlineColor: darkBg,
        outlineWidth: 2,
      },
      label: {
        text: 'RAAF STATION DARWIN · 12:00\nSECOND WAVE (54 BOMBERS) · PATTERN BOMBING (18,000–23,000 FT)',
        font: '11px "IBM Plex Mono", monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
        scaleByDistance: new Cesium.NearFarScalar(1e4, 1.0, 4e5, 0.7),
      },
      show: false,
    });
    beat5Entities.push(raafMarker);

    // Second wave high-altitude approach corridor from northwest (Beagle Gulf)
    const secondWaveCorridor = this.dataSource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          130.65, -12.20, 6500,
          130.875, -12.414, 6500,
        ]),
        width: 2.0,
        material: new Cesium.PolylineDashMaterialProperty({
          color: corridorOutline,
          dashLength: 14.0,
        }),
      },
      show: false,
    });
    beat5Entities.push(secondWaveCorridor);
    this.stateEntityGroups.set('BEAT_5_RAAF_AIRFIELD', beat5Entities);

    // =========================================================================
    // BEAT 6: USS PEARY LOST (13:00)
    // Modern Surveyed Wreck Position (Seabed Depth 27m, Chart Aus 26).
    // Protected Historic Shipwreck. Surface sinking occurred nearby.
    // =========================================================================
    const beat6Entities: CesiumType.Entity[] = [];

    const pearyWreckMarker = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['peary-wreck'] }),
      position: Cesium.Cartesian3.fromDegrees(130.8292, -12.4754, 0),
      point: {
        pixelSize: 8,
        color: goldColor,
        outlineColor: darkBg,
        outlineWidth: 2,
      },
      label: {
        text: 'USS PEARY (DD-226) · MODERN SURVEYED WRECK POSITION\nSEABED DEPTH 27M · PROTECTED HISTORIC SHIPWRECK (SUNK FOLLOWING 19 FEBRUARY ATTACK)',
        font: '11px "IBM Plex Mono", monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
      },
      show: false,
    });
    beat6Entities.push(pearyWreckMarker);
    this.stateEntityGroups.set('BEAT_6_PEARY_LOST', beat6Entities);

    // =========================================================================
    // BEAT 7 & STATE_03_WHARF: CONTEMPORARY WHARF ORIENTATION ANCHOR
    // Contemporary Stokes Hill Wharf precinct. Same wharf. Same sky.
    // Historical 1942 timber structure footprint remains unresolved.
    // =========================================================================
    const beat7Entities: CesiumType.Entity[] = [];

    const wharfContemporaryMarker = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.8485, -12.4725, 10),
      point: {
        pixelSize: 8,
        color: goldColor,
        outlineColor: darkBg,
        outlineWidth: 2,
      },
      label: {
        text: 'STOKES HILL WHARF PRECINCT · CONTEMPORARY ORIENTATION ANCHOR\nSAME WHARF. SAME SKY. (1942 TIMBER FOOTPRINT UNRESOLVED)',
        font: '11px "IBM Plex Mono", monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
      },
      show: false,
    });
    beat7Entities.push(wharfContemporaryMarker);
    this.stateEntityGroups.set('BEAT_7_RECKONING', beat7Entities);
    this.stateEntityGroups.set('STATE_03_WHARF', beat7Entities);
  }

  public setActiveState(stateId: SpatialDemonstrationStateId): void {
    if (this.activeStateId === stateId) return;
    this.activeStateId = stateId;
    this.updateVisibility();
    this.viewer.scene.requestRender();
  }

  private updateVisibility(): void {
    for (const [stateId, entities] of this.stateEntityGroups.entries()) {
      const isVisible = (stateId === this.activeStateId);
      for (const entity of entities) {
        entity.show = isVisible;
      }
    }
  }

  public destroy(): void {
    if (this.dataSource && this.viewer && !this.viewer.isDestroyed()) {
      this.viewer.dataSources.remove(this.dataSource, true);
      this.dataSource = null;
    }
    this.stateEntityGroups.clear();
  }
}
