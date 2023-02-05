import styles from '@/styles/PlayGroundCanvas.module.scss'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react';

type Point = {
    x: number,
    y: number
};

type Dimension = {
    width: number,
    height: number
};

const CANVAS_ELEMENT_ID = 'playGroundCanvas';
const DEFAULT_CANVAS_WIDTH = 600;
const DEFAULT_CANVAS_HEIGHT = 600;
const CANVAS_CIRCLE_MARGIN = 30;

const getCanvasContext = (canvasElementId: string): CanvasRenderingContext2D => {
    const canvas = document.getElementById(canvasElementId);
    if (!(canvas instanceof HTMLCanvasElement)) {
        // Should be an assert
        throw new Error(`The element of id "${canvasElementId}" is not a HTMLCanvasElement`);
    }

    const context = canvas.getContext('2d');
    if (context == null) {
        // Should be an assert
        throw new Error('This browser does not support 2-dimensional canvas rendering contexts.');
    }
    return context;
}

const getCenter = (width: number, height: number): Point => {
    return {
        x: Math.floor(width / 2),
        y: Math.floor(height / 2)
    };
}

const getCircleRadius = (canvasWidth: number, canvasHeight: number): number => {
    const shorterSide = Math.min(canvasWidth, canvasHeight);
    const circleContainerSide = shorterSide - (CANVAS_CIRCLE_MARGIN * 2);
    return Math.floor(circleContainerSide / 2); 
}

export function PlayGroundCanvas() {
    const t = useTranslations('PlayGroundCanvas');
    
    const [canvasDimension, setCanvasDimension] = useState<Dimension | null>(null);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
    const [loaded, setLoaded] = useState(false);

    // Calculate appropriate canvas size based on browser viewport
    useEffect(() => {
        // Browser viewport width without the vertical scroll bar
        const viewportWidth = document.documentElement.clientWidth;
        const canvasWidth = Math.min(viewportWidth - (CANVAS_CIRCLE_MARGIN * 2), DEFAULT_CANVAS_WIDTH);
        const canvasHeight = canvasWidth;
        setCanvasDimension({width: canvasWidth, height: canvasHeight} as Dimension);
    }, []);

    // Add CanvasRenderingContext to state after the component has been initialized
    useEffect(() => {
        setCanvasContext(getCanvasContext(CANVAS_ELEMENT_ID));
    }, []);

    // If context has already been set to state, we can use that
    useEffect(() => {
        const canvasWidth = (canvasDimension != null) ? canvasDimension.width : DEFAULT_CANVAS_WIDTH;
        const canvasHeight = (canvasDimension != null) ? canvasDimension.height : DEFAULT_CANVAS_HEIGHT;

        if (canvasContext !== null)
        {
            const centerPoint = getCenter(canvasWidth, canvasHeight);
            const radius = getCircleRadius(canvasWidth, canvasHeight);
            const startingPoint = {x: centerPoint.x + radius, y: centerPoint.y} as Point;

            canvasContext.strokeStyle = 'darkgray';
            canvasContext.lineWidth = 3;
            
            canvasContext.beginPath();
            // Draw the big circle
            canvasContext.arc(centerPoint.x, centerPoint.y, radius, 0, Math.PI * 2, false);
            canvasContext.stroke();
            canvasContext.closePath();

            // Draw the line between center and the starting point
            canvasContext.beginPath();
            canvasContext.moveTo(startingPoint.x, startingPoint.y);
            canvasContext.lineTo(centerPoint.x, centerPoint.y);
            canvasContext.stroke();
            canvasContext.closePath();

            canvasContext.beginPath();
            // Emphasize the starting point
            canvasContext.arc(startingPoint.x, startingPoint.y, 20, 0, Math.PI * 2, false);
            canvasContext.fillStyle = 'darkgray';
            canvasContext.fill();
            canvasContext.closePath();

            setLoaded(true);
        }
    }, [canvasDimension, canvasContext]);

    useEffect(() => {
        if (loaded)
        {
            // Some subsequent process if necessary
        }
    }, [loaded] )

  return (
    <div>
        <canvas 
            id={CANVAS_ELEMENT_ID} 
            width={(canvasDimension?.width ?? DEFAULT_CANVAS_WIDTH)} 
            height={(canvasDimension?.height ?? DEFAULT_CANVAS_HEIGHT) }>
                {t('canvasNotSupported')}
        </canvas>
    </div>
  );
}