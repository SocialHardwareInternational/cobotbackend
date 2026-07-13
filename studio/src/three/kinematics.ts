// kinematics.ts -- erobo10 URDF chain for the 3D digital twin (matches the C++
// model in core/include/erm/erobo10_dh.hpp / the corrected URDF exactly).
import * as THREE from "three";

export interface UrdfJoint { xyz: [number, number, number]; rpy: [number, number, number]; axis: [number, number, number] }

export const CHAIN: UrdfJoint[] = [
  { xyz: [5.025e-05, -0.00040296, 0.04808044], rpy: [-3.14159265, 0, 0], axis: [0, 0, 1] },
  { xyz: [0, 0.09, -0.075],     rpy: [1.57079633, 0, 0],  axis: [0, 0, 1] },
  { xyz: [0, -0.612, -0.017],   rpy: [-3.14159265, 0, 0], axis: [0, 0, 1] },
  { xyz: [0, 0.59, -0.0343],    rpy: [3.14159265, 0, 0],  axis: [0, 0, 1] },
  { xyz: [0, -0.0425, -0.0555], rpy: [1.57079633, 0, 0],  axis: [0, 0, -1] },
  { xyz: [0, -0.0425, 0.0555],  rpy: [-1.57079633, 0, 0], axis: [0, 0, 1] },
];
export const MESH_NAMES = ["base_link", "link1", "link2", "link3", "link4", "link5", "link6"];
export const JOINT_LIMITS: [number, number][] = [
  [-3.141593, 3.141593], [-3.054326, 3.054326], [-3.054326, 3.054326],
  [-3.054326, 3.054326], [-3.141593, 3.141593], [-3.141593, 3.141593],
];

export function originMatrix(j: UrdfJoint): THREE.Matrix4 {
  const m = new THREE.Matrix4();
  m.makeRotationFromEuler(new THREE.Euler(j.rpy[0], j.rpy[1], j.rpy[2], "ZYX"));
  m.setPosition(j.xyz[0], j.xyz[1], j.xyz[2]);
  return m;
}

/** Forward kinematics: world matrices of every link frame (base=identity .. flange). */
export function linkFrames(q: number[]): THREE.Matrix4[] {
  const out: THREE.Matrix4[] = [new THREE.Matrix4()];
  let T = new THREE.Matrix4();
  const rot = new THREE.Matrix4();
  for (let i = 0; i < 6; i++) {
    const j = CHAIN[i];
    T = T.clone().multiply(originMatrix(j));
    rot.makeRotationAxis(new THREE.Vector3(...j.axis).normalize(), q[i] || 0);
    T.multiply(rot);
    out.push(T.clone());
  }
  return out;
}

export function flangePose(q: number[]): THREE.Matrix4 {
  return linkFrames(q)[6];
}
