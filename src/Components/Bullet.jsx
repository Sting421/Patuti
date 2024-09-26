/* eslint-disable react/prop-types */

import bullets from "../assets/res/bullet_h.png"

const Bullet = ({ position }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: 20,
        height: 20,
        // backgroundColor: "red",
        borderRadius: "50%",
      }}
    >
   
      <img src={bullets} alt="Description of image" width={40} height={20}/>
    </div>
     
  
  );
};

export default Bullet;