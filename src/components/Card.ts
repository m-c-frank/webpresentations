import * as THREE from 'three';
import { SceneObject } from './Scene';

class Card implements SceneObject {
    id: string;
    mesh: THREE.Mesh;
    selected: boolean = false;
    video: HTMLVideoElement;
    videoTexture?: THREE.VideoTexture;

    constructor(id: string) {
        this.id = id;
        
        // Create group to hold the top and bottom parts of the card
        const cardGroup = new THREE.Group();

        // Create bottom half of the card
        const bottomMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const bottomHalfGeometry = new THREE.PlaneGeometry(2.5, 1.75);
        const bottomHalfMesh = new THREE.Mesh(bottomHalfGeometry, bottomMaterial);
        bottomHalfMesh.position.y = -0.875;
        cardGroup.add(bottomHalfMesh);

        // Create video element
        this.video = document.createElement('video');
        this.video.src = 'video.mp4';
        this.video.load();
        this.video.loop = true;
        this.video.muted = true;

        // Create a promise to handle user interaction
        const playPromise = new Promise<void>((resolve) => {
            document.addEventListener('click', () => {
                this.video.play().then(() => {
                    console.log('Video is playing');
                    resolve();
                }).catch((error) => {
                    console.error('Error attempting to play video:', error);
                });
            }, { once: true });
        });

        // Once the video is played, create the video texture and top half of the card
        playPromise.then(() => {
            this.videoTexture = new THREE.VideoTexture(this.video);
            this.videoTexture.minFilter = THREE.LinearFilter;
            this.videoTexture.magFilter = THREE.LinearFilter;
            this.videoTexture.format = THREE.RGBFormat;

            const topMaterial = new THREE.MeshBasicMaterial({
                map: this.videoTexture,
                side: THREE.DoubleSide,
            });

            const topHalfGeometry = new THREE.PlaneGeometry(2.5, 1.75);
            const topHalfMesh = new THREE.Mesh(topHalfGeometry, topMaterial);
            topHalfMesh.position.y = 0.875;
            cardGroup.add(topHalfMesh);
        });

        // Create a geometry for the entire card (will be hidden)
        const geometry = new THREE.BoxGeometry(2.5, 3.5, 0.01);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, visible: false });
        this.mesh = new THREE.Mesh(geometry, material);

        // Add card group to the mesh
        this.mesh.add(cardGroup);
    }

    render() {
        this.mesh.rotation.y += Math.PI * 0.001;

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
        this.mesh.position.set(0, 0, 0);
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
