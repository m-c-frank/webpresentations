import React, { useState } from 'react';
import ThreeScene from './ThreeScene';

const CubeDemo = () => {
  const [cubes, setCubes] = useState([{ id: 'cube1' }, { id: 'cube2' }, { id: 'cube3' }]);

  const addCube = () => {
    const newCube = { id: `cube${cubes.length + 1}` };
    setCubes([...cubes, newCube]);
  };

  const removeCube = () => {
    setCubes(cubes.slice(0, -1));
  };

  return (
    <div>
      <ThreeScene cubeData={cubes} />
      <div>
        <button onClick={addCube}>
          Add Cube
        </button>
        <button onClick={removeCube}>
          Remove Cube
        </button>
      </div>
    </div>
  );
}

export default CubeDemo;