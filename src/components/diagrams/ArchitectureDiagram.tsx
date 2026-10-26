/* ============================================================
   ARCHITECTURE DIAGRAM COMPONENT
   Interactive engineering block diagram for IoT & Embedded Systems
   Supports node selection, pinout/bus inspection, and signal flow
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

const DEFAULT_ARCHITECTURES: Record<string, SystemArchitecture> = {
  'vforce-txrx': {
    title: 'VForce RC TX/RX 16-Channel Telemetry Architecture',
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
    title: 'VForce Sim Wheel Virtual Controller Architecture',
    blocks: [
      {
        id: 'ergonomic-rim',
        label: '3D Printed Wheel Rim',
        sublabel: 'PORTABLE_WHEEL CAD Assembly',
        category: 'actuator',
        tech: 'Parametric CAD + 3D Print',
        description: 'Ergonomic racing wheel rim featuring integral smartphone mounting cradle, thumb indents, and magnetic paddle shifters.',
        interfaces: ['Mechanical Clamp', 'Tactile Shifter Springs'],
        x: 10,
        y: 25,
      },
      {
        id: 'gyro-sensor',
        label: 'Smartphone Motion Sensors',
        sublabel: 'IMU / Gyroscope & Accelerometer',
        category: 'sensor',
        tech: 'DeviceOrientation Event API',
        description: 'Extracts real-time pitch, roll, and yaw angles (Alpha, Beta, Gamma) at 60Hz from mobile browser sensors with zero external hardware.',
        interfaces: ['HTML5 Orientation API', 'Touch Interface'],
        x: 10,
        y: 70,
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
        y: 45,
      },
      {
        id: 'virtual-joystick-bridge',
        label: 'Host PC Gamepad Bridge',
        sublabel: 'Python vJoy / ViGEm Daemon',
        category: 'cloud',
        tech: 'vJoy SDK / ViGEmBus',
        description: 'Translates mobile orientation angles and button taps into a native Windows DirectInput / XInput virtual gamepad controller device.',
        interfaces: ['WebSocket Server', 'Virtual USB Emulation'],
        x: 75,
        y: 35,
      },
      {
        id: 'sim-game',
        label: 'PC Racing Simulator',
        sublabel: 'Game Physics Engine',
        category: 'actuator',
        tech: 'Assetto Corsa / F1 23 / Forza',
        description: 'Directly accepts steering axis input from the virtual controller driver with sub-millisecond response latency.',
        interfaces: ['DirectInput / XInput Axis'],
        x: 90,
        y: 75,
      },
    ],
    connections: [
      { from: 'gyro-sensor', to: 'web-controller', bus: 'GPIO', label: 'Gyroscope Telemetry' },
      { from: 'ergonomic-rim', to: 'gyro-sensor', bus: 'GPIO', label: 'Physical Steering Input' },
      { from: 'web-controller', to: 'virtual-joystick-bridge', bus: 'Wi-Fi', label: 'Low-latency WebSockets' },
      { from: 'virtual-joystick-bridge', to: 'sim-game', bus: 'UART', label: 'Virtual DirectInput Axes' },
    ],
  },
  'afyalink': {
    title: 'AfyaLink Offline-First Continuity Architecture',
    blocks: [
      {
        id: 'client-pwa',
        label: 'Healthcare Provider PWA',
        sublabel: 'React 18 + Vite Web App',
        category: 'compute',
        tech: 'TypeScript + TailwindCSS',
        description: 'Intuitive point-of-care clinical interface designed for low-connectivity rural health posts, clinics, and community health volunteers.',
        interfaces: ['ServiceWorker Cache', 'Responsive UI'],
        x: 10,
        y: 25,
      },
      {
        id: 'qr-exchange',
        label: 'Optical Patient Record QR',
        sublabel: 'Zero-Network Transfer',
        category: 'sensor',
        tech: 'Compressed Encrypted QR Code',
        description: 'Enables instant patient history and prescription transfers between non-networked clinics via high-density 2D optical barcodes.',
        interfaces: ['Camera Scanner', 'Display QR Generator'],
        x: 10,
        y: 70,
      },
      {
        id: 'local-store',
        label: 'Offline Database Store',
        sublabel: 'IndexedDB / PouchDB Cache',
        category: 'compute',
        tech: 'Encrypted Browser Persistence',
        description: 'Provides durable local persistence for EHRs, diagnostic logs, and medication histories even during protracted blackout and cellular outage.',
        interfaces: ['IndexedDB Driver', 'AES-256 Storage'],
        x: 48,
        y: 45,
      },
      {
        id: 'sync-gateway',
        label: 'Delta Synchronization Gateway',
        sublabel: 'Background Sync Engine',
        category: 'cloud',
        tech: 'CouchDB / Node.js Microservice',
        description: 'Performs bidirectional conflict resolution and incremental delta sync automatically once an Internet or SMS uplink is detected.',
        interfaces: ['RESTful HTTPS', 'WebSocket Sync'],
        x: 75,
        y: 35,
      },
      {
        id: 'central-moh',
        label: 'National Health Registry',
        sublabel: 'MOH & Hospital Core',
        category: 'cloud',
        tech: 'FHIR Compliant EHR Cloud',
        description: 'Centralized health record archive aggregating demographic statistics, disease surveillance data, and longitudinal care records.',
        interfaces: ['HL7 / FHIR API', 'SQL Data Lake'],
        x: 90,
        y: 75,
      },
    ],
    connections: [
      { from: 'client-pwa', to: 'local-store', bus: 'SPI', label: 'Local Encrypted Transactions' },
      { from: 'qr-exchange', to: 'client-pwa', bus: 'UART', label: 'Optical Barcode Transfer' },
      { from: 'local-store', to: 'sync-gateway', bus: 'Wi-Fi', label: 'Opportunistic HTTPS Sync' },
      { from: 'sync-gateway', to: 'central-moh', bus: 'Wi-Fi', label: 'FHIR Upstream Ingestion' },
    ],
  },
};

export default function ArchitectureDiagram({ architecture, defaultProjectId = 'vforce-txrx' }: ArchitectureDiagramProps) {
  const activeArch = architecture || DEFAULT_ARCHITECTURES[defaultProjectId] || DEFAULT_ARCHITECTURES['vforce-txrx'];
  const [selectedBlock, setSelectedBlock] = useState<ArchBlock | null>(activeArch?.blocks[1] || null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Layers' },
    { key: 'sensor', label: 'Sensors / Input' },
    { key: 'compute', label: 'Compute / MCU' },
    { key: 'actuator', label: 'Actuators / Output' },
    { key: 'power', label: 'Power Rail' },
    { key: 'cloud', label: 'Telemetry / Cloud' },
  ];

  return (
    <div className="arch-diagram">
      <div className="arch-diagram__header">
        <div className="arch-diagram__title-row">
          <span className="arch-diagram__badge mono">SYSTEM ARCHITECTURE</span>
          <h3 className="arch-diagram__title">{activeArch.title}</h3>
        </div>

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
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
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
                style={{
                  left: `${block.x}%`,
                  top: `${block.y}%`,
                }}
                onClick={() => setSelectedBlock(block)}
                role="button"
                tabIndex={0}
                aria-label={`Block: ${block.label}`}
              >
                <div className="arch-block__tag mono">{block.category.toUpperCase()}</div>
                <div className="arch-block__label">{block.label}</div>
                {block.sublabel && <div className="arch-block__sublabel mono">{block.sublabel}</div>}
                <div className="arch-block__tech mono">{block.tech}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Spec Inspector Panel */}
      {selectedBlock && (
        <div className="arch-diagram__inspector">
          <div className="arch-diagram__inspector-header">
            <span className="arch-diagram__inspector-badge mono">NODE SPECIFICATION</span>
            <span className="arch-diagram__inspector-cat mono">{selectedBlock.category.toUpperCase()}</span>
          </div>

          <h4 className="arch-diagram__inspector-title">{selectedBlock.label}</h4>
          <p className="arch-diagram__inspector-desc">{selectedBlock.description}</p>

          <div className="arch-diagram__inspector-meta">
            <div className="arch-diagram__inspector-field">
              <span className="mono label">Silicon / Component</span>
              <span className="mono value">{selectedBlock.tech}</span>
            </div>

            {selectedBlock.interfaces && (
              <div className="arch-diagram__inspector-field">
                <span className="mono label">Supported Interfaces & Busses</span>
                <div className="arch-diagram__inspector-tags">
                  {selectedBlock.interfaces.map((iface) => (
                    <span key={iface} className="arch-diagram__inspector-tag mono">{iface}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
