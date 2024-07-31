import * as THREE from 'three';
import { SceneObject } from './scenes/Scene';
import { SceneData } from '../demos/ThreeScene';

class Card implements SceneObject {
    id: string;
    data: SceneData;
    mesh: THREE.Mesh;
    selected: boolean = false;
    video: HTMLVideoElement;
    videoTexture?: THREE.VideoTexture;
    textTexture: THREE.Texture;
    textCanvas: HTMLCanvasElement;

    constructor(sceneData: SceneData) {
        this.id = sceneData.id;
        this.data = sceneData

        // Create a 3D box for the card
        const cardGroup = new THREE.Group();

        // Load card face and back textures
        const cardFaceTexture = new THREE.TextureLoader().load('card_face.png');
        const cardBackTexture = new THREE.TextureLoader().load('card_back.png');

        // Create box geometry and materials for card
        const geometry = new THREE.BoxGeometry(2.5, 3.5, 0.1);
        const materials = [
            new THREE.MeshBasicMaterial({ map: cardFaceTexture }), // front
            new THREE.MeshBasicMaterial({ map: cardBackTexture }), // back
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // side 1
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // side 2
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // side 3
            new THREE.MeshBasicMaterial({ color: 0xffffff })  // side 4
        ];
        this.mesh = new THREE.Mesh(geometry, materials);

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

            const videoMaterial = new THREE.MeshBasicMaterial({
                map: this.videoTexture,
                side: THREE.DoubleSide,
            });

            // Create and position the video mesh with padding
            const videoGeometry = new THREE.PlaneGeometry(2, 1); // Adjust size for padding
            const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
            videoMesh.position.y = 0.875;
            videoMesh.position.z = 0.051;
            cardGroup.add(videoMesh);
        });

        // Create a canvas for text and convert it to a texture
        this.textCanvas = document.createElement('canvas');
        this.textCanvas.width = 256;
        this.textCanvas.height = 256;
        const context = this.textCanvas.getContext('2d');
        if (context) {
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, 256, 256);
            context.fillStyle = '#000000';
            context.font = '24px Arial';
            context.textAlign = 'center';
            context.fillText('Card Text', 128, 200); // Adjusted to place below video
        }
        this.textTexture = new THREE.CanvasTexture(this.textCanvas);

        const textMaterial = new THREE.MeshBasicMaterial({ map: this.textTexture, side: THREE.DoubleSide });
        const textGeometry = new THREE.PlaneGeometry(2.5, 1.75);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.y = -1.25; // Positioned below the video
        cardGroup.add(textMesh);

        // Create and add a title above the video
        const titleCanvas = document.createElement('canvas');
        titleCanvas.width = 256;
        titleCanvas.height = Math.round(258/8);
        const titleContext = titleCanvas.getContext('2d');
        if (titleContext) {
            titleContext.fillStyle = '#00FFFF';
            titleContext.fillRect(0, 0, titleCanvas.width, titleCanvas.height);
            titleContext.fillStyle = '#000000';
            titleContext.font = '24px Arial';
            titleContext.textAlign = 'center';
            titleContext.fillText('Card Title', 128, 24); // Adjusted to place above video
        }
        const titleTexture = new THREE.CanvasTexture(titleCanvas);

        const titleMaterial = new THREE.MeshBasicMaterial({ map: titleTexture, side: THREE.DoubleSide });
        const titleGeometry = new THREE.PlaneGeometry(2, 0.25);
        const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
        titleMesh.position.y = 1; // Positioned above the video
        titleMesh.position.z = 0.051; // Positioned above the video
        cardGroup.add(titleMesh);

        // Add card group to the mesh
        this.mesh.add(cardGroup);
    }

    render() {
        this.mesh.rotation.y += Math.PI * 0.001;
    }

    addToScene(scene: THREE.Scene) {
        this.mesh.position.set(0, 0, 0);
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
