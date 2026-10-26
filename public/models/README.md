# 3D CAD Models Directory

Place your 3D CAD models (.glb, .gltf, .obj, .stl) in this folder (`public/models/`).

### Supported Formats:
- **`.glb`** (Binary glTF - recommended, full materials & compact)
- **`.gltf`** (Standard glTF)
- **`.stl`** (Stereolithography - standard CAD & 3D printing export from Fusion 360, SolidWorks, KiCad)
- **`.obj`** (Wavefront OBJ)

### How to link a persistent model to a project:
In `src/config/site.ts`, add the `modelUrl` property to any project in `staticProjects`:

```ts
{
  id: 'sxs-spaceframe',
  title: 'Custom SxS Tubular Spaceframe',
  modelUrl: '/models/sxs-spaceframe.glb', // or .stl, .obj
  ...
}
```

When you view that project in your portfolio, the 3D CAD viewer will automatically and persistently load your actual file!
