'use client';

interface GlassShardProps {
  width: number;
  height: number;
  rotation: number;
  left: number;
  top: number;
  delay: number;
}

export default function GlassShard({ width, height, rotation, left, top, delay }: GlassShardProps) {
  return (
    <div
      className="glass-shard"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg)`,
        left: `${left}px`,
        top: `${top}px`,
        opacity: 1,
        transition: `transform 1s ease-out ${delay}s, opacity 1.5s ease-out ${delay + 0.5}s, top 1s ease-out ${delay}s, left 1s ease-out ${delay}s`,
      }}
    />
  );
}
