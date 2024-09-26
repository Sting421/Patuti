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
    if (event.key === "ArrowRight") {
      setCharacterPosition((prev) => ({
        ...prev,
        x: Math.min(prev.x + 20, window.innerWidth - 50),
      }));
    } else if (event.key === "ArrowLeft") {
      setCharacterPosition((prev) => ({
        ...prev,
        x: Math.max(prev.x - 20, 0),
      }));
    } else if (event.key === "ArrowUp") {
      setCharacterPosition((prev) => ({
        ...prev,
        y: Math.max(prev.y - 50, 0),
      }));
    } else if (event.key === "ArrowDown") {
      setCharacterPosition((prev) => ({
        ...prev,
        y: Math.min(prev.y + 50, window.innerHeight - 100),
      }));
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
      moveBullets();
      collisionDetection();
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
        backgroundImage: "url('assets/res/bg.png')", // {{ edit_1 }}
        backgroundSize: "cover", // {{ edit_2 }}
        backgroundPosition: "center", // {{ edit_3 }}
        backgroundRepeat: "no-repeat",
      }}
    >
      <Character position={characterPosition} />
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet} />
      ))}
      <div style={{ position: "absolute", top: 700, left: 1300, color: "white" }}>HP: {hp}</div>
    </div>
  ); 
};

export default Game;
