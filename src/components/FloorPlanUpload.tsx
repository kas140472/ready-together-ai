
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface FloorPlanUploadProps {
  onFloorPlanChange: (floorPlan: string) => void;
  currentFloorPlan?: string;
}

export const FloorPlanUpload = ({ onFloorPlanChange, currentFloorPlan }: FloorPlanUploadProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onFloorPlanChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setLastPosition({ x, y });
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.strokeStyle = '#d9644f';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPosition({ x, y });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        onFloorPlanChange(canvas.toDataURL());
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onFloorPlanChange('');
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Floor Plan & Evacuation Routes
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload a photo or sketch your home layout to help plan evacuation routes
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="floor-plan-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors">
              <div className="space-y-2">
                <svg className="w-8 h-8 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-muted-foreground">
                  Click to upload floor plan photo
                </p>
              </div>
            </div>
            <input
              id="floor-plan-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </Label>
        </div>

        <div className="text-center text-muted-foreground">
          <span>or</span>
        </div>

        <div>
          <Label className="block mb-2">Draw your floor plan:</Label>
          <div className="border rounded-lg bg-white">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
          <div className="flex justify-between mt-2">
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              Clear Drawing
            </Button>
            <p className="text-xs text-muted-foreground self-center">
              Click and drag to draw walls and exits
            </p>
          </div>
        </div>

        {currentFloorPlan && (
          <div>
            <Label>Current floor plan:</Label>
            <img 
              src={currentFloorPlan} 
              alt="Floor plan" 
              className="w-full max-w-sm rounded border mt-2"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
