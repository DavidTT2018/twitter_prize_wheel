import { useRef, useEffect } from 'react';

interface SpinningWheelProps {
  prizes: string[];
  isSpinning: boolean;
  selectedPrize: string | null;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ 
  prizes, 
  isSpinning, 
  selectedPrize 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number>(0);
  
  // Set up the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawWheel = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Save the current state
      ctx.save();
      
      // Move to center
      ctx.translate(centerX, centerY);
      
      // Rotate the entire wheel
      ctx.rotate(rotationRef.current);
      
      // Draw wheel sections
      const totalPrizes = prizes.length;
      const arcSize = (2 * Math.PI) / totalPrizes;
      
      prizes.forEach((prize, index) => {
        // Calculate arc start angle
        const startAngle = index * arcSize;
        const endAngle = startAngle + arcSize;
        
        // Alternating colors
        const isEven = index % 2 === 0;
        const color = isEven ? '#4338ca' : '#6d28d9';
        
        // Draw section
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw prize text
        ctx.save();
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(prize, radius - 20, 5);
        ctx.restore();
      });
      
      // Draw center circle
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, 2 * Math.PI);
      ctx.fillStyle = '#f97316';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Restore the state
      ctx.restore();
      
      // Draw pointer
      ctx.beginPath();
      ctx.moveTo(centerX + 70, centerY);
      ctx.lineTo(centerX + 90, centerY - 15);
      ctx.lineTo(centerX + 90, centerY + 15);
      ctx.closePath();
      ctx.fillStyle = '#f97316';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    
    drawWheel();
    
    // Animation loop when spinning
    if (isSpinning) {
      let speed = 0.3;
      let slowDown = false;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        
        // Start slowing down after 3 seconds
        if (elapsedTime > 3000 && !slowDown) {
          slowDown = true;
        }
        
        // Update rotation
        if (slowDown) {
          speed *= 0.995; // Gradual slowdown
        } else {
          speed *= 1.01; // Slight speedup initially
        }
        
        rotationRef.current += speed;
        drawWheel();
        
        // Continue animation if still spinning
        if (elapsedTime < 5000) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpinning, prizes, selectedPrize]);
  
  return (
    <div className="relative inline-block">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="w-full max-w-md mx-auto"
      />
    </div>
  );
};

export default SpinningWheel;