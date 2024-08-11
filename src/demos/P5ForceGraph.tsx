import { useEffect, useRef, useState } from "react";
import { Node, Link, fetchNoteForceGraph } from "../data/fetchers";
import p5 from "p5";

const SMOOTHING_STEPS = 1;

const ForceGraph: React.FC<{ nodes: Node[]; links: Link[] }> = ({ nodes, links }) => {
    const sketchRef = useRef<p5 | null>(null);
    const maxSimilarity = Math.max(...links.map((link) => link.similarity));
    const minSimilarity = Math.min(...links.map((link) => link.similarity));
    links.forEach(
        (link) => {
            link.similarity = (link.similarity - minSimilarity) / (maxSimilarity - minSimilarity);
        }
    );

    useEffect(() => {
        const sketch = (p: p5) => {
            let particles: Particle[] = [];

            p.setup = () => {
                p.createCanvas(window.innerWidth, window.innerHeight);
                particles = nodes.map((node) => new Particle(p, node));
            };

            p.draw = () => {
                p.background(255);

                for (let step = 0; step < SMOOTHING_STEPS; step++) {
                    for (let i = 0; i < particles.length; i++) {
                        const baseParticle = particles[i];
                        const baseParticleForces = [];

                        for (let j = i + 1; j < particles.length; j++) {
                            if (i === j) continue;
                            const otherParticle = particles[j];

                            const distance = p.dist(baseParticle.position.x, baseParticle.position.y, otherParticle.position.x, otherParticle.position.y);

                            if (distance < 100) {
                                // If the distance is less than 100 pixels, apply a strong repulsive force
                                const collisionForce = p5.Vector.sub(baseParticle.position, otherParticle.position)
                                    .normalize()
                                    .mult(100 - distance); // The closer they are, the stronger the repulsion
                                baseParticleForces.push(collisionForce);
                            }

                            // Existing attractive and repulsive forces
                            const link = links.find((link) => {
                                return (link.source === baseParticle.node.id && link.target === otherParticle.node.id) ||
                                    (link.source === otherParticle.node.id && link.target === baseParticle.node.id);
                            });

                            if (link) {
                                const force = p5.Vector.sub(otherParticle.position, baseParticle.position)
                                    .normalize()
                                    .mult(link.similarity);
                                baseParticleForces.push(force);
                            }

                            const repulsionForce = p5.Vector.sub(baseParticle.position, otherParticle.position)
                                .normalize()
                                .mult(1 / (distance * distance));

                            baseParticleForces.push(repulsionForce);
                        }

                        // Apply centering force
                        // const centeringForce = p5.Vector.sub(p.createVector(p.width / 2, p.height / 2), baseParticle.position)
                        //     .normalize()
                        //     .mult(0.1);

                        // baseParticleForces.push(centeringForce);

                        // Average all forces
                        const avgForce = baseParticleForces.reduce((acc, force) => acc.add(force), p.createVector(0, 0));
                        avgForce.div(baseParticleForces.length);

                        baseParticle.applyForce(avgForce.mult(0.1));
                    }

                    // Update particles' positions for this step
                    particles.forEach((particle) => particle.update());
                }

                // Display the particles at their averaged positions
                particles.forEach((particle) => {
                    particle.updateFinalPosition();
                    particle.display();
                });
            };


            class Particle {
                p: p5;
                position: p5.Vector;
                velocity: p5.Vector;
                acceleration: p5.Vector;
                node: Node;
                positionHistory: p5.Vector[];
                lastForce: p5.Vector;

                constructor(p: p5, node: Node) {
                    this.p = p;
                    this.position = p.createVector(
                        p.random(p.width),
                        p.random(p.height)
                    );
                    this.velocity = p.createVector(0, 0);
                    this.acceleration = p.createVector(0, 0);
                    this.node = node;
                    this.positionHistory = [];
                    this.lastForce = p.createVector(0, 0);
                }

                applyForce(force: p5.Vector) {
                    this.acceleration.add(force);
                    this.lastForce = force.copy();  // Store the last applied force
                }

                update() {
                    this.velocity.add(this.acceleration);
                    this.position.add(this.velocity);
                    this.acceleration.mult(0);
                    this.velocity.mult(0.95); // Damping

                    // Store position in history
                    this.positionHistory.push(this.position.copy());
                    if (this.positionHistory.length > SMOOTHING_STEPS) {
                        this.positionHistory.shift();
                    }
                }

                updateFinalPosition() {
                    if (this.positionHistory.length === 0) return;

                    // Calculate the average position over the last 10 steps
                    let avgPosition = this.positionHistory.reduce((acc, pos) => acc.add(pos), this.p.createVector(0, 0));
                    avgPosition.div(this.positionHistory.length);

                    // Set the current position to this average position
                    this.position = avgPosition;

                    // Limit position to canvas
                    this.position.x = this.p.constrain(this.position.x, 0, this.p.width);
                    this.position.y = this.p.constrain(this.position.y, 0, this.p.height);
                }

                display() {
                    this.p.fill(50);
                    this.p.noStroke();
                    this.p.ellipse(this.position.x, this.position.y, 16, 16);
                    this.p.fill(0);
                    this.p.textAlign(this.p.CENTER, this.p.CENTER);
                    this.p.text(this.node.id, this.position.x, this.position.y + 20);

                    // Draw force arrow
                    this.drawForceArrow();
                }

                drawForceArrow() {
                    // Get the stored force
                    const force = this.lastForce.copy().mult(1000); // Adjust the scaling factor as needed

                    // Determine end point of the arrow
                    const arrowEnd = p5.Vector.add(this.position, force);

                    // Draw the arrow
                    this.p.stroke(255, 0, 0); // Red color for the force arrow
                    this.p.strokeWeight(2);
                    this.p.line(this.position.x, this.position.y, arrowEnd.x, arrowEnd.y);

                    // Draw the arrowhead
                    const arrowSize = 5;
                    const angle = p5.Vector.sub(arrowEnd, this.position).heading();
                    this.p.push();
                    this.p.translate(arrowEnd.x, arrowEnd.y);
                    this.p.rotate(angle);
                    this.p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
                    this.p.pop();
                }
            };

        };

        sketchRef.current = new p5(sketch);

        return () => {
            sketchRef.current?.remove();
        };
    }, [nodes, links]);

    return <div />;
};

const P5ForceGraphDemo: React.FC = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchNoteForceGraph();
            console.log(data);
            setNodes(data.nodes);
            setLinks(data.links);
        };
        fetchData();
    }, []);

    return <ForceGraph nodes={nodes} links={links} />;
}

export default P5ForceGraphDemo;
