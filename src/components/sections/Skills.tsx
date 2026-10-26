/* ============================================================
   SKILLS SECTION — Categorized Engineering Matrix
   Interactive skill categories, domain clusters, and toolchain
   ============================================================ */

import { useState } from 'react';
import { skillsData } from '../../config/site';
import './Skills.css';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Competencies', icon: '⚡' },
    ...skillsData.map((s) => ({
      id: s.id,
      name: s.name,
      icon: s.id === 'embedded-iot' ? '📡' : s.id === 'electronics' ? '🔌' : s.id === 'mechanical' ? '⚙️' : '💻',
    })),
  ];

  const displayedCategories = activeCategory === 'all'
    ? skillsData
    : skillsData.filter((c) => c.id === activeCategory);

  return (
    <section className="skills section" id="skills">
      <div className="container">
        <div className="section-header">
          <span className="section-label mono">TECHNICAL PROFICIENCY</span>
          <h2 className="section-title">Skills & Toolchain</h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="skills__tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`skills__tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="skills__tab-icon">{cat.icon}</span>
              <span className="mono">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="skills__grid">
          {displayedCategories.map((category) => (
            <div key={category.id} className="skills__card">
              <div className="skills__card-header">
                <span className="skills__category-tag mono">DOMAIN CLUSTER</span>
                <h3 className="skills__card-title">{category.name}</h3>
              </div>

              {/* Skill Chips Cloud (Clean list of skills, no proficiency ratings) */}
              <div className="skills__tags-wrap">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="skill-chip">
                    <span className="skill-chip__dot" />
                    <span className="skill-chip__name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hardware & Engineering Lab Capabilities Banner */}
        <div className="skills__lab-banner">
          <div className="skills__lab-badge mono">WORKSHOP & LAB CAPABILITIES</div>
          <div className="skills__lab-grid">
            <div className="skills__lab-item">
              <span className="mono title">Prototyping</span>
              <span className="desc">Breadboarding, perfboard routing, SMD soldering, logic analyzer debugging</span>
            </div>
            <div className="skills__lab-item">
              <span className="mono title">CAD / CAM</span>
              <span className="desc">Fusion 360 parametric solid modeling, tolerance stack-up, 3D printing slicing</span>
            </div>
            <div className="skills__lab-item">
              <span className="mono title">Protocols</span>
              <span className="desc">UART, SPI, I2C, MQTT, Wi-Fi 802.11 b/g/n, BLE advertisement</span>
            </div>
            <div className="skills__lab-item">
              <span className="mono title">Tooling</span>
              <span className="desc">KiCad EDA, PlatformIO, VS Code, Git CLI, Linux Terminal, Digital Multimeter</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
