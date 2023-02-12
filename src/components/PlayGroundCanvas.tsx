import styles from '@/styles/PlayGroundCanvas.module.scss'
import { Circle, Dimension, getContainerCoords, Point } from '@/utils/Drawing';
import { useTranslations } from 'next-intl'
import { MutableRefObject, RefObject, useCallback, useEffect, useRef, useState } from 'react';

const CANVAS_ELEMENT_ID = 'playGroundCanvas';
const DEFAULT_CANVAS_WIDTH = 500;
const DEFAULT_CANVAS_HEIGHT = 500;
const CANVAS_CIRCLE_MARGIN = 30;
const HANDLER_CIRCLE_RADIUS = 20;

const INITIAL_DRAWINGS_COLOR = 'darkgray'
const DEFAULT_LINE_WIDTH = 3

const drawBackground = (
    // canvasRef: RefObject<HTMLCanvasElement>, 
    canvasContext: CanvasRenderingContext2D, 
    canvasDimension: Dimension, 
    clear: boolean = false): Point => {

    const canvasWidth = canvasDimension.width;
    const canvasHeight = canvasDimension.height;
    const ctx = canvasContext!;

    if (clear) {
        ctx.beginPath();
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.closePath();    
    }

    const bigCircleCenter = getCenter(canvasWidth, canvasHeight);
    const radius = getCircleRadius(canvasWidth, canvasHeight);
    const bigCircle = new Circle(bigCircleCenter, radius, DEFAULT_LINE_WIDTH, INITIAL_DRAWINGS_COLOR);
    bigCircle.drawOnCanvas(ctx);

    const handlerCircleCenter = {x: bigCircleCenter.x + radius, y: bigCircleCenter.y};
    ctx.lineWidth = DEFAULT_LINE_WIDTH;
    ctx.strokeStyle = INITIAL_DRAWINGS_COLOR;

    // Draw the line between center and the starting point
    ctx.beginPath();
    ctx.moveTo(handlerCircleCenter.x, handlerCircleCenter.y);
    ctx.lineTo(bigCircleCenter.x, bigCircleCenter.y);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(bigCircleCenter.x, bigCircleCenter.y, (radius * 1.11), (Math.PI * 2 * 0.97), (Math.PI * 2 * 0.9), true);
    canvasContext.stroke();
    ctx.closePath();

    return handlerCircleCenter;
}

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

