import React, { useEffect, useState } from 'react';
import { NoteData, fetchNotes } from '../data/fetchers';
import ThreeScene from './ThreeScene';


const NoteUIDemo = () => {
  const [notes, setNotes] = useState<NoteData[]>([{ id: 'node1', type: 'note', version: '0.0.0', h0: 'note', timestamp: 0, origin: '/notes', author: 'mcfrank', content: 'This is a note' }]);
  const [selectedNoteID, setSelectedNoteID] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes().then(
      (notes: NoteData[]) => {
        console.log('notes:', notes);
        // change type of all to "node"
        notes.forEach(note => note.type = "note");
        setNotes(notes);
      }
    );
  }, []);

  useEffect(() => {
    console.log('selectedNoteID:', selectedNoteID);
  }, [selectedNoteID]);

  return (
    <div className='flex w-full h-full flex-col'>
      <div className='flex-1'>
        <ThreeScene cubeData={notes} onClickCallback={setSelectedNoteID} />
      </div>
      <div className='flex justify-center p-4'>
        some stuff can be added here
      </div>
    </div>
  );
}

export default NoteUIDemo;