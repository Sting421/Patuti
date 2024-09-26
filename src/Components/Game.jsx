import { useState, useEffect } from "react";
import Bullet from "./Bullet";
import Character from "./Character";
import left1 from '../assets/res/left-1.png'; // Import images
import left2 from '../assets/res/left-2.png';
import left3 from '../assets/res/left-3.png';
import left4 from '../assets/res/left-4.png';
import left5 from '../assets/res/left-5.png';
import right1 from '../assets/res/right-1.png';
import right2 from '../assets/res/right-2.png';
import right3 from '../assets/res/right-3.png';
import right4 from '../assets/res/right-4.png';
import right5 from '../assets/res/right-5.png';

import jump1 from '../assets/res/jump-1.png';
import jump2 from '../assets/res/jump-2.png';
import jump3 from '../assets/res/jump-3.png';
import jump4 from '../assets/res/jump-4.png';
import jump5 from '../assets/res/jump-5.png';

import dock1 from '../assets/res/dock-1.png';
import dock2 from '../assets/res/dock-2.png';
import dock3 from '../assets/res/dock-3.png';
import dock4 from '../assets/res/dock-4.png';
import dock5 from '../assets/res/dock-5.png';



const Game = () => {
  const moves = {
    left: [left1, left2, left3, left4, left5],  // Left
    right: [right1, right2, right3, right4, right5], // Right
    jump: [jump1, jump2, jump3, jump4, jump5],
  };
  

  const [leftIndex, setLeftIndex] = useState(1); 
  const [rightIndex, setRightIndex] = useState(1);
  const [jumpIndex, setJumpIndex] = useState(1); 
  
  const [hp, setHp] = useState(100);
  const [bullets, setBullets] = useState([]);
  const [characterPosition, setCharacterPosition] = useState({
    x: window.innerWidth / 2 - 25,
    y: window.innerHeight  - 640,
  });
  const [currentImage, setCurrentImage] = useState(left1); // Add state for current image

  useEffect(() => {
    const interval = setInterval(() => {
      const newBullet = {
        id: Date.now(),
        x: window.innerWidth,
        y: Math.random() * window.innerHeight,
        speedX: Math.random() * 4 + 2,
        speedY: Math.random() * 3 - 1,
      };

      setBullets((prevBullets) => [...prevBullets, newBullet]);
    }, 2000); // Add a bullet every 2 seconds

    return () => clearInterval(interval);
  }, []);
  

  const handleKeyPress = (event) => {
    if(hp > 0){
    if (event.key === "ArrowRight") {
      setRightIndex((prev) => prev + 1);
      setCurrentImage(moves.right[rightIndex % moves.right.length]); 
      setCharacterPosition((prev) => {
        if (prev.x < 1380) {
          return {
            ...prev,
            x: Math.min(prev.x + 20, window.innerWidth - 50),
          };
        }
        return prev;
      });
    } else if (event.key === "ArrowLeft") {
      setLeftIndex((prev) => prev + 1); // Update leftIndex using setState
      setCurrentImage(moves.left[leftIndex % moves.left.length]); 
      setCharacterPosition((prev) => {
        if (prev.x > 870) {
          return {
            ...prev,
            x: Math.min(prev.x - 20, window.innerWidth - 50),
          };
        }
        return prev;
      });
    } else if (event.key === "ArrowUp") {
      
      
      // Change image on up arrow
      let gravity = 2;
      let jumpSpeed = 30;
      let jumpInterval = setInterval(() => {
        jumpSpeed -= gravity;
        setJumpIndex((prev) => prev + 1);
        setCurrentImage(moves.jump[jumpIndex % moves.jump.length]);
        setCharacterPosition((prev) => ({
          
          ...prev,
          y: Math.max(prev.y - jumpSpeed, 0),
        }));
        if (jumpSpeed <= 0) {
          clearInterval(jumpInterval);
          
        }
      }, 1000 / 60);
    } 
    else if (event.key === "ArrowDown") {
      setCurrentImage(dock3); // Change image on down arrow
      setCharacterPosition((prev) => {
        if (prev.y < 600) {
          return {
            ...prev,
            y: Math.min(prev.y + 50, window.innerHeight  - 100),
          };
        }
        return prev;
      });
    }
  }
  };

  const checkCollision = (bullet) => {
    const character = {
      x: characterPosition.x,
      y: characterPosition.y,
      width: 250,
      height: 230,
    };
    return (
      bullet.x < character.x + character.width &&
      bullet.x + 20 > character.x &&
      bullet.y < character.y + character.height &&
      bullet.y + 20 > character.y
    );
  };

  useEffect(() => {
    const moveBullets = () => {
      setBullets((prevBullets) =>
        prevBullets
          .map((bullet) => ({
            ...bullet,
            x: bullet.x - bullet.speedX,
            y: bullet.y + bullet.speedY,
          }))
          .filter((bullet) => bullet.x > -20)
      );
    
    };

    const collisionDetection = () => {
      setBullets((prevBullets) =>
        prevBullets.filter((bullet) => {
          const hit = checkCollision(bullet);
          if (hit) {
            setHp((prevHp) => prevHp - 20); // Decrease HP by 20 if hit
          }
          return !hit; // Remove the bullet if it hits
        })
      );
    };

    const gameLoop = setInterval(() => {
      if(hp > 1){
      moveBullets();
      collisionDetection();
    }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [characterPosition]); // Changed dependency to characterPosition

  return (
    <div
      tabIndex="0"
      onKeyDown={handleKeyPress}
      style={{ 
        position: "relative", 
        width: "100vw", 
        height: "100vh", 
        backgroundImage: "url('src/assets/res/background.png')", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      
      
      
      {hp <= 0 && ( // Game Over condition
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "red", fontSize: "48px" }}>
          Game Over
        </div>
      )}
      <div
      tabIndex="0"
      onKeyDown={handleKeyPress}
      style={{ 
        position: "relative", 
        width: "100vw", 
        height: "100vh", 
        backgroundImage: "url('src/assets/res/area.png')", 
        paddingTop: "720px",
        backgroundPosition: "center center", 
        backgroundRepeat: "no-repeat",
      }}
     ></div>
      
      <Character position={characterPosition} currentImage={currentImage} /> // Pass currentImage to Character
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet} />
      ))}
      
      <div style={{ position: "absolute", top: 200, left: 100, color: "white" , fontSize: "48px"}}>HP: {hp}</div>
    </div>
  ); 
};

export default Game;