const getCenter = (width: number | undefined | null, height: number | undefined | null): Point => {
    width = width ?? 0;
    height = height ?? 0;

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
    const [initialized, setInitialized] = useState(false);
    const [handlerCircle, setHandlerCircle] = useState<Circle | null>(null);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const draggingRef = useRef(false);
    const handleNativeMouseMoveRef = useRef<(e: MouseEvent) => void>(null) as MutableRefObject<(e: MouseEvent) => void>;

    const drawInitialState = (
        canvasContext: CanvasRenderingContext2D, 
        canvasDimension: Dimension): Circle => {

        const handlerCircleCenter = drawBackground(canvasContext, canvasDimension, false);
        // Draw the handler circle
        const handlerCircle = new Circle(handlerCircleCenter, HANDLER_CIRCLE_RADIUS, DEFAULT_LINE_WIDTH, 
                                            INITIAL_DRAWINGS_COLOR, INITIAL_DRAWINGS_COLOR, true);
        handlerCircle.drawOnCanvas(canvasContext);
        return handlerCircle;
    }

    const handleMouseDown = useCallback((e : React.MouseEvent<HTMLCanvasElement>) => {
        console.log('mousedown');
        if (!initialized || !handlerCircle) {
            console.log('Not properly initialized');
            return;
        }

        const coordsInCanvas = getContainerCoords({x: e.clientX, y: e.clientY}, canvasRef.current!.getBoundingClientRect());
        console.log(`inCanvas: ${coordsInCanvas.x}, ${coordsInCanvas.y}`);
        console.log(`handlerCenter: ${handlerCircle?.centerPoint?.x}, ${handlerCircle?.centerPoint?.y}`);

        if (handlerCircle.contains(coordsInCanvas)) {
            draggingRef.current = true;
            // We need to use useRef to keep the reference to the handleNativeMouseMove event handler,
            // because in order to get removeEventListener in handleMouseUp() to work as expected, 
            // we need the idential instance of it which was used for addEventListener
            handleNativeMouseMoveRef.current = handleNativeMouseMove;
            canvasRef.current?.addEventListener('mousemove', handleNativeMouseMoveRef.current);
        }
    }, [initialized, handlerCircle])

    const handleMouseUp = useCallback((e : React.MouseEvent<HTMLCanvasElement>) => {
        console.log('mouseup');
        draggingRef.current = false;
        canvasRef.current?.removeEventListener('mousemove', handleNativeMouseMoveRef.current);
    }, [])

    const handleNativeMouseMove = useCallback((e : MouseEvent) => {
        console.log('mousemove');
        if (!draggingRef.current) {
            return;
        }

        const coordsInCanvas = getContainerCoords({x: e.clientX, y: e.clientY}, canvasRef.current!.getBoundingClientRect());
        console.log(`coordsInCanvas: ${coordsInCanvas.x}, ${coordsInCanvas.y}`);

        if (!canvasContext) {
            throw new Error('Canvas context is not ready.');
        }
        drawBackground(canvasContext, canvasDimension!, true);

        // Draw the handler circle
        const handlerCircle = new Circle(coordsInCanvas, HANDLER_CIRCLE_RADIUS, DEFAULT_LINE_WIDTH, 
                                            INITIAL_DRAWINGS_COLOR, INITIAL_DRAWINGS_COLOR, true);
        handlerCircle.drawOnCanvas(canvasContext);
        setHandlerCircle(handlerCircle);
        
        const canvasCenter = getCenter(canvasDimension!.width, canvasDimension!.height);

        // Draw the line between center and the starting point
        canvasContext.beginPath();
        canvasContext.moveTo(coordsInCanvas.x, coordsInCanvas.y);
        canvasContext.lineTo(canvasCenter.x, canvasCenter.y);
        canvasContext.stroke();
        canvasContext.closePath();
    }, [canvasContext, canvasDimension])

    // Calculate appropriate canvas size based on browser viewport
    useEffect(() => {
        const parentWidth = canvasRef.current?.parentElement?.clientWidth ?? DEFAULT_CANVAS_WIDTH;
        const parentHeight = canvasRef.current?.parentElement?.clientHeight ?? DEFAULT_CANVAS_HEIGHT;
        const shorterParentSide = Math.min(parentWidth, parentHeight);
        const canvasWidth = shorterParentSide - 10;
        const canvasHeight = shorterParentSide - 10;

        setCanvasDimension({width: canvasWidth, height: canvasHeight});
    }, []);

    // Add CanvasRenderingContext to state after the component has been initialized
    useEffect(() => {
        // setCanvasContext(getCanvasContext(CANVAS_ELEMENT_ID));
        setCanvasContext(getCanvasContext(canvasRef));
    }, []);

    // If context has already been set to state, we can use that
    useEffect(() => {
        if (canvasContext != null) {
            // drawInitialState(canvasRef, canvasContext, 
            //     (canvasDimension ?? { width: DEFAULT_CANVAS_WIDTH, height: DEFAULT_CANVAS_HEIGHT }));

            const handlerCircle = drawInitialState(canvasContext, 
                (canvasDimension ?? { width: DEFAULT_CANVAS_WIDTH, height: DEFAULT_CANVAS_HEIGHT }));
            
            setHandlerCircle(handlerCircle);
            setInitialized(true);
        }
    }, [canvasContext, canvasDimension]);

    useEffect(() => {
        if (initialized)
        {
            // TODO: Delete
            if (canvasRef.current != null) {
                const canvasTop = canvasRef.current.clientTop;
                const canvasLeft = canvasRef.current.clientLeft;
                const canvasTop2 = canvasRef.current.offsetTop;
                const canvasLeft2 = canvasRef.current.offsetLeft;
                const canvasBRect = canvasRef.current.getBoundingClientRect();

                const centerPoint = getCenter(canvasDimension?.width, canvasDimension?.height);
    
                const pointDebug = { originalCenterX: centerPoint.x, originalCenterY: centerPoint.y, 
                    canvasTop: canvasTop, canvasLeft: canvasLeft, canvasTop2: canvasTop2, canvasLeft2: canvasLeft2, bRectTop: canvasBRect.top, bRectLeft: canvasBRect.left };
                console.log(pointDebug);    
            }
        }
    }, [canvasDimension, initialized] )

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