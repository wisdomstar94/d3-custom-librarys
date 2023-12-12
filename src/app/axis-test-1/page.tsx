"use client"

import { useEffect, useRef } from "react";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    
  }, []);

  return (
    <>
      <div className="w-full relative">
        <canvas 
          ref={canvasRef}
          className="w-full aspect-video relative"
          />
      </div>
    </>
  );
}