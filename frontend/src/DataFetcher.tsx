import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

interface DataFetcherProps {
  onDataFetched: (
    joystickX: number,
    joystickY: number,
    light: number,
    slider: number
  ) => void;
}

const DataFetcher: React.FC<DataFetcherProps> = ({ onDataFetched }) => {
  const [buttonColors, setButtonColors] = useState<string[]>(["", "", "", ""]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const bounceData = useRef<{ radius: number; growing: boolean }>({ radius: 30, growing: true });

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/serial-data");
      const data = response.data.data.split(",");
      const joystickX = parseInt(data[0], 10);
      const joystickY = parseInt(data[1], 10);
      const light = Math.min(Math.max(parseInt(data[2], 10), 0), 1024);
      const slider = parseInt(data[4], 10);
      onDataFetched(joystickX, joystickY, light, slider);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonClick = (index: number) => {
    const colors = ["blue", "green", "red", "yellow"];
    const newColors = buttonColors.map((color, i) => (i === index ? colors[index] : ""));
    setButtonColors(newColors);
    startBounceAnimation(colors[index], index); // Start the bounce animation
  };

  const startBounceAnimation = (color: string, index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set the initial radius based on the button index
    const baseRadius = 30 + index * 10;
    bounceData.current = { radius: baseRadius, growing: true };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      // Update the radius for bouncing effect
      if (bounceData.current) {
        const { radius, growing } = bounceData.current;
        ctx.fillStyle = color;

        // Draw the circle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.fill();

        // Adjust the radius for the bounce effect
        if (growing) {
          bounceData.current.radius += 2; // Grow
          if (radius >= baseRadius + 20) bounceData.current.growing = false; // Start shrinking
        } else {
          bounceData.current.radius -= 2; // Shrink
          if (radius <= baseRadius) {
            bounceData.current.growing = true; // Reset growth
            cancelAnimationFrame(animationRef.current!);
            return; // Stop the animation
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate); // Continue animation
    };

    animate(); // Start the animation
  };

  return (
    <div>
      <div className="switches">
        {["Do", "Re", "Mi", "Fa"].map((note, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(index)}
            style={{
              backgroundColor: buttonColors[index] || "beige",
              color: "black",
              fontFamily: "Times New Roman",
              fontSize: "20px",
              border: "2px solid black",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: "pointer",
              margin: "5px" // Margin between buttons
            }}
          >
            Nota {note} ♫
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} width={400} height={300} style={{ border: "2px solid black", marginTop: "20px" }} />
    </div>
  );
};

export default DataFetcher;
