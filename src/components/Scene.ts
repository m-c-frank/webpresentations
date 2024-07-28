import * as THREE from 'three';

interface SceneObject {
    id: string;
    mesh: THREE.Mesh;
    addToScene(scene: THREE.Scene): void;
    removeFromScene(scene: THREE.Scene): void;
    render(): void;
    handleClick(): void;
}


class Scene {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    objects: SceneObject[];
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;

    constructor(container: HTMLDivElement) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
        this.objects = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.addEventListener('resize', this.handleResize.bind(this, container));
        container.addEventListener('click', this.onClick.bind(this));
    }

    handleResize(container: HTMLDivElement) {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    addObject(object: SceneObject) {
        this.objects.push(object);
        object.addToScene(this.scene);
    }

    removeObject(object: SceneObject) {
        this.objects = this.objects.filter(obj => obj.id !== object.id);
        object.removeFromScene(this.scene);
    }

    render() {
        this.objects.forEach(object => object.render());
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    onClick(event: MouseEvent) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            const clickedObject = this.objects.find(object => object.mesh === intersectedObject);

            if (clickedObject) {
                console.log(`Object with ID ${clickedObject.id} clicked`);
                clickedObject.handleClick();
                // Handle object click event here
            }
        }
    }
}

export type { SceneObject };
export default Scene;
