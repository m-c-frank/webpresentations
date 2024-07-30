import * as THREE from 'three';
import { SceneObject } from './Scene';

class Card implements SceneObject {
    id: string;
    mesh: THREE.Mesh;
    selected: boolean = false;

    constructor(id: string) {
        this.id = id;
        const geometry = new THREE.BoxGeometry(2.5, 3.5, 0.01); // Dimensions of a playing card
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
    }

    render() {
        this.mesh.rotation.y += 0.01; // Rotate along z-axis

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
        this.mesh.position.x = 0
        this.mesh.position.y = 0
        this.mesh.position.z = 0
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

export default Card;
