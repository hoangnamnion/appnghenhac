import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  analyserNode: AnalyserNode | null;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  analyserNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyserNode && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);
      } else {
        // Subtle idle simulation or flat
        for (let i = 0; i < 32; i++) {
          dataArray[i] = isPlaying ? Math.sin(Date.now() / 200 + i) * 30 + 40 : 10;
        }
      }

      const barCount = 24;
      const barWidth = (canvas.width / barCount) - 3;
      let x = 2;

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * 2] || (isPlaying ? Math.random() * 60 + 20 : 6);
        const barHeight = Math.max(4, (value / 255) * canvas.height * 0.9);

        // Doraemon Sky Blue to Golden Bell gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#0284c7');
        gradient.addColorStop(0.6, '#38bdf8');
        gradient.addColorStop(1, '#fbbf24');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        x += barWidth + 3;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, analyserNode]);

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-1">
      <div className="w-full max-w-xs h-10 bg-sky-900/10 backdrop-blur-sm rounded-xl p-1 flex items-center justify-center border border-white/60 shadow-inner">
        <canvas
          ref={canvasRef}
          width={280}
          height={36}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
