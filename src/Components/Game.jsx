import { useState, useEffect } from "react";
import Bullet from "./Bullet";
import Character from "./Character";


const Game = () => {  
  const [hp, setHp] = useState(100);
  const [bullets, setBullets] = useState([]);
  const [characterPosition, setCharacterPosition] = useState({
    x: window.innerWidth / 2 - 25,
    y: window.innerHeight / 2 - 50,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newBullet = {
        id: Date.now(),
        x: window.innerWidth,
        y: Math.random() * window.innerHeight,
        speedX: Math.random() * 3 + 2,
        speedY: Math.random() * 2 - 1,
      };

      setBullets((prevBullets) => [...prevBullets, newBullet]);
    }, 2000); // Add a bullet every 2 seconds

    return () => clearInterval(interval);
  }, []);
  

  const handleKeyPress = (event) => {
    if(hp > 0){
    if (event.key === "ArrowRight" ) {
      setCharacterPosition((prev) => {
        // Check if the position is less than 100 before updating
        if (prev.x < 1480) {
          return {
            ...prev,
            x: Math.min(prev.x + 20, window.innerWidth - 50),
          };
        }
        return prev; // Return unchanged state if condition is not met
      });
    } else if (event.key === "ArrowLeft") {
      setCharacterPosition((prev) => {
        if (prev.x > 970) {
          return {
            ...prev,
            x: Math.min(prev.x - 20, window.innerWidth - 50),
          };
        }
        return prev;
      });
    } 
    // else if (event.key === "ArrowUp") {
    //   let gravity = 2;
    //   let jumpSpeed = 20;
    //   let jumpInterval = setInterval(() => {
    //     jumpSpeed -= gravity;
    //     setCharacterPosition((prev) => ({
    //       ...prev,
    //       y: Math.max(prev.y - jumpSpeed, 0),
    //     }));
    //     if (jumpSpeed <= 0) {
    //       clearInterval(jumpInterval);
    //       y: Math.min(prev.y + jumpSpeed, window.innerHeight - 100)
    //     }
    //   }, 1000 / 60);
    // } 
    else if (event.key === "ArrowUp") {
  let gravity = 2;
  let jumpSpeed = 20;
  let isJumping = true;

  const jumpInterval = setInterval(() => {
    jumpSpeed -= gravity;

    setCharacterPosition((prev) => ({
      ...prev,
      y: Math.max(prev.y - jumpSpeed, 0),
    }));

    // When jump speed reaches 0 or below, start falling
    if (jumpSpeed <= 0 && isJumping) {
      isJumping = false;
      // Start falling down
      const fallInterval = setInterval(() => {
        jumpSpeed += gravity;
        setCharacterPosition((prev) => ({
          ...prev,
          y: Math.min(prev.y + jumpSpeed, 540), // Limit the character's fall to y = 540
        }));

        if (prev.y >= 540) {
          clearInterval(fallInterval); // Stop falling when the character reaches y = 540
        }
      }, 1000 / 60);
      clearInterval(jumpInterval); // Stop the jumping interval
    }
  }, 1000 / 60);
}

    else if (event.key === "ArrowDown") {
      setCharacterPosition((prev) => {
        if (prev.y < 540) {
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
      width: 50,
      height: 100,
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
        paddingTop: "320px",
        backgroundPosition: "center center", 
        backgroundRepeat: "no-repeat",
      }}
     ></div>
      
      <Character position={characterPosition} />
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet} />
      ))}
      
      <div style={{ position: "absolute", top: 200, left: 100, color: "white" , fontSize: "48px"}}>HP: {hp}</div>
    </div>
  ); 
};

export default Game;
