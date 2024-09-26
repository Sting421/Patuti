/* eslint-disable react/prop-types */

import left1 from '../assets/res/left-1.png'
const Character = ({ position }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width:50,
        height: 100,
       // backgroundColor: "blue",
      }}
    >
      <img src={left1} alt="Description of image" width={50} height={100}/>
    </div>
  );
};

export default Character;