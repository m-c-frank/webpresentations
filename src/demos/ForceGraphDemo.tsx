import React, { useEffect, useState, useRef } from 'react';
import ForceGraph3D from '3d-force-graph';
import { Link, NoteData, fetchNoteForceGraph } from '../data/fetchers';

const ForceGraphDemo = () => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const graphRef = useRef(null);

  useEffect(() => {
    fetchNoteForceGraph().then((data) => {
      console.log(data);
      setNotes(data.nodes);
      setLinks(data.links);
    });
  }, []);

  useEffect(() => {
    if (graphRef.current && notes.length && links.length) {
      const myGraph = ForceGraph3D()(graphRef.current);
      myGraph.graphData({ nodes: notes, links: links });
    }
  }, [notes, links]);

  return (
    <div>
      <div ref={graphRef} style={{ width: '100%', height: '600px' }}></div>
    </div>
  );
}

export default ForceGraphDemo;