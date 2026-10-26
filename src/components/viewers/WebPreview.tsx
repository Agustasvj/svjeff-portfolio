/* ============================================================
   WEB PREVIEW SANDBOX COMPONENT
   Responsive device switcher (Desktop, Tablet, Mobile) with
   sandboxed iframe or interactive preview simulation.
   ============================================================ */

import { useState } from 'react';
import './WebPreview.css';

interface WebPreviewProps {
  url?: string;
  title?: string;
  projectTitle?: string;
}

export default function WebPreview({
  url,
  title = 'Live Application Sandbox',
  projectTitle = 'Project Demonstration',
}: WebPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 500);
  };

  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="web-preview">
      {/* Browser Chrome Header */}
      <div className="web-preview__header">
        <div className="web-preview__dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>

        {/* URL Bar */}
        <div className="web-preview__url-bar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="mono url-text">
            {url || `https://edge.agustasvj.dev/${projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
          </span>
          <button className="web-preview__reload-btn" onClick={handleReload} title="Reload Preview">
            <svg
              className={isReloading ? 'spinning' : ''}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>

        {/* Responsive Device Switcher */}
        <div className="web-preview__devices">
          <button
            className={`web-preview__device-btn ${device === 'desktop' ? 'active' : ''}`}
            onClick={() => setDevice('desktop')}
            title="Desktop View"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
          <button
            className={`web-preview__device-btn ${device === 'tablet' ? 'active' : ''}`}
            onClick={() => setDevice('tablet')}
            title="Tablet View"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </button>
          <button
            className={`web-preview__device-btn ${device === 'mobile' ? 'active' : ''}`}
            onClick={() => setDevice('mobile')}
            title="Mobile View"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sandboxed Frame Container */}
      <div className="web-preview__stage">
        <div
          className={`web-preview__frame-wrapper device--${device}`}
          style={{ width: getDeviceWidth() }}
        >
          {url ? (
            <iframe
              src={url}
              title={title}
              sandbox="allow-scripts allow-same-origin allow-forms"
              className="web-preview__iframe"
            />
          ) : (
            <div className="web-preview__mockup">
              <div className="mockup__header">
                <div className="mockup__badge mono">SIMULATED LIVE INTERFACE</div>
                <h4>{projectTitle}</h4>
              </div>
              <div className="mockup__terminal">
                <div className="mockup__line mono green">❯ ESP32-CAM firmware booting... [OK]</div>
                <div className="mockup__line mono">❯ Initializing break-beam sensor interrupt on GPIO4...</div>
                <div className="mockup__line mono">❯ Wi-Fi connected to local mesh. IP: 192.168.1.142</div>
                <div className="mockup__line mono">❯ MQTT broker client connected: topics/access_control</div>
                <div className="mockup__line mono amber">❯ Beam interruption detected! Triggering camera frame...</div>
                <div className="mockup__line mono green">❯ Face detected (Confidence: 96.4%). Authorized: Jeffrey Murithi</div>
                <div className="mockup__line mono">❯ Access granted. Actuator pulse 500ms sent.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
