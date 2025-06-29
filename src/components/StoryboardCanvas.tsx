import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StoryboardFrame, CanvasObject, CharacterPosition, PropItem } from '../types/storyboard';
import { Move, RotateCw, Trash2, Type, Square, Circle, ArrowRight } from 'lucide-react';

interface StoryboardCanvasProps {
  frame: StoryboardFrame;
  onFrameUpdate: (frame: StoryboardFrame) => void;
  isEditing: boolean;
}

export const StoryboardCanvas: React.FC<StoryboardCanvasProps> = ({
  frame,
  onFrameUpdate,
  isEditing
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | 'text' | 'shape' | 'arrow'>('select');

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = frame.canvas.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if editing
    if (isEditing) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw characters
    frame.characters.forEach(character => {
      drawCharacter(ctx, character);
    });

    // Draw props
    frame.props.forEach(prop => {
      drawProp(ctx, prop);
    });

    // Draw canvas objects
    frame.canvas.objects
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach(obj => {
        drawCanvasObject(ctx, obj, obj.id === selectedObject);
      });

    // Draw shot type indicator
    drawShotTypeIndicator(ctx, frame.shotType, canvas.width, canvas.height);

    // Draw camera movement indicator
    if (frame.cameraMovement !== 'static') {
      drawCameraMovementIndicator(ctx, frame.cameraMovement, canvas.width, canvas.height);
    }
  }, [frame, selectedObject, isEditing]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    const gridSize = 20;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  };

  const drawCharacter = (ctx: CanvasRenderingContext2D, character: CharacterPosition) => {
    ctx.save();
    
    // Draw character as a simple figure
    ctx.fillStyle = '#4a90e2';
    ctx.strokeStyle = '#2c5aa0';
    ctx.lineWidth = 2;

    // Body
    ctx.fillRect(character.x - 15, character.y - 40, 30, 60);
    ctx.strokeRect(character.x - 15, character.y - 40, 30, 60);

    // Head
    ctx.beginPath();
    ctx.arc(character.x, character.y - 50, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(character.name, character.x, character.y + 30);
    ctx.fillText(character.action, character.x, character.y + 45);

    ctx.restore();
  };

  const drawProp = (ctx: CanvasRenderingContext2D, prop: PropItem) => {
    ctx.save();
    
    const color = prop.importance === 'primary' ? '#e74c3c' : 
                  prop.importance === 'secondary' ? '#f39c12' : '#95a5a6';
    
    ctx.fillStyle = color;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Draw prop as a rectangle
    ctx.fillRect(prop.x - 20, prop.y - 15, 40, 30);
    ctx.strokeRect(prop.x - 20, prop.y - 15, 40, 30);

    // Label
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(prop.name, prop.x, prop.y + 45);

    ctx.restore();
  };

  const drawCanvasObject = (ctx: CanvasRenderingContext2D, obj: CanvasObject, isSelected: boolean) => {
    ctx.save();
    
    ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
    ctx.rotate((obj.rotation * Math.PI) / 180);
    ctx.translate(-obj.width / 2, -obj.height / 2);

    ctx.fillStyle = obj.color;
    ctx.strokeStyle = isSelected ? '#007bff' : '#333';
    ctx.lineWidth = isSelected ? 3 : 1;

    switch (obj.type) {
      case 'text':
        ctx.font = '16px Arial';
        ctx.fillText(obj.text || '', 0, 20);
        break;
      case 'shape':
        if (obj.shape === 'rectangle') {
          ctx.fillRect(0, 0, obj.width, obj.height);
          ctx.strokeRect(0, 0, obj.width, obj.height);
        } else if (obj.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(obj.width / 2, obj.height / 2, Math.min(obj.width, obj.height) / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        break;
      case 'arrow':
        drawArrow(ctx, 0, obj.height / 2, obj.width, obj.height / 2);
        break;
    }

    ctx.restore();
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    const headLength = 10;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  const drawShotTypeIndicator = (ctx: CanvasRenderingContext2D, shotType: string, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);

    const padding = 20;
    let frameWidth = width - padding * 2;
    let frameHeight = height - padding * 2;

    // Adjust frame size based on shot type
    switch (shotType) {
      case 'extreme-wide':
        // Full frame
        break;
      case 'wide':
        frameWidth *= 0.9;
        frameHeight *= 0.9;
        break;
      case 'medium':
        frameWidth *= 0.7;
        frameHeight *= 0.7;
        break;
      case 'close-up':
        frameWidth *= 0.5;
        frameHeight *= 0.5;
        break;
      case 'extreme-close-up':
        frameWidth *= 0.3;
        frameHeight *= 0.3;
        break;
    }

    const x = (width - frameWidth) / 2;
    const y = (height - frameHeight) / 2;

    ctx.strokeRect(x, y, frameWidth, frameHeight);
    ctx.setLineDash([]);
    ctx.restore();
  };

  const drawCameraMovementIndicator = (ctx: CanvasRenderingContext2D, movement: string, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);

    const centerX = width / 2;
    const centerY = height / 2;

    switch (movement) {
      case 'pan-left':
        drawArrow(ctx, centerX + 50, centerY, centerX - 50, centerY);
        break;
      case 'pan-right':
        drawArrow(ctx, centerX - 50, centerY, centerX + 50, centerY);
        break;
      case 'tilt-up':
        drawArrow(ctx, centerX, centerY + 50, centerX, centerY - 50);
        break;
      case 'tilt-down':
        drawArrow(ctx, centerX, centerY - 50, centerX, centerY + 50);
        break;
      case 'zoom-in':
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }

    ctx.restore();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (tool === 'select') {
      // Find clicked object
      const clickedObject = frame.canvas.objects.find(obj => 
        x >= obj.x && x <= obj.x + obj.width &&
        y >= obj.y && y <= obj.y + obj.height
      );

      setSelectedObject(clickedObject?.id || null);
    } else {
      // Add new object
      addCanvasObject(x, y);
    }
  };

  const addCanvasObject = (x: number, y: number) => {
    const newObject: CanvasObject = {
      id: Math.random().toString(36).substr(2, 9),
      type: tool as any,
      x: x - 50,
      y: y - 25,
      width: 100,
      height: 50,
      rotation: 0,
      color: '#007bff',
      zIndex: frame.canvas.objects.length,
      ...(tool === 'text' && { text: 'Text' }),
      ...(tool === 'shape' && { shape: 'rectangle' })
    };

    const updatedFrame = {
      ...frame,
      canvas: {
        ...frame.canvas,
        objects: [...frame.canvas.objects, newObject]
      }
    };

    onFrameUpdate(updatedFrame);
    setSelectedObject(newObject.id);
    setTool('select');
  };

  const deleteSelectedObject = () => {
    if (!selectedObject) return;

    const updatedFrame = {
      ...frame,
      canvas: {
        ...frame.canvas,
        objects: frame.canvas.objects.filter(obj => obj.id !== selectedObject)
      }
    };

    onFrameUpdate(updatedFrame);
    setSelectedObject(null);
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedObject) {
        deleteSelectedObject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObject]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={frame.canvas.dimensions.width}
        height={frame.canvas.dimensions.height}
        className="border border-gray-300 rounded-lg cursor-crosshair"
        onClick={handleCanvasClick}
      />
      
      {isEditing && (
        <div className="absolute top-2 left-2 flex space-x-2">
          <button
            onClick={() => setTool('select')}
            className={`p-2 rounded ${tool === 'select' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border`}
            title="Select"
          >
            <Move className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('text')}
            className={`p-2 rounded ${tool === 'text' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border`}
            title="Add Text"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('shape')}
            className={`p-2 rounded ${tool === 'shape' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border`}
            title="Add Shape"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('arrow')}
            className={`p-2 rounded ${tool === 'arrow' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border`}
            title="Add Arrow"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          {selectedObject && (
            <button
              onClick={deleteSelectedObject}
              className="p-2 rounded bg-red-500 text-white border"
              title="Delete Selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
        {frame.shotType.replace('-', ' ').toUpperCase()} • {frame.cameraAngle.replace('-', ' ').toUpperCase()}
        {frame.cameraMovement !== 'static' && ` • ${frame.cameraMovement.replace('-', ' ').toUpperCase()}`}
      </div>
    </div>
  );
};