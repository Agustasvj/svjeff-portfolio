/* ============================================================
   ARCHITECTURE DIAGRAM COMPONENT
   Displays authentic system flowcharts with full-screen zoomable
   inspection modal and interactive signal bus explorer.
   ============================================================ */

import { useState } from 'react';
import './ArchitectureDiagram.css';

export interface ArchBlock {
  id: string;
  label: string;
  sublabel?: string;
  category: 'sensor' | 'compute' | 'power' | 'comm' | 'actuator' | 'cloud';
  tech: string;
  description: string;
  interfaces?: string[];
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface ArchConnection {
  from: string;
  to: string;
  bus: 'I2C' | 'SPI' | 'UART' | 'GPIO' | 'Wi-Fi' | '5V DC' | 'PWM';
  label?: string;
}

export interface SystemArchitecture {
  title: string;
  blocks: ArchBlock[];
  connections: ArchConnection[];
}

interface ArchitectureDiagramProps {
  architecture?: SystemArchitecture;
  defaultProjectId?: string;
}

interface CustomDiagramMeta {
  title: string;
  image: string;
  sourceUrl: string;
  description: string;
}

const CUSTOM_DIAGRAMS: Record<string, CustomDiagramMeta> = {
  'vforce-txrx': {
    title: 'VFORCE RC Transmitter & Base Station Architecture',
    image: './assets/diagrams/vforce-txrx-diagram.png',
    sourceUrl: 'https://github.com/Agustasvj/VFORCETXRX',
    description:
      'Complete system flow detailing RC Pilot interaction, Pilot Interfaces (Mobile Control Surface & PC Dashboard), Base Station WebSocket & API Server, 16-Channel Engine, and Hardware Receiver UDP stream.',
  },
  'sim-wheel': {
    title: 'VForce Sim Wheel Virtual Controller System Architecture',
    image: './assets/diagrams/sim-wheel-diagram.png',
    sourceUrl: 'https://github.com/Agustasvj/SIM_WHEEL1',
    description:
      'Runtime architecture detailing Phone and PC Users, Mobile Controller & Driving View, FastAPI Server Runtime, Assetto Corsa Shared Memory Telemetry, and OS Gamepad Driver output.',
  },
  afyalink: {
    title: 'AfyaLink Offline-First Continuity Platform Architecture',
    image: './assets/diagrams/afyalink-diagram.png',
    sourceUrl: 'https://github.com/Agustasvj/afyalink',
    description:
      'System component architecture detailing Health Worker & Community Member flows, App Routing, Local Storage Persistence, Supabase Cloud Store sync, Safety & Portability, and Follow-Up Domain models.',
  },
};

const DEFAULT_ARCHITECTURES: Record<string, SystemArchitecture> = {
  'vforce-txrx': {
    title: 'VForce RC TX/RX Signal Flow',
    blocks: [
      {
        id: 'phone-ui',
        label: 'Touch Controller UI',
        sublabel: 'Mobile Web Interface',
        category: 'sensor',
        tech: 'HTML5 Touch API + WebSockets',
        description: 'Responsive smartphone touch dashboard with dual virtual joysticks, trim sliders, multi-position aux switches, and channel mapping.',
        interfaces: ['Touch Gestures', 'WebSocket Client'],
        x: 10,
        y: 25,
      },
      {
        id: 'telemetry-stream',
        label: 'Live Telemetry HUD',
        sublabel: 'OLED / Web Graphing',
        category: 'cloud',
        tech: 'Bidirectional Telemetry',
        description: 'Displays real-time vehicle battery voltage, RSSI signal strength, link latency, and failsafe status flags.',
        interfaces: ['HUD Dashboard', 'Audio Alerts'],
        x: 10,
        y: 70,
      },
      {
        id: 'fastapi-core',
        label: 'VForce Base Station Core',
        sublabel: 'FastAPI / Python Engine',
        category: 'compute',
        tech: 'Async Python + UDP Socket',
        description: 'High-frequency RC mixing engine handling exponential rates, channel end-points, failsafe timeout watchdog, and 60Hz binary packet serialization.',
        interfaces: ['WebSocket Server', 'UDP Broadcast Socket', 'HTTP REST API'],
        x: 48,
        y: 45,
      },
      {
        id: 'power-rail',
        label: 'Regulated Power Subsystem',
        sublabel: 'BEC / 5V DC Regulator',
        category: 'power',
        tech: 'Switch-mode BEC (2S-6S)',
        description: 'Provides clean stepped-down 5V/3.3V power rails for microcontrollers and high-torque steering servos.',
        interfaces: ['7.4V-22.2V LiPo', '5V BEC Output'],
        x: 48,
        y: 85,
      },
      {
        id: 'esp32-rx',
        label: 'ESP32 Receiver Node',
        sublabel: 'Edge Hardware Node',
        category: 'compute',
        tech: 'ESP32 Dual Core @ 240MHz',
        description: 'Receives binary UDP packets, verifies CRC checksums, executes failsafe hold/cut on link loss, and outputs 16-channel hardware PWM.',
        interfaces: ['802.11 Wi-Fi Direct / AP', '16x Hardware PWM', 'ADC Battery Sensor'],
        x: 75,
        y: 35,
      },
      {
        id: 'actuators',
        label: 'Servos & Brushless ESCs',
        sublabel: 'Vehicle Drive & Control',
        category: 'actuator',
        tech: '50Hz-400Hz PWM / DShot',
        description: 'Steering servos, throttle electronic speed controllers (ESCs), pan/tilt camera gimbals, and auxiliary relays.',
        interfaces: ['PWM Signal (1000-2000µs)', 'GND / 5V-6V Power'],
        x: 90,
        y: 75,
      },
    ],
    connections: [
      { from: 'phone-ui', to: 'fastapi-core', bus: 'Wi-Fi', label: 'WebSocket Touch Data' },
      { from: 'fastapi-core', to: 'esp32-rx', bus: 'Wi-Fi', label: '60Hz UDP Binary Stream' },
      { from: 'esp32-rx', to: 'actuators', bus: 'PWM', label: '16x PWM Channel Signals' },
      { from: 'power-rail', to: 'esp32-rx', bus: '5V DC', label: 'Regulated 5V Rail' },
      { from: 'esp32-rx', to: 'telemetry-stream', bus: 'Wi-Fi', label: 'Battery / RSSI Feedback' },
    ],
  },
  'sim-wheel': {
    title: 'VForce Sim Wheel Signal Flow',
    blocks: [
      {
        id: 'gyro-sensor',
        label: 'Smartphone Motion Sensors',
        sublabel: 'IMU / Gyroscope & Accelerometer',
        category: 'sensor',
        tech: 'DeviceOrientation Event API',
        description: 'Extracts real-time pitch, roll, and yaw angles (Alpha, Beta, Gamma) at 60Hz from mobile browser sensors with zero external hardware.',
        interfaces: ['HTML5 Orientation API', 'Touch Interface'],
        x: 15,
        y: 35,
      },
      {
        id: 'web-controller',
        label: 'Mobile Web App Controller',
        sublabel: 'Full-screen Web App',
        category: 'compute',
        tech: 'Responsive Web Client',
        description: 'Provides touch buttons for paddle shifters, DRS, handbrake, and on-screen telemetry overlays with deadzone calibration.',
        interfaces: ['WebSocket Client', 'Haptic Vibration API'],
        x: 48,
        y: 35,
      },
      {
        id: 'virtual-joystick-bridge',
        label: 'Host PC Gamepad Bridge',
        sublabel: 'Python vJoy / ViGEm Daemon',
        category: 'cloud',
        tech: 'vJoy SDK / ViGEmBus',
        description: 'Translates mobile orientation angles and button taps into a native Windows DirectInput / XInput virtual gamepad controller device.',
        interfaces: ['WebSocket Server', 'Virtual USB Emulation'],
        x: 48,
        y: 80,
      },
      {
        id: 'sim-game',
        label: 'PC Racing Simulator',
        sublabel: 'Game Physics Engine',
        category: 'actuator',
        tech: 'Assetto Corsa / F1 23 / Forza',
        description: 'Directly accepts steering axis input from the virtual controller driver with sub-millisecond response latency.',
        interfaces: ['DirectInput / XInput Axis'],
        x: 85,
        y: 80,
      },
    ],
    connections: [
      { from: 'gyro-sensor', to: 'web-controller', bus: 'GPIO', label: 'Gyroscope Telemetry' },
      { from: 'web-controller', to: 'virtual-joystick-bridge', bus: 'Wi-Fi', label: 'Low-latency WebSockets' },
      { from: 'virtual-joystick-bridge', to: 'sim-game', bus: 'UART', label: 'Virtual DirectInput Axes' },
    ],
  },
  afyalink: {
    title: 'AfyaLink Offline Continuity Signal Flow',
    blocks: [
      {
        id: 'client-pwa',
        label: 'Healthcare Provider PWA',
        sublabel: 'React 18 + Vite Web App',
        category: 'compute',
        tech: 'TypeScript + TailwindCSS',
        description: 'Intuitive point-of-care clinical interface designed for low-connectivity rural health posts, clinics, and community health volunteers.',
        interfaces: ['ServiceWorker Cache', 'Responsive UI'],
        x: 15,
        y: 30,
      },
      {
        id: 'local-store',
        label: 'Offline Database Store',
        sublabel: 'IndexedDB / LocalStorage Cache',
        category: 'compute',
        tech: 'Encrypted Browser Persistence',
        description: 'Provides durable local persistence for EHRs, diagnostic logs, and medication histories even during protracted blackout and cellular outage.',
        interfaces: ['LocalStorage Driver', 'AES-256 Storage'],
        x: 48,
        y: 30,
      },
      {
        id: 'sync-gateway',
        label: 'Delta Synchronization Gateway',
        sublabel: 'Background Sync Engine',
        category: 'cloud',
        tech: 'Supabase Cloud Store / Microservice',
        description: 'Performs bidirectional conflict resolution and incremental delta sync automatically once an Internet or SMS uplink is detected.',
        interfaces: ['RESTful HTTPS', 'WebSocket Sync'],
        x: 82,
        y: 30,
      },
      {
        id: 'central-moh',
        label: 'National Health Registry',
        sublabel: 'MOH & Hospital Core',
        category: 'cloud',
        tech: 'FHIR Compliant EHR Cloud',
        description: 'Centralized health record archive aggregating demographic statistics, disease surveillance data, and longitudinal care records.',
        interfaces: ['HL7 / FHIR API', 'SQL Data Lake'],
        x: 82,
        y: 75,
      },
    ],
    connections: [
      { from: 'client-pwa', to: 'local-store', bus: 'SPI', label: 'Local Encrypted Transactions' },
      { from: 'local-store', to: 'sync-gateway', bus: 'Wi-Fi', label: 'Opportunistic HTTPS Sync' },
      { from: 'sync-gateway', to: 'central-moh', bus: 'Wi-Fi', label: 'FHIR Upstream Ingestion' },
    ],
  },
};

export default function ArchitectureDiagram({
  architecture,
  defaultProjectId = 'vforce-txrx',
}: ArchitectureDiagramProps) {
  const customDiagram = CUSTOM_DIAGRAMS[defaultProjectId];
  const activeArch =
    architecture || DEFAULT_ARCHITECTURES[defaultProjectId] || DEFAULT_ARCHITECTURES['vforce-txrx'];

  const [viewMode, setViewMode] = useState<'diagram' | 'bus'>(
    customDiagram ? 'diagram' : 'bus'
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedBlock, setSelectedBlock] = useState<ArchBlock | null>(activeArch?.blocks[0] || null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Layers' },
    { key: 'sensor', label: 'Sensors / Input' },
    { key: 'compute', label: 'Compute / MCU' },
    { key: 'actuator', label: 'Actuators / Output' },
    { key: 'power', label: 'Power Rail' },
    { key: 'cloud', label: 'Telemetry / Cloud' },
  ];

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.5, 3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="arch-diagram">
      {/* Header */}
      <div className="arch-diagram__header">
        <div className="arch-diagram__title-row">
          <span className="arch-diagram__badge mono">SYSTEM ARCHITECTURE</span>
          <h3 className="arch-diagram__title">
            {customDiagram ? customDiagram.title : activeArch.title}
          </h3>
        </div>

        <div className="arch-diagram__view-toggle">
          {customDiagram && (
            <button
              className={`arch-diagram__toggle-btn ${viewMode === 'diagram' ? 'active' : ''}`}
              onClick={() => setViewMode('diagram')}
            >
              Architecture Diagram
            </button>
          )}
          <button
            className={`arch-diagram__toggle-btn ${viewMode === 'bus' ? 'active' : ''}`}
            onClick={() => setViewMode('bus')}
          >
            Signal & Bus Flow
          </button>
          {customDiagram && viewMode === 'diagram' && (
            <button
              className="arch-diagram__toggle-btn mono"
              onClick={() => {
                setZoomLevel(1);
                setLightboxOpen(true);
              }}
              title="Inspect Full Diagram"
              style={{ color: 'var(--color-accent-green)' }}
            >
              Inspect 🔍
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: CUSTOM OFFICIAL DIAGRAM (IMAGE SHOWCASE) */}
      {viewMode === 'diagram' && customDiagram && (
        <div className="arch-diagram__image-container">
          <div
            className="arch-diagram__image-frame"
            onClick={() => {
              setZoomLevel(1);
              setLightboxOpen(true);
            }}
            title="Click to zoom / inspect diagram in full resolution"
          >
            <img
              src={customDiagram.image}
              alt={customDiagram.title}
              className="arch-diagram__img"
              loading="lazy"
            />
          </div>
          <p className="arch-diagram__image-caption mono">
            {customDiagram.description} — <span style={{ color: 'var(--color-accent-green)', cursor: 'pointer' }} onClick={() => { setZoomLevel(1); setLightboxOpen(true); }}>Click to inspect full resolution ↗</span>
          </p>
        </div>
      )}

      {/* MODE 2: INTERACTIVE SIGNAL BUS EXPLORER */}
      {viewMode === 'bus' && (
        <>
          <div style={{ padding: 'var(--space-2) var(--space-6)', background: 'var(--color-bg-elevated)', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div className="arch-diagram__filters">
              {categories.map((c) => (
                <button
                  key={c.key}
                  className={`arch-diagram__filter-btn ${activeFilter === c.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="arch-diagram__canvas-wrapper">
            <div className="arch-diagram__canvas">
              {/* Signal Bus Connection Lines (SVG) */}
              <svg className="arch-diagram__lines" viewBox="0 0 1000 500" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#91E878" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFB547" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {activeArch.connections.map((conn, idx) => {
                  const fromBlock = activeArch.blocks.find((b) => b.id === conn.from);
                  const toBlock = activeArch.blocks.find((b) => b.id === conn.to);
                  if (!fromBlock || !toBlock) return null;

                  const x1 = fromBlock.x * 10;
                  const y1 = fromBlock.y * 5;
                  const x2 = toBlock.x * 10;
                  const y2 = toBlock.y * 5;
                  const midX = (x1 + x2) / 2;

                  return (
                    <g key={idx} className="arch-diagram__connection-group">
                      <path
                        d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                        className="arch-diagram__path-bg"
                      />
                      <path
                        d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                        className="arch-diagram__path-active"
                        filter="url(#glow)"
                      />
                      {conn.label && (
                        <text
                          x={midX}
                          y={(y1 + y2) / 2 - 8}
                          className="arch-diagram__path-label"
                          textAnchor="middle"
                        >
                          {conn.label} ({conn.bus})
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Architecture Blocks */}
              {activeArch.blocks.map((block) => {
                const isDimmed = activeFilter !== 'all' && activeFilter !== block.category;
                const isSelected = selectedBlock?.id === block.id;

                return (
                  <div
                    key={block.id}
                    className={`arch-block arch-block--${block.category} ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`}
                    style={{ left: `${block.x}%`, top: `${block.y}%` }}
                    onClick={() => setSelectedBlock(block)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="arch-block__header">
                      <span className="arch-block__cat mono">{block.category}</span>
                      <span className="arch-block__dot" />
                    </div>
                    <div className="arch-block__label">{block.label}</div>
                    {block.sublabel && <div className="arch-block__sublabel">{block.sublabel}</div>}
                    <div className="arch-block__tech mono">{block.tech}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Inspector Bar */}
          {selectedBlock && (
            <div className="arch-diagram__inspector">
              <div className="arch-diagram__inspector-header">
                <span className="mono arch-diagram__inspector-title">
                  NODE INSPECTION: {selectedBlock.label}
                </span>
                <span className="mono arch-diagram__inspector-tech">{selectedBlock.tech}</span>
              </div>
              <p className="arch-diagram__inspector-desc">{selectedBlock.description}</p>
              {selectedBlock.interfaces && (
                <div className="arch-diagram__inspector-interfaces">
                  <span className="mono label">Interfaces & Buses:</span>
                  <div className="arch-diagram__inspector-tags">
                    {selectedBlock.interfaces.map((bus) => (
                      <span key={bus} className="arch-diagram__inspector-tag mono">
                        {bus}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* FULL-RESOLUTION LIGHTBOX MODAL */}
      {lightboxOpen && customDiagram && (
        <div className="image-viewer-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="image-viewer" onClick={(e) => e.stopPropagation()}>
            <div className="image-viewer__bar">
              <span className="mono image-viewer__counter">{customDiagram.title}</span>

              <div className="image-viewer__zoom-controls">
                <button className="image-viewer__btn" onClick={handleZoomOut} title="Zoom Out">
                  -
                </button>
                <span className="mono zoom-text">{Math.round(zoomLevel * 100)}%</span>
                <button className="image-viewer__btn" onClick={handleZoomIn} title="Zoom In">
                  +
                </button>
                <button className="image-viewer__btn mono" onClick={handleResetZoom}>
                  Reset
                </button>
              </div>

              <button
                className="image-viewer__close"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close diagram viewer"
              >
                ✕
              </button>
            </div>

            <div className="image-viewer__stage" style={{ overflow: 'auto' }}>
              <img
                src={customDiagram.image}
                alt={customDiagram.title}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                  maxWidth: '90%',
                  maxHeight: zoomLevel === 1 ? '82vh' : 'none',
                  objectFit: 'contain',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
