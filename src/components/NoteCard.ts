import * as THREE from 'three';
import { SceneObject } from './scenes/Scene';
import { SceneData } from '../demos/ThreeScene';
import { NoteData } from '../data/fetchers';

const cardWidth = 2.5;
const cardHeight = 3.5;
const cardThickness = 0.01;
const aspectRatio = cardWidth / cardHeight;

class NoteCard implements SceneObject {
    id: string;
    data: NoteData;
    mesh: THREE.Mesh;
    selected: boolean = false;
    textTexture: THREE.Texture;
    textCanvas: HTMLCanvasElement;

    constructor(sceneData: SceneData) {
        this.id = sceneData.id;
        this.data = sceneData as NoteData;

        const geometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness);

        // here i can insert a markdown to image data call to get the image data and then create a texture from it
        this.textCanvas = document.createElement('canvas');
        this.textCanvas.width = 512
        this.textCanvas.height = Math.round(this.textCanvas.width / aspectRatio);
        const context = this.textCanvas.getContext('2d');
        if (context) {
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, this.textCanvas.width, this.textCanvas.height);
            context.fillStyle = '#000000';
            context.font = '100% Arial';
            context.textAlign = 'center';
            context.fillText(this.data.content, this.textCanvas.width / 2, this.textCanvas.height / 2);
        }
        this.textTexture = new THREE.CanvasTexture(this.textCanvas);

        const textMaterial = new THREE.MeshBasicMaterial({ map: this.textTexture, side: THREE.FrontSide });

        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // side 1
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // side 2
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // side 3
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // side 4
            textMaterial, // side 5
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        ];
        this.mesh = new THREE.Mesh(geometry, materials);
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

export default NoteCard;