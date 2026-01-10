import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { VoxelBlock } from './pieceDefinitions';

/**
 * Merges multiple voxel blocks into a single BufferGeometry with vertex colors.
 * This reduces draw calls significantly.
 */
export function createMergedVoxelGeometry(voxels: VoxelBlock[]): THREE.BufferGeometry {
    const geometries: THREE.BufferGeometry[] = [];

    voxels.forEach((block) => {
        // Create box geometry for each voxel
        const geometry = new THREE.BoxGeometry(block.size[0], block.size[1], block.size[2]);

        // Position it
        geometry.translate(block.position[0], block.position[1], block.position[2]);

        // Apply colors to vertices
        const color = new THREE.Color(block.color);
        const count = geometry.attributes.position.count;
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometries.push(geometry);
    });

    if (geometries.length === 0) return new THREE.BufferGeometry();

    // Merge all geometries into one
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);

    // Clean up individual geometries
    geometries.forEach(g => g.dispose());

    return mergedGeometry;
}
