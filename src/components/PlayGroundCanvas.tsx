import styles from '@/styles/PlayGroundCanvas.module.scss'
import { Dimension, getContainerCoords, isInCircle, Point } from '@/utils/Drawing';
import { useTranslations } from 'next-intl'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

const CANVAS_ELEMENT_ID = 'playGroundCanvas';
const DEFAULT_CANVAS_WIDTH = 500;
const DEFAULT_CANVAS_HEIGHT = 500;
const CANVAS_CIRCLE_MARGIN = 30;
const MOVABLE_CIRCLE_RADIUS = 20;

const getCanvasContext = (canvasRef: RefObject<HTMLCanvasElement>): CanvasRenderingContext2D => {
    const canvas = canvasRef.current;
    if (!canvas) {
        // Should be an assert
        throw new Error('Ref to Canvas is falsy');
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
    const [mvCircleCenter, setMvCircleCenter] = useState<Point | null>(null);
    // const [dragging, setDragging] = useState(false);
    const draggingRef = useRef(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleMouseDown = useCallback((e : React.MouseEvent<HTMLCanvasElement>) => {
        console.log('mousedown');
        // console.log(`${mvCircleCenter?.x}, ${mvCircleCenter?.y}`);
        const coordsInCanvas = getContainerCoords({x: e.clientX, y: e.clientY}, canvasRef.current!.getBoundingClientRect());
        console.log(`${coordsInCanvas.x}, ${coordsInCanvas.y}`);
        //console.log(isInCircle(mvCircleCenter as Point, MOVABLE_CIRCLE_RADIUS, coordsInCanvas));
        if (isInCircle(mvCircleCenter as Point, MOVABLE_CIRCLE_RADIUS, coordsInCanvas)) {
            console.log(draggingRef.current);
            // setDragging(true);
            draggingRef.current = true;
            console.log(draggingRef.current);
            canvasRef.current?.addEventListener('mousemove', handleNativeMouseMove);
        }
    }, [mvCircleCenter])

    const handleMouseUp = useCallback((e : React.MouseEvent<HTMLCanvasElement>) => {
        // console.log(`${mvCircleCenter?.x}, ${mvCircleCenter?.y}`);
        // const coordsInCanvas = getContainerCoords({x: e.clientX, y: e.clientY}, canvasRef.current!.getBoundingClientRect());
        // console.log(`${coordsInCanvas.x}, ${coordsInCanvas.y}`);
        //console.log(isInCircle(mvCircleCenter as Point, MOVABLE_CIRCLE_RADIUS, coordsInCanvas));
        // if (isInCircle(mvCircleCenter as Point, MOVABLE_CIRCLE_RADIUS, coordsInCanvas)) {
        //     setDragging(true);
        //     console.log('dragging');
        //     canvasRef.current?.addEventListener('mousemove', handleNativeMouseMove);
        // }
        console.log('mouseup');
        draggingRef.current = false;
        canvasRef.current?.removeEventListener('mousemove', handleNativeMouseMove);
        // setDragging(false);
    }, [])

    const handleNativeMouseMove = useCallback((e : MouseEvent) => {
        console.log('mousemove');
        console.log(draggingRef.current);

        if (!draggingRef.current) {
            return;
        }

        console.log('dragging - continue');
        const coordsInCanvas = getContainerCoords({x: e.clientX, y: e.clientY}, canvasRef.current!.getBoundingClientRect());
        console.log(`${coordsInCanvas.x}, ${coordsInCanvas.y}`);
        setMvCircleCenter(coordsInCanvas);

        if (canvasContext !== null)
        {
            // setMvCircleCenter((prevState) => {
            //     canvasContext.globalCompositeOperation = "destination-out";
            //     canvasContext.beginPath();
            //     // Emphasize the starting point
            //     canvasContext.arc((prevState?.x ?? 0), (prevState?.y ?? 0), MOVABLE_CIRCLE_RADIUS, 0, Math.PI * 2, false);
            //     canvasContext.fill();
            //     canvasContext.closePath();

            //     return coordsInCanvas;
            // });

            const canvasWidth = canvasDimension?.width ?? DEFAULT_CANVAS_WIDTH;
            const canvasHeight = canvasDimension?.height ?? DEFAULT_CANVAS_HEIGHT;

            canvasContext.beginPath();
            canvasContext.clearRect(canvasRef.current?.offsetLeft ?? 0, canvasRef.current?.offsetTop ?? 0, canvasWidth, canvasHeight);
            canvasContext.closePath();
    
            canvasContext.strokeStyle = 'darkgray';
            canvasContext.lineWidth = 3;
            const centerPoint = getCenter(canvasWidth, canvasHeight);
            const radius = getCircleRadius(canvasWidth, canvasHeight);

            canvasContext.beginPath();
            // Draw the big circle
            canvasContext.arc(centerPoint.x, centerPoint.y, radius, 0, Math.PI * 2, false);
            canvasContext.stroke();
            canvasContext.closePath();

            // Draw the line between center and the starting point
            canvasContext.beginPath();
            canvasContext.moveTo(coordsInCanvas.x, coordsInCanvas.y);
            canvasContext.lineTo(centerPoint.x, centerPoint.y);
            canvasContext.stroke();
            canvasContext.closePath();

            // canvasContext.globalCompositeOperation = "source-over";
            canvasContext.beginPath();
            // Emphasize the starting point
            canvasContext.arc(coordsInCanvas.x, coordsInCanvas.y, MOVABLE_CIRCLE_RADIUS, 0, Math.PI * 2, false);
            canvasContext.fillStyle = 'darkgray';
            canvasContext.fill();
            canvasContext.closePath();
        }
    }, [canvasContext])

    // const handleMouseMove = useCallback((e : React.MouseEvent<HTMLCanvasElement>) => {
    //     handleNativeMouseMove(e.nativeEvent);
    // }, [handleNativeMouseMove])

    // Calculate appropriate canvas size based on browser viewport
    useEffect(() => {
        // Browser viewport width without the vertical scroll bar
        // const viewportWidth = document.documentElement.clientWidth;

        const parentWidth = canvasRef.current?.parentElement?.clientWidth ?? DEFAULT_CANVAS_WIDTH;
        const parentHeight = canvasRef.current?.parentElement?.clientHeight ?? DEFAULT_CANVAS_HEIGHT;
        const shorterParentSide = Math.min(parentWidth, parentHeight);
        const canvasWidth = shorterParentSide - 10;
        const canvasHeight = shorterParentSide - 10;

        // const canvasWidth = Math.max(viewportWidth - (CANVAS_CIRCLE_MARGIN * 2), MIN_CANVAS_WIDTH);
        
        // const canvasHeight = canvasWidth;
        setCanvasDimension({width: canvasWidth, height: canvasHeight});
    }, []);

    // Add CanvasRenderingContext to state after the component has been initialized
    useEffect(() => {
        // setCanvasContext(getCanvasContext(CANVAS_ELEMENT_ID));
        setCanvasContext(getCanvasContext(canvasRef));
    }, []);

    // If context has already been set to state, we can use that
    useEffect(() => {
        const canvasWidth = canvasDimension?.width ?? DEFAULT_CANVAS_WIDTH;
        const canvasHeight = canvasDimension?.height ?? DEFAULT_CANVAS_HEIGHT;

        if (canvasContext !== null)
        {
            const centerPoint = getCenter(canvasWidth, canvasHeight);
            const radius = getCircleRadius(canvasWidth, canvasHeight);
            const startingPoint = {x: centerPoint.x + radius, y: centerPoint.y};
            setMvCircleCenter(startingPoint);
            console.log(`mvCircleCenter ${startingPoint.x} ${startingPoint.y}`);

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
            canvasContext.arc(startingPoint.x, startingPoint.y, MOVABLE_CIRCLE_RADIUS, 0, Math.PI * 2, false);
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
    <canvas 
        id={CANVAS_ELEMENT_ID} 
        className={styles.canvas}
        ref={canvasRef}
        width={(canvasDimension?.width ?? DEFAULT_CANVAS_WIDTH)} 
        height={(canvasDimension?.height ?? DEFAULT_CANVAS_HEIGHT)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}>
            {t('canvasNotSupported')}
    </canvas>
  );
}