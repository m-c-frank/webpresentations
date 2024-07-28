import * as THREE from 'three';
import React, { useRef, useEffect, useState } from 'react';

// Cube class to handle cube creation and animation
class Cube {
    id: string;
    mesh: THREE.Mesh;

    constructor(id: string) {
        this.id = id;
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
    }

    render() {
        // if opacity is not 1 increase it by 0.01
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        // change color by hsv increment
        const color = new THREE.Color().setHSL((Math.sin(Date.now() * 0.001) + 1) / 2, 1, 0.5);
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
        // set opacity to 0
        //set random position
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
}

interface CubeData {
    id: string;
}

const ThreeScene = ({ cubeData }: { cubeData: CubeData[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    const rendererRef = useRef(new THREE.WebGLRenderer());
    const cubeInstancesRef = useRef<Cube[]>([]);

    useEffect(() => {
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        const renderer = rendererRef.current;

        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current?.appendChild(renderer.domElement);

        camera.position.z = 5;

        const renderScene = () => {
            cubeInstancesRef.current.forEach(cube => {
                cube.render();
            });
            renderer.render(scene, camera);
            requestAnimationFrame(renderScene);
        };

        renderScene();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;

        // Clean up cubes that are no longer needed
        cubeInstancesRef.current.forEach(cube => {
            if (!cubeData.some(data => data.id === cube.id)) {
                cube.removeFromScene(scene);
            }
        });

        // Create new cubes or update existing ones
        const newCubeInstances = cubeData.map(({ id }) => {
            let cube = cubeInstancesRef.current.find(c => c.id === id);
            if (!cube) {
                cube = new Cube(id);
                cube.addToScene(scene);
            }
            return cube;
        });

        cubeInstancesRef.current = newCubeInstances;
    }, [cubeData]);

    return <div ref={containerRef} />;
};

export default ThreeScene;
