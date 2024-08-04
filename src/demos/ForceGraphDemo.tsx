import React, { useEffect, useState, useRef } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as d3 from 'd3';
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

      // Customize the force simulation
      const customForceLink = d3.forceLink(links)
        .id((d: any) => d.id)
        .strength((link: any) => (link.similarity + 1) / 2);


        const simulationNodes = notes.map((note) => {
            return {
                id: note.id,
                x: 0,
                y: 0,
                z: 0,
            }
        }
        );
      const customForceSimulation = d3.forceSimulation(simulationNodes)
        .force('link', customForceLink)
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));

      myGraph
        .d3Force('link', customForceLink)
        .d3Force('charge', d3.forceManyBody())
        .d3Force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));

      myGraph.graphData({ nodes: notes, links: links });

      // Clean up the ForceGraph3D instance on component unmount
      return () => {
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
