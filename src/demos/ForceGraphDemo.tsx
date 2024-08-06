import React, { useEffect, useState, useRef } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as d3 from 'd3';
import * as THREE from 'three';
import { Link, NoteData, fetchNoteForceGraph } from '../data/fetchers';

const ForceGraphDemo: React.FC = () => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNoteForceGraph();
      console.log(data);
      setNotes(data.nodes);
      setLinks(data.links);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (graphRef.current && notes.length && links.length) {
      const myGraph = ForceGraph3D()(graphRef.current);

      // Set up the simulation
      const simulationNodes = notes.map(
        note => {
          return {
            id: note.node_id,
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            z: 0  // Fixing z position for simplicity
          }
        }
      )

      const simulationLinks = links.map(link => ({
        source: link.source_id,
        target: link.target_id,
        similarity: 0
      }));

      console.log(simulationNodes)
      console.log(simulationLinks)

      const customForceLink = d3.forceLink(simulationLinks)
        .id((d: any) => d.id)
        .strength(link => (link.similarity + 1) / 2);

      const customForceSimulation = d3.forceSimulation(simulationNodes)
        .force('link', customForceLink)
        .force('charge', d3.forceManyBody().strength(-50))
        .force('center', d3.forceCenter(0, 0))
        .force('collision', d3.forceCollide().radius(10))
        .on('tick', () => {
          myGraph.graphData({ nodes: simulationNodes, links: simulationLinks });
        });

      myGraph
        .nodeAutoColorBy('id')
        .linkDirectionalParticles(2)
        .linkMaterial(() => new THREE.LineBasicMaterial({ color: 0x00ff00 }));

      // Set initial positions
      myGraph.graphData({ nodes: simulationNodes, links: simulationLinks });

      // Clean up the ForceGraph3D instance on component unmount
      return () => {
        customForceSimulation.stop();
        myGraph._destructor();
      };
    }
  }, [notes, links]);

  return (
    <div>
      <div ref={graphRef} style={{ width: '100%', height: '600px' }}></div>
    </div>
  );
};

export default ForceGraphDemo;
