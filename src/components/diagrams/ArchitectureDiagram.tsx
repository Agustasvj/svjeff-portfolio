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
  'esp32-face-recognition': {
    title: 'ESP32 Break-Beam Face Recognition Architecture',
    blocks: [
      {
        id: 'laser',
        label: 'Laser Emitter',
        sublabel: '650nm Red Dot',
        category: 'sensor',
        tech: 'Optical Diode (5V)',
        description: 'Emits a focused 650nm beam across the monitoring threshold to establish optical tripwire.',
        interfaces: ['5V DC', 'Ground'],
        x: 10,
        y: 25,
      },
      {
        id: 'photoreceiver',
        label: 'Break-Beam Receiver',
        sublabel: 'Phototransistor Array',
        category: 'sensor',
        tech: 'IR/Optical Detection',
        description: 'Continuously detects laser signal. Interruption triggers digital LOW pulse interrupt on GPIO.',
        interfaces: ['GPIO Interrupt (D4)', '3.3V DC'],
        x: 10,
        y: 70,
      },
      {
        id: 'esp32cam',
        label: 'ESP32-CAM',
        sublabel: 'Dual-core Xtensa LX6',
        category: 'compute',
        tech: 'ESP32-S + OV2640 2MP',
        description: 'Core embedded processing unit. Handles hardware interrupt, camera frame capture, face detection neural network model, and Wi-Fi transmission.',
        interfaces: ['DVP Camera Bus', 'Wi-Fi 802.11 b/g/n', 'UART0', 'SPI Flash'],
        x: 48,
        y: 45,
      },
      {
        id: 'power',
        label: 'Power Regulation',
        sublabel: 'AMS1117-3.3 & 5V PSU',
        category: 'power',
        tech: 'Low-dropout regulator',
        description: 'Clean stepped-down regulated power rail providing up to 800mA peak current for Wi-Fi burst transmissions.',
        interfaces: ['5V Input', '3.3V Regulated Output'],
        x: 48,
        y: 85,
      },
      {
        id: 'statusled',
        label: 'LED & Buzzer Alert',
        sublabel: 'Status Feedback',
        category: 'actuator',
        tech: 'Active Buzzer + RGB LED',
        description: 'Auditory and visual indicators confirming user authentication or unauthorized perimeter breach.',
        interfaces: ['PWM GPIO12', 'GPIO13'],
        x: 85,
        y: 25,
      },
      {
        id: 'nodemcu',
        label: 'Telemetry Gateway',
        sublabel: 'NodeMCU ESP8266',
        category: 'cloud',
        tech: 'MQTT / HTTP REST API',
        description: 'Optional edge broker forwarder routing snapshot alerts, timestamps, and recognition metadata to local network dashboard.',
        interfaces: ['MQTT over Wi-Fi', 'REST Client'],
        x: 85,
        y: 70,
      },
    ],
    connections: [
      { from: 'photoreceiver', to: 'esp32cam', bus: 'GPIO', label: 'Interrupt Trigger' },
      { from: 'power', to: 'esp32cam', bus: '5V DC', label: 'VCC / GND' },
      { from: 'esp32cam', to: 'statusled', bus: 'PWM', label: 'Auth Status' },
      { from: 'esp32cam', to: 'nodemcu', bus: 'Wi-Fi', label: 'MQTT Telemetry' },
    ],
  },
  'sound-reactive-led': {
    title: 'Sound-Reactive LED Controller PCB System',
    blocks: [
      {
        id: 'mic',
        label: 'Electret Microphone',
        sublabel: 'MAX4466 Module',
        category: 'sensor',
        tech: 'Acoustic Transducer',
        description: 'Captures ambient sound pressure waves and converts them to low-level analog AC signals.',
        interfaces: ['Analog Out', '3.3V DC'],
        x: 10,
        y: 30,
      },
      {
        id: 'preamp',
        label: 'Analog Pre-Amp & Filter',
        sublabel: 'Active Bandpass / AGC',
        category: 'sensor',
        tech: 'Op-Amp Filter Stage',
        description: 'Boosts millivolt audio signal and isolates rhythmic bass frequencies while preventing saturation.',
        interfaces: ['ADC Input', 'VRef'],
        x: 35,
        y: 30,
      },
      {
        id: 'mcu',
        label: 'Microcontroller Core',
        sublabel: 'ATmega328P / ESP32',
        category: 'compute',
        tech: 'Embedded C++ FFT Engine',
        description: 'Samples analog audio at 40kHz, performs real-time Fast Fourier Transform (FFT) or envelope detection, and synthesizes LED animation algorithms.',
        interfaces: ['10-bit ADC', 'SPI / FastLED', 'IR GPIO'],
        x: 60,
        y: 45,
      },
      {
        id: 'ir',
        label: 'IR Remote Receiver',
        sublabel: 'TSOP38238 38kHz',
        category: 'sensor',
        tech: 'NEC Protocol Decoder',
        description: 'Allows wireless user control of animation patterns, sensitivity, palette selection, and power state.',
        interfaces: ['Digital GPIO', '3.3V DC'],
        x: 10,
        y: 75,
      },
      {
        id: 'leddriver',
        label: 'WS2812B Addressable LED Strip',
        sublabel: '5V High-Density RGB',
        category: 'actuator',
        tech: '800kHz NRZ Data Protocol',
        description: 'Multi-channel individually addressable LED array dynamically illuminating reactive frequencies.',
        interfaces: ['High-speed Data Line', '5V High Current Rail'],
        x: 88,
        y: 45,
      },
    ],
    connections: [
      { from: 'mic', to: 'preamp', bus: 'GPIO', label: 'Raw AC Audio' },
      { from: 'preamp', to: 'mcu', bus: 'GPIO', label: 'Filtered Audio (ADC)' },
      { from: 'ir', to: 'mcu', bus: 'UART', label: 'Remote Commands' },
      { from: 'mcu', to: 'leddriver', bus: 'SPI', label: '800kHz Frame Data' },
    ],
  },
};

export default function ArchitectureDiagram({ architecture, defaultProjectId = 'esp32-face-recognition' }: ArchitectureDiagramProps) {
  const activeArch = architecture || DEFAULT_ARCHITECTURES[defaultProjectId] || DEFAULT_ARCHITECTURES['esp32-face-recognition'];
  const [selectedBlock, setSelectedBlock] = useState<ArchBlock | null>(activeArch.blocks[1] || null);
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
