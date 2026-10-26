/* ============================================================
   3D CAD VIEWER COMPONENT — Three.js Engineering Viewport
   Features:
   - Persistent Model Loading (.glb, .gltf, .obj, .stl)
   - Interactive Centering & Centroid Pivot (No overlapping models)
   - Real-time CAD Orientation Tools (X, Y, Z rotate & Flip)
   - Orbit controls, mouse/touch rotation, zoom, camera presets
   - Fixed Pause / Play rotation toggle
   ============================================================ */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import './ThreeDViewer.css';

export type ModelType = 'sxs-spaceframe' | 'handheld-controller' | 'mtb-frame' | 'pcb' | 'esp32' | 'custom';

interface ThreeDViewerProps {
  modelType?: ModelType;
  modelUrl?: string;
  modelRotation?: [number, number, number];
  title?: string;
  onExit?: () => void;
}

export default function ThreeDViewer({
  modelType: initialModelType = 'sxs-spaceframe',
  modelUrl,
  modelRotation,
  title = 'Interactive 3D Engineering Model',
  onExit,
}: ThreeDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeModel, setActiveModel] = useState<ModelType>(modelUrl ? 'custom' : initialModelType);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activePreset, setActivePreset] = useState<'iso' | 'top' | 'front'>('iso');
  const [loadingModel, setLoadingModel] = useState(false);
  const [customFileName, setCustomFileName] = useState<string | null>(
    modelUrl ? modelUrl.split('/').pop() || null : null
  );

  // Rotation angles in degrees: [rotX, rotY, rotZ]. Default -90° X for CAD (Z-up -> Y-up)
  const [rotationAngles, setRotationAngles] = useState<[number, number, number]>(
    modelRotation || [-90, 0, 0]
  );
  const [copiedConfig, setCopiedConfig] = useState(false);

  // References for Three.js state
  const autoRotateRef = useRef(autoRotate);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const orientationPivotRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  // Keep autoRotateRef in sync with state
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Sync modelRotation prop if it changes
  useEffect(() => {
    if (modelRotation) {
      setRotationAngles(modelRotation);
    }
  }, [modelRotation]);

  // Apply real-time rotation to orientation pivot
  useEffect(() => {
    if (orientationPivotRef.current) {
      orientationPivotRef.current.rotation.set(
        (rotationAngles[0] * Math.PI) / 180,
        (rotationAngles[1] * Math.PI) / 180,
        (rotationAngles[2] * Math.PI) / 180
      );
    }
  }, [rotationAngles]);

  // Camera presets
  const setCameraPreset = (preset: 'iso' | 'top' | 'front') => {
    setActivePreset(preset);
    if (!cameraRef.current || !modelGroupRef.current) return;
    modelGroupRef.current.rotation.set(0, 0, 0);

    if (preset === 'iso') {
      cameraRef.current.position.set(12, 10, 16);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, 22, 0.01);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (preset === 'front') {
      cameraRef.current.position.set(0, 0, 20);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  // Helper: create mesh standard material
  const createMaterial = useCallback((color: number, roughness = 0.35, metalness = 0.75, emissive = 0x000000) => {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      emissive,
      wireframe,
    });
    materialsRef.current.push(mat);
    return mat;
  }, [wireframe]);

  // Mount loaded 3D Object with proper scaling, centering, and pivot
  const mountObject = useCallback((object: THREE.Object3D) => {
    if (!modelGroupRef.current) return;
    const group = modelGroupRef.current;

    // 1. Calculate bounding box & scale uniformly
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 10 / (maxDim || 1);
    object.scale.setScalar(scale);

    // 2. Recalculate box after scaling & center geometry directly at (0, 0, 0)
    box.setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);

    // 3. Clear group completely — ABSOLUTELY NO OVERLAPPING MODELS
    group.clear();

    // 4. Create orientation pivot and attach object
    const pivot = new THREE.Group();
    orientationPivotRef.current = pivot;

    pivot.rotation.set(
      (rotationAngles[0] * Math.PI) / 180,
      (rotationAngles[1] * Math.PI) / 180,
      (rotationAngles[2] * Math.PI) / 180
    );

    pivot.add(object);
    group.add(pivot);
    setLoadingModel(false);
  }, [rotationAngles]);

  // Build Procedural Engineering Models (Fallback when no modelUrl is provided)
  const populateModel = useCallback((group: THREE.Group, type: ModelType) => {
    group.clear();
    materialsRef.current = [];

    const pivot = new THREE.Group();
    orientationPivotRef.current = pivot;

    if (type === 'sxs-spaceframe') {
      const tubeMat = createMaterial(0xd8dcd6, 0.25, 0.9);
      const jointMat = createMaterial(0xffb547, 0.2, 0.8);

      const addTube = (p1: THREE.Vector3, p2: THREE.Vector3, radius = 0.12) => {
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();
        const geom = new THREE.CylinderGeometry(radius, radius, len, 12);
        const mesh = new THREE.Mesh(geom, tubeMat);
        mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        pivot.add(mesh);

        const jointGeom = new THREE.SphereGeometry(radius * 1.35, 12, 12);
        const j1 = new THREE.Mesh(jointGeom, jointMat);
        j1.position.copy(p1);
        pivot.add(j1);
      };

      const v = [
        new THREE.Vector3(-4, -1, -2), new THREE.Vector3(4, -1, -2),
        new THREE.Vector3(-4, -1, 2),  new THREE.Vector3(4, -1, 2),
        new THREE.Vector3(-2, 3, -1.8), new THREE.Vector3(2, 3, -1.8),
        new THREE.Vector3(-2, 3, 1.8),  new THREE.Vector3(2, 3, 1.8),
        new THREE.Vector3(-5.5, 0.5, 0), new THREE.Vector3(5.5, -0.5, 0),
      ];

      addTube(v[0], v[1]); addTube(v[2], v[3]); addTube(v[0], v[2]); addTube(v[1], v[3]);
      addTube(v[4], v[5]); addTube(v[6], v[7]); addTube(v[4], v[6]); addTube(v[5], v[7]);
      addTube(v[0], v[4]); addTube(v[1], v[5]); addTube(v[2], v[6]); addTube(v[3], v[7]);
      addTube(v[0], v[8]); addTube(v[2], v[8]); addTube(v[4], v[8]);
      addTube(v[1], v[9]); addTube(v[3], v[9]); addTube(v[5], v[9]);
      addTube(v[0], v[5]); addTube(v[2], v[7]);

    } else if (type === 'handheld-controller') {
      const bodyMat = createMaterial(0x1a1e24, 0.6, 0.2);
      const accentMat = createMaterial(0x91e878, 0.3, 0.8, 0x113311);
      const buttonMat = createMaterial(0xffb547, 0.4, 0.5);

      const mainGeom = new THREE.BoxGeometry(6.5, 3.2, 1.2);
      const mainMesh = new THREE.Mesh(mainGeom, bodyMat);
      pivot.add(mainMesh);

      const screenGeom = new THREE.PlaneGeometry(3.2, 2.0);
      const screenMat = new THREE.MeshStandardMaterial({ color: 0x0a1015, roughness: 0.1, metalness: 0.9 });
      const screenMesh = new THREE.Mesh(screenGeom, screenMat);
      screenMesh.position.set(0, 0.1, 0.61);
      pivot.add(screenMesh);

      const stickBaseGeom = new THREE.CylinderGeometry(0.7, 0.8, 0.3, 16);
      const stickMeshL = new THREE.Mesh(stickBaseGeom, accentMat);
      stickMeshL.rotation.x = Math.PI / 2;
      stickMeshL.position.set(-2.2, -0.3, 0.6);
      pivot.add(stickMeshL);

      const stickMeshR = stickMeshL.clone();
      stickMeshR.position.x = 2.2;
      pivot.add(stickMeshR);

      for (let i = 0; i < 4; i++) {
        const btnGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 12);
        const btn = new THREE.Mesh(btnGeom, buttonMat);
        btn.rotation.x = Math.PI / 2;
        const angle = (i * Math.PI) / 2;
        btn.position.set(2.2 + Math.cos(angle) * 0.5, 0.6 + Math.sin(angle) * 0.5, 0.7);
        pivot.add(btn);
      }

    } else if (type === 'mtb-frame') {
      const frameMat = createMaterial(0x4080bf, 0.3, 0.8);
      const addTube = (p1: THREE.Vector3, p2: THREE.Vector3, r = 0.18) => {
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();
        const geom = new THREE.CylinderGeometry(r, r, len, 16);
        const mesh = new THREE.Mesh(geom, frameMat);
        mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        pivot.add(mesh);
      };

      const bb = new THREE.Vector3(0, -1.5, 0);
      const head = new THREE.Vector3(4.5, 2.0, 0);
      const seat = new THREE.Vector3(-1.0, 1.8, 0);
      const rear = new THREE.Vector3(-5.0, -1.2, 0);

      addTube(bb, head, 0.25);
      addTube(seat, head, 0.2);
      addTube(bb, seat, 0.22);
      addTube(bb, rear, 0.15);
      addTube(seat, rear, 0.15);

    } else if (type === 'pcb' || type === 'esp32') {
      const pcbMat = createMaterial(0x0e3a1f, 0.5, 0.1);
      const traceMat = createMaterial(0xd4af37, 0.2, 0.95);
      const icMat = createMaterial(0x181a1b, 0.7, 0.2);

      const boardGeom = new THREE.BoxGeometry(6.5, 0.18, 5.0);
      const board = new THREE.Mesh(boardGeom, pcbMat);
      pivot.add(board);

      const mcuGeom = new THREE.BoxGeometry(2.4, 0.25, 2.4);
      const mcu = new THREE.Mesh(mcuGeom, icMat);
      mcu.position.set(-0.8, 0.15, 0);
      pivot.add(mcu);

      const traceGeom = new THREE.BoxGeometry(0.08, 0.05, 3.8);
      for (let i = 0; i < 7; i++) {
        const trace = new THREE.Mesh(traceGeom, traceMat);
        trace.position.set(1.0 + i * 0.25, 0.1, 0);
        pivot.add(trace);
      }
    }

    group.add(pivot);
  }, [createMaterial]);

  // Load Model from URL (for persistent project CAD assets)
  const loadModelFromUrl = useCallback(async (url: string) => {
    materialsRef.current = [];
    setLoadingModel(true);

    const fileName = url.split('/').pop() || 'model';
    setCustomFileName(fileName);
    setActiveModel('custom');

    const ext = fileName.split('.').pop()?.toLowerCase();

    const resolvedUrl = url.startsWith('/') && !url.startsWith('//') ? `.${url}` : url;

    try {
      const response = await fetch(resolvedUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      if (ext === 'glb' || ext === 'gltf') {
        const buffer = await response.arrayBuffer();
        const loader = new GLTFLoader();
        loader.parse(
          buffer,
          '',
          (gltf) => {
            const object = gltf.scene;
            object.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                if (mesh.material) {
                  materialsRef.current.push(mesh.material as THREE.Material);
                }
              }
            });
            mountObject(object);
          },
          (err) => {
            console.error('Error parsing GLTF:', err);
            setLoadingModel(false);
          }
        );
      } else if (ext === 'stl') {
        const buffer = await response.arrayBuffer();
        const loader = new STLLoader();
        const geometry = loader.parse(buffer);
        geometry.computeVertexNormals();

        // Sleek metallic chassis material for engineering STL
        const defaultMat = createMaterial(0xd0d5dd, 0.35, 0.7);
        const mesh = new THREE.Mesh(geometry, defaultMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mountObject(mesh);

      } else if (ext === 'obj') {
        const text = await response.text();
        const loader = new OBJLoader();
        const object = loader.parse(text);

        // Sleek dark technical polymer/titanium finish for CAD OBJ
        const defaultMat = createMaterial(0x718096, 0.35, 0.6);
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = defaultMat;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        mountObject(object);

      } else {
        setLoadingModel(false);
      }
    } catch (err) {
      console.warn(`Could not load persistent model from ${url}:`, err);
      setLoadingModel(false);
    }
  }, [createMaterial, mountObject]);

  // Load custom 3D model file uploaded via web button
  const handleLoadCustomFile = (file: File) => {
    materialsRef.current = [];
    setLoadingModel(true);
    setCustomFileName(file.name);
    setActiveModel('custom');

    const reader = new FileReader();
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'glb' || ext === 'gltf') {
      reader.onload = (e) => {
        const contents = e.target?.result;
        if (!contents) return;
        const loader = new GLTFLoader();
        loader.parse(
          contents as ArrayBuffer,
          '',
          (gltf) => {
            mountObject(gltf.scene);
          },
          (err) => {
            console.error('Error parsing GLTF:', err);
            setLoadingModel(false);
          }
        );
      };
      reader.readAsArrayBuffer(file);

    } else if (ext === 'obj') {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const loader = new OBJLoader();
        const object = loader.parse(text);
        const defaultMat = createMaterial(0x718096, 0.35, 0.6);
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = defaultMat;
          }
        });
        mountObject(object);
      };
      reader.readAsText(file);

    } else if (ext === 'stl') {
      reader.onload = (e) => {
        const contents = e.target?.result;
        if (!contents) return;
        try {
          const loader = new STLLoader();
          const geometry = loader.parse(contents as ArrayBuffer);
          geometry.computeVertexNormals();
          const defaultMat = createMaterial(0xd0d5dd, 0.35, 0.7);
          const mesh = new THREE.Mesh(geometry, defaultMat);
          mountObject(mesh);
        } catch (err) {
          console.error('Error parsing STL:', err);
          setLoadingModel(false);
        }
      };
      reader.readAsArrayBuffer(file);

    } else {
      alert('Supported 3D formats are .glb, .gltf, .obj, and .stl. (Export CAD models from Fusion 360, KiCad, SolidWorks, or Blender).');
      setLoadingModel(false);
    }
  };

  // Main Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x101214);

    // 2. Camera
    const width = container.clientWidth;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 10, 16);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(15, 20, 15);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.8);
    dirLight2.position.set(-15, -10, -10);
    scene.add(dirLight2);

    // 5. Grid Helper & Axes
    const gridHelper = new THREE.GridHelper(30, 30, 0x91e878, 0x2a2f36);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(3.5);
    axesHelper.position.set(-10, -3.9, -10);
    scene.add(axesHelper);

    // 6. Model Group
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // Populate initial model (or load persistent modelUrl if provided)
    if (modelUrl) {
      loadModelFromUrl(modelUrl);
    } else {
      populateModel(modelGroup, activeModel);
    }

    // 7. Interactive Mouse / Touch Dragging
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modelGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const zoomSpeed = 0.004;
      const dist = cameraRef.current.position.length();
      if (dist + e.deltaY * zoomSpeed > 4 && dist + e.deltaY * zoomSpeed < 60) {
        cameraRef.current.position.addScaledVector(
          cameraRef.current.position.clone().normalize(),
          e.deltaY * zoomSpeed
        );
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !modelGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x += deltaY * 0.008;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotateRef.current && modelGroupRef.current && !isDragging) {
        modelGroupRef.current.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 450;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      materialsRef.current.forEach((m) => m.dispose());
    };
  }, [loadModelFromUrl, modelUrl, populateModel, activeModel]);

  // Handle activeModel change (ONLY when no modelUrl is passed and not in custom mode)
  useEffect(() => {
    if (modelUrl || activeModel === 'custom') return;
    if (modelGroupRef.current) {
      populateModel(modelGroupRef.current, activeModel);
    }
  }, [activeModel, populateModel, modelUrl]);

  // Update wireframe property
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      (mat as THREE.MeshStandardMaterial).wireframe = wireframe;
    });
  }, [wireframe]);

  // Orientation Tuning Actions
  const rotateModel = (axis: 'x' | 'y' | 'z' | 'flip', degrees = 90) => {
    setRotationAngles((prev) => {
      let [x, y, z] = prev;
      if (axis === 'x') x = (x + degrees) % 360;
      if (axis === 'y') y = (y + degrees) % 360;
      if (axis === 'z') z = (z + degrees) % 360;
      if (axis === 'flip') {
        x = (x + 180) % 360;
      }
      return [x, y, z];
    });
  };

  const resetOrientation = () => {
    setRotationAngles(modelRotation || [-90, 0, 0]);
  };

  const copyOrientationConfig = () => {
    const snippet = `modelRotation: [${rotationAngles[0]}, ${rotationAngles[1]}, ${rotationAngles[2]}]`;
    navigator.clipboard.writeText(snippet);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const isCustomAsset = Boolean(modelUrl || customFileName);

  return (
    <div className="cad-viewer">
      {/* Top Header Controls */}
      <div className="cad-viewer__header">
        <div className="cad-viewer__title-box">
          <span className="cad-viewer__badge mono">3D CAD VIEWPORT</span>
          <span className="cad-viewer__title">
            {customFileName ? `Engineering Model: ${customFileName}` : title}
          </span>
        </div>

        {/* Exit 3D View action */}
        {onExit && (
          <button
            className="cad-viewer__exit-btn mono"
            onClick={onExit}
            title="Exit 3D scene and return to overview"
          >
            ← Exit 3D Scene
          </button>
        )}
      </div>

      {/* Engineering HUD Sub-bar */}
      <div className="cad-viewer__subbar">
        {/* If custom model, show Asset Badge & Orientation controls. Otherwise show procedural model selector */}
        {isCustomAsset ? (
          <div className="cad-viewer__asset-badge mono">
            <span className="cad-viewer__asset-dot" />
            <span>MODEL: <strong>{customFileName || modelUrl?.split('/').pop()}</strong></span>
          </div>
        ) : (
          <div className="cad-viewer__model-select-group">
            <label className="mono label">Engineering Model:</label>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value as ModelType)}
              className="cad-viewer__select mono"
            >
              <option value="sxs-spaceframe">🏎️ SxS Tubular Spaceframe</option>
              <option value="handheld-controller">🎮 Handheld Driving Controller</option>
              <option value="mtb-frame">🚲 Mountain Bike Frame</option>
              <option value="pcb">🖨️ Sound-Reactive LED PCB</option>
              <option value="esp32">⚡ ESP32-CAM IoT Module</option>
            </select>
          </div>
        )}

        {/* CAD Orientation Adjustment Toolbar */}
        <div className="cad-viewer__orientation-tools">
          <span className="cad-viewer__orient-label mono">Orientation:</span>
          <div className="cad-viewer__btn-group">
            <button
              className="cad-viewer__btn mono"
              onClick={() => rotateModel('x', 90)}
              title="Rotate 90° on X axis (fixes Fusion 360 / CAD Z-up orientation)"
            >
              X +90°
            </button>
            <button
              className="cad-viewer__btn mono"
              onClick={() => rotateModel('y', 90)}
              title="Rotate 90° on Y axis (turn around)"
            >
              Y +90°
            </button>
            <button
              className="cad-viewer__btn mono"
              onClick={() => rotateModel('z', 90)}
              title="Rotate 90° on Z axis (fix sideways roll)"
            >
              Z +90°
            </button>
            <button
              className="cad-viewer__btn mono"
              onClick={() => rotateModel('flip', 180)}
              title="Flip upside down (180°)"
            >
              Flip
            </button>
            <button
              className="cad-viewer__btn mono"
              onClick={resetOrientation}
              title="Reset orientation"
            >
              Reset
            </button>
          </div>

          <span className="cad-viewer__orient-degrees mono">
            [{rotationAngles[0]}°, {rotationAngles[1]}°, {rotationAngles[2]}°]
          </span>

          <button
            className="cad-viewer__btn cad-viewer__btn--copy mono"
            onClick={copyOrientationConfig}
            title="Copy modelRotation setting to paste in site.ts"
          >
            {copiedConfig ? 'Copied! ✓' : 'Copy site.ts'}
          </button>
        </div>

        {/* Viewport Controls: Camera, Wireframe, Pause/Rotate */}
        <div className="cad-viewer__controls">
          {/* Camera Presets */}
          <div className="cad-viewer__btn-group">
            <button
              className={`cad-viewer__btn ${activePreset === 'iso' ? 'active' : ''}`}
              onClick={() => setCameraPreset('iso')}
              title="Isometric Perspective"
            >
              ISO
            </button>
            <button
              className={`cad-viewer__btn ${activePreset === 'top' ? 'active' : ''}`}
              onClick={() => setCameraPreset('top')}
              title="Top View (Plan)"
            >
              TOP
            </button>
            <button
              className={`cad-viewer__btn ${activePreset === 'front' ? 'active' : ''}`}
              onClick={() => setCameraPreset('front')}
              title="Front Elevation"
            >
              FRONT
            </button>
          </div>

          {/* Wireframe toggle */}
          <button
            className={`cad-viewer__btn ${wireframe ? 'active' : ''}`}
            onClick={() => setWireframe(!wireframe)}
          >
            {wireframe ? 'Shaded' : 'Wireframe'}
          </button>

          {/* Pause / Play Auto-Rotation */}
          <button
            className={`cad-viewer__btn cad-viewer__btn--rotate ${!autoRotate ? 'paused' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause 3D rotation' : 'Resume 3D rotation'}
          >
            {autoRotate ? '⏸ Pause' : '▶ Rotate'}
          </button>

          {/* Custom File Loader (.glb / .gltf / .obj / .stl) */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".glb,.gltf,.obj,.stl"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleLoadCustomFile(e.target.files[0]);
              }
            }}
          />
          <button
            className="cad-viewer__btn cad-viewer__btn--upload mono"
            onClick={() => fileInputRef.current?.click()}
            title="Load your own CAD model (.glb, .gltf, .obj, .stl)"
          >
            + Load CAD File
          </button>
        </div>
      </div>

      {/* Main 3D Canvas */}
      <div
        className="cad-viewer__viewport"
        ref={containerRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleLoadCustomFile(e.dataTransfer.files[0]);
          }
        }}
      >
        {loadingModel && (
          <div className="cad-viewer__loading-overlay mono">
            <span className="spinner" />
            Loading CAD Mesh...
          </div>
        )}
      </div>

      {/* Footer Info & Instructions */}
      <div className="cad-viewer__footer">
        <div className="cad-viewer__hints mono">
          <span>Click & drag to inspect</span>
          <span className="dot">•</span>
          <span>Scroll to zoom</span>
          <span className="dot">•</span>
          <span>Orientation controls adjust Fusion 360 / CAD coordinate axes</span>
        </div>
        <div className="cad-viewer__format-pill mono">
          WebGL 2.0 • Formats: .obj, .stl, .glb, .gltf (Autodesk Fusion 360 / SolidWorks)
        </div>
      </div>
    </div>
  );
}
