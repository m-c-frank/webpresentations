import * as THREE from 'three';

import { SceneObject } from './scenes/Scene';
import { SceneData } from '../demos/ThreeScene';

class Cube implements SceneObject {
    id: string;
    data: SceneData;
    mesh: THREE.Mesh;
    selected: boolean = false;

    constructor(sceneData: SceneData) {
        this.id = sceneData.id;
        this.data = sceneData
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
    }

    render() {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;

        const color = new THREE.Color().setHSL((Math.sin(Date.now() * 0.001) + 1) / 2, 1, 0.5);
        if (this.selected) {
            color.setHex(0xffffff);
        }

        if (this.mesh.material instanceof THREE.MeshBasicMaterial) {
            this.mesh.material.color = color;
            if (this.mesh.material.opacity < 1) {
                this.mesh.material.opacity += 0.01;
            } else if (this.mesh.material.opacity !== 1) {
                this.mesh.material.opacity = 1;
                this.mesh.material.transparent = false;
            }
        }
    }

    addToScene(scene: THREE.Scene) {
        this.mesh.position.x = Math.random() * 5 - 2.5;
        this.mesh.position.y = Math.random() * 5 - 2.5;
        this.mesh.position.z = Math.random() * 5 - 2.5;
        if (this.mesh.material instanceof THREE.MeshBasicMaterial) {
            this.mesh.material.opacity = 0;
            this.mesh.material.transparent = true;
        }
        scene.add(this.mesh);
    }

    removeFromScene(scene: THREE.Scene) {
        scene.remove(this.mesh);
    }

    setSelected(selected: boolean) {
        this.selected = selected;
    }

    handleClick() {
        this.setSelected(!this.selected);
    }
}

export default Cube;
