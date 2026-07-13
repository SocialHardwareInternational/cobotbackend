// Viewport3D -- the live 3D digital twin: real STL meshes driven by the measured
// joint state at render rate, TCP triad + trace, safety planes, ghost preview.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { robot } from "../api/robot";
import { liveState, useStore } from "../store";
import { CHAIN, MESH_NAMES, originMatrix } from "./kinematics";

export interface ViewportProps { showPlanes?: boolean; ghostQ?: number[] | null }

interface Rig { joints: THREE.Group[]; links: THREE.Group[] }

function buildRig(scene: THREE.Scene, material: THREE.Material): Rig {
  // base link mesh sits in the world; joint i group applies origin*rot(q) and owns link i+1 mesh
  const joints: THREE.Group[] = [];
  const links: THREE.Group[] = [];
  let parent: THREE.Object3D = scene;
  for (let i = 0; i < 6; i++) {
    const j = new THREE.Group();          // origin transform + joint rotation
    j.matrixAutoUpdate = false;
    parent.add(j);
    joints.push(j);
    const l = new THREE.Group();          // holds the STL for link i+1
    j.add(l);
    links.push(l);
    parent = j;
  }
  void material;
  return { joints, links };
}

export default function Viewport3D({ showPlanes = true, ghostQ = null }: ViewportProps) {
  const holder = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<number[] | null>(ghostQ);
  ghostRef.current = ghostQ;
  const showPlanesRef = useRef(showPlanes);
  showPlanesRef.current = showPlanes;
  const [meshesLoaded, setMeshesLoaded] = useState(0);
  const host = useStore((s) => s.host);
  const [follow, setFollow] = useState(false);
  const followRef = useRef(follow);
  followRef.current = follow;
  const traceRef = useRef(true);

  useEffect(() => {
    const el = holder.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.05, 40);
    camera.position.set(1.8, -1.6, 1.35);
    camera.up.set(0, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0.45);
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.maxDistance = 8;

    scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x20242e, 1.05));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(2.2, -1.6, 3.2);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x88b7ff, 0.5);
    rim.position.set(-2.5, 2.0, 1.2);
    scene.add(rim);

    const grid = new THREE.GridHelper(4, 40, 0x2a3550, 0x1a2130);
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdadfe8, metalness: 0.55, roughness: 0.42 });
    const jointMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5, roughness: 0.5 });
    const ghostMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.28, depthWrite: false });

    const rig = buildRig(scene, bodyMat);
    const ghostRig = buildRig(scene, ghostMat);
    const ghostRoot = ghostRig.joints[0];

    const loader = new STLLoader();
    const base = `http://${host}:8080/robot/meshes/erobo10/`;
    let loaded = 0;
    MESH_NAMES.forEach((name, i) => {
      loader.load(base + name + ".STL", (geo) => {
        geo.computeVertexNormals();
        const mat = i === 0 || i === 3 || i === 6 ? bodyMat : i % 2 ? bodyMat : jointMat;
        const mesh = new THREE.Mesh(geo, mat);
        const gmesh = new THREE.Mesh(geo, ghostMat);
        if (i === 0) { scene.add(mesh); }
        else { rig.links[i - 1].add(mesh); ghostRig.links[i - 1].add(gmesh); }
        loaded += 1;
        setMeshesLoaded(loaded);
      }, undefined, () => { /* mesh missing: frame lines still show */ });
    });

    // TCP triad + trace
    const triad = new THREE.AxesHelper(0.12);
    triad.matrixAutoUpdate = false;
    scene.add(triad);
    const traceGeo = new THREE.BufferGeometry();
    const MAXPTS = 900;
    const tracePos = new Float32Array(MAXPTS * 3);
    traceGeo.setAttribute("position", new THREE.BufferAttribute(tracePos, 3));
    traceGeo.setDrawRange(0, 0);
    const trace = new THREE.Line(traceGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 }));
    trace.frustumCulled = false;
    scene.add(trace);
    let traceN = 0;
    let lastTrace = 0;

    // safety planes group (rebuilt when config changes)
    const planesGroup = new THREE.Group();
    scene.add(planesGroup);
    let planesStamp = "";
    async function refreshPlanes() {
      try {
        const r = await robot.cmd({ cmd: "get_safety" });
        const cfg = r.config || {};
        const stamp = JSON.stringify(cfg.planes || []);
        if (stamp === planesStamp) return;
        planesStamp = stamp;
        planesGroup.clear();
        (cfg.planes || []).forEach((pl: any) => {
          if (!pl.mode) return;
          const color = pl.mode === 1 ? 0xef4444 : 0xf59e0b;
          const geo = new THREE.PlaneGeometry(2.4, 2.4);
          const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.10, side: THREE.DoubleSide, depthWrite: false });
          const mesh = new THREE.Mesh(geo, mat);
          const n = new THREE.Vector3(...(pl.n as [number, number, number])).normalize();
          mesh.position.set(pl.p[0], pl.p[1], pl.p[2]);
          mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
          planesGroup.add(mesh);
          const gridh = new THREE.GridHelper(2.4, 12, color, color);
          (gridh.material as THREE.Material as THREE.LineBasicMaterial).transparent = true;
          (gridh.material as THREE.LineBasicMaterial).opacity = 0.22;
          gridh.rotation.x = Math.PI / 2;
          mesh.add(gridh);
        });
      } catch { /* not connected yet */ }
    }
    const planeTimer = setInterval(refreshPlanes, 2500);
    refreshPlanes();

    const setPose = (r: Rig, q: number[]) => {
      const rot = new THREE.Matrix4();
      for (let i = 0; i < 6; i++) {
        const j = CHAIN[i];
        rot.makeRotationAxis(new THREE.Vector3(...j.axis).normalize(), q[i] || 0);
        r.joints[i].matrix.copy(originMatrix(j)).multiply(rot);
      }
    };

    let raf = 0;
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (w && h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const tcpM = new THREE.Matrix4();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const s = liveState.s;
      if (s) {
        setPose(rig, s.q);
        const g = ghostRef.current;
        ghostRoot.visible = !!g;
        if (g) setPose(ghostRig, g);
        const p = s.tcp.pos, qt = s.tcp.quat;
        tcpM.makeRotationFromQuaternion(new THREE.Quaternion(qt[1], qt[2], qt[3], qt[0]));
        tcpM.setPosition(p[0], p[1], p[2]);
        triad.matrix.copy(tcpM);
        const now = performance.now();
        if (traceRef.current && s.moving && now - lastTrace > 40) {
          lastTrace = now;
          const idx = traceN % MAXPTS;
          tracePos[idx * 3] = p[0]; tracePos[idx * 3 + 1] = p[1]; tracePos[idx * 3 + 2] = p[2];
          traceN += 1;
          traceGeo.setDrawRange(0, Math.min(traceN, MAXPTS));
          traceGeo.attributes.position.needsUpdate = true;
        }
        if (followRef.current) controls.target.lerp(new THREE.Vector3(p[0], p[1], p[2]), 0.06);
        planesGroup.visible = showPlanesRef.current;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(planeTimer);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [host]);

  return (
    <div ref={holder} className="viewport" style={{ width: "100%", height: "100%" }}>
      <div className="vp-tools">
        <button className="btn sm" onClick={() => setFollow((f) => !f)}>{follow ? "Free view" : "Follow TCP"}</button>
        <button className="btn sm" onClick={() => { traceRef.current = !traceRef.current; }}>Trace</button>
      </div>
      {meshesLoaded < 7 && (
        <div className="vp-hud"><span className="chip"><span className="dot" />Loading model… {meshesLoaded}/7</span></div>
      )}
    </div>
  );
}
