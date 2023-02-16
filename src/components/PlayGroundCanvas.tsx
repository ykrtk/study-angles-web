import styles from '@/styles/PlayGroundCanvas.module.scss'
import { DEGREE_TO_RADIAN, Circle, Dimension, Point, getAngleInRadian, getContainerCoords, getAngleInDegreeForUI, getCenter, getCircleRadius } from '@/utils/Drawing';
import { useTranslations } from 'next-intl'
import { MutableRefObject, RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AngleContext } from './providers/AngleProvider';

const CANVAS_ELEMENT_ID = 'playGroundCanvas';
const DEFAULT_CANVAS_WIDTH = 400;
const DEFAULT_CANVAS_HEIGHT = 400;
const HEADER_APPROX_MARGIN = 100;
const ANGLE_INDICATOR_APPROX_MARGIN = 30;

const CANVAS_CIRCLE_MARGIN = 40;
const HANDLER_CIRCLE_RADIUS = 20;
const ANGLE_MARKER_WIDTH_FACTOR = 0.23

const DEFAULT_LINE_WIDTH = 3
const DEFAULT_DRAWINGS_COLOR = 'darkgray'
//const DEFAULT_DRAWINGS_COLOR = '#837E7C' // 'granite'
const RIGHT_ANGLE_STROKE_COLOR = 'red'
const RIGHT_ANGLE_STROKE_WIDTH = 6
const SELECTED_SECTOR_FILL_COLOR = 'pink'

const drawBackground = (
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
    const radius = getCircleRadius(canvasWidth, canvasHeight, CANVAS_CIRCLE_MARGIN);
    const bigCircle = new Circle(bigCircleCenter, radius, DEFAULT_LINE_WIDTH, DEFAULT_DRAWINGS_COLOR);
    bigCircle.drawOnCanvas(ctx);

    const handlerCircleCenter = {x: bigCircleCenter.x + radius, y: bigCircleCenter.y};
    ctx.lineWidth = DEFAULT_LINE_WIDTH;
    ctx.strokeStyle = DEFAULT_DRAWINGS_COLOR;

    // Draw the line between center and the starting point
    ctx.beginPath();
    ctx.moveTo(handlerCircleCenter.x, handlerCircleCenter.y);
    ctx.lineTo(bigCircleCenter.x, bigCircleCenter.y);
    ctx.stroke();
    ctx.closePath();

    // Draw the guide curve arrow
    const curveArrowStartAngle = (-1 * 10 * DEGREE_TO_RADIAN);
    const curveArrowEndAngle = (-1 * 40 * DEGREE_TO_RADIAN);
    const curveArrowDistance = (radius * 1.11);
    const guideArrowEdge = { x: (bigCircleCenter.x + curveArrowDistance * Math.cos(curveArrowEndAngle)), 
                            y: (bigCircleCenter.y + curveArrowDistance * Math.sin(curveArrowEndAngle)) };
    
    ctx.beginPath();
    ctx.arc(bigCircleCenter.x, bigCircleCenter.y, curveArrowDistance, curveArrowStartAngle, curveArrowEndAngle, true);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(guideArrowEdge.x, guideArrowEdge.y);
    ctx.lineTo((guideArrowEdge.x + 50), (guideArrowEdge.y + 25));
    ctx.stroke();
    ctx.closePath();

    return handlerCircleCenter;
}

const highlightDiameter = (
    canvasContext: CanvasRenderingContext2D,
    bigCircleCenter: Point,
    handlerCircleCenter: Point): void => {
    
    const ctx = canvasContext;
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = RIGHT_ANGLE_STROKE_COLOR;
    ctx.lineWidth = RIGHT_ANGLE_STROKE_WIDTH;

    const radius = Math.abs(handlerCircleCenter.x - bigCircleCenter.x);
    ctx.beginPath();
    ctx.moveTo(bigCircleCenter.x - radius, bigCircleCenter.y);
    ctx.lineTo(bigCircleCenter.x + radius, bigCircleCenter.y);
    ctx.stroke();
    ctx.closePath();
}

const highlightRightAngle = (
    canvasContext: CanvasRenderingContext2D,
    bigCircleCenter: Point,
    handlerCircleCenter: Point): void => {
    
    const ctx = canvasContext;
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = RIGHT_ANGLE_STROKE_COLOR;
    ctx.lineWidth = RIGHT_ANGLE_STROKE_WIDTH;

    ctx.beginPath();
    ctx.moveTo(handlerCircleCenter.x, handlerCircleCenter.y);
    ctx.lineTo(bigCircleCenter.x, bigCircleCenter.y);
    ctx.stroke();
    ctx.closePath();

    const radius = Math.abs(handlerCircleCenter.y - bigCircleCenter.y);
    const rightAngleMarkerX = bigCircleCenter.y + (radius * ANGLE_MARKER_WIDTH_FACTOR);
    const rightAngleMarkerY = ((handlerCircleCenter.y < bigCircleCenter.y) 
                                ? (bigCircleCenter.y - (radius * ANGLE_MARKER_WIDTH_FACTOR))
                                : (bigCircleCenter.y + (radius * ANGLE_MARKER_WIDTH_FACTOR)));
    ctx.beginPath();
    ctx.moveTo(rightAngleMarkerX, rightAngleMarkerY);
    ctx.lineTo(rightAngleMarkerX, bigCircleCenter.y);
    ctx.moveTo(rightAngleMarkerX, rightAngleMarkerY);
    ctx.lineTo(bigCircleCenter.x, rightAngleMarkerY);
    ctx.moveTo((bigCircleCenter.x + radius), bigCircleCenter.y);
    ctx.lineTo(bigCircleCenter.x, bigCircleCenter.y);
    ctx.stroke();
    ctx.closePath();
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

export function PlayGroundCanvas() {
    const t = useTranslations('PlayGroundCanvas');

    const [canvasDimension, setCanvasDimension] = useState<Dimension | null>(null);
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
    const [initialized, setInitialized] = useState(false);
    const [handlerCircle, setHandlerCircle] = useState<Circle | null>(null);
    const { angle, setAngle } = useContext(AngleContext);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const draggingRef = useRef(false);
    const handleNativeMouseMoveRef = useRef<(e: MouseEvent) => void>(null) as MutableRefObject<(e: MouseEvent) => void>;
    const handleNativeTouchMoveRef = useRef<(e: TouchEvent) => void>(null) as MutableRefObject<(e: TouchEvent) => void>;

    const calculateCanvasDimension = (): Dimension => {
        const parentWidth = canvasRef.current?.parentElement?.clientWidth ?? DEFAULT_CANVAS_WIDTH;
        const parentHeight = canvasRef.current?.parentElement?.clientHeight ?? DEFAULT_CANVAS_HEIGHT;
        const shorterParentSide = Math.min(parentWidth, parentHeight);
        const canvasHeight = shorterParentSide - HEADER_APPROX_MARGIN - ANGLE_INDICATOR_APPROX_MARGIN;
        const canvasWidth = shorterParentSide;
        return {width: canvasWidth, height: canvasHeight};
    }

    const drawInitialState = (canvasContext: CanvasRenderingContext2D, 
                                canvasDimension: Dimension): Circle => {
        const handlerCircleCenter = drawBackground(canvasContext, canvasDimension, false);
        // Draw the handler circle
        const handlerCircle = new Circle(handlerCircleCenter, HANDLER_CIRCLE_RADIUS, DEFAULT_LINE_WIDTH, 
                                            DEFAULT_DRAWINGS_COLOR, DEFAULT_DRAWINGS_COLOR, true);
        handlerCircle.drawOnCanvas(canvasContext);
        return handlerCircle;
    }

    const drawAngleChange = useCallback((mouseOrTouchPoint: Point) => {
        const xyCoordsInCanvas = getContainerCoords(mouseOrTouchPoint, canvasRef.current!.getBoundingClientRect());
        // console.log(`coordsInCanvas: ${xyCoordsInCanvas.x}, ${xyCoordsInCanvas.y}`);
        if (!canvasContext) {
            throw new Error('Canvas context is not ready.');
        }
        const ctx = canvasContext;

        drawBackground(canvasContext, canvasDimension!, true);
        const canvasCenter = getCenter(canvasDimension!.width, canvasDimension!.height);
        const radius = getCircleRadius(canvasDimension!.width, canvasDimension!.height, CANVAS_CIRCLE_MARGIN);

        // In the coordinate system where the canvasCenter is (0, 0)
        const adjustedWithCenter = {x: xyCoordsInCanvas.x - canvasCenter.x, y: xyCoordsInCanvas.y - canvasCenter.y};
        const distanceFromCenter = Math.sqrt(Math.pow(adjustedWithCenter.x, 2) + Math.pow(adjustedWithCenter.y, 2));
        const cosineValue = adjustedWithCenter.x / distanceFromCenter;
        const sineValue = adjustedWithCenter.y / distanceFromCenter;
        const pointOnArc = { x: radius * cosineValue, y: radius * sineValue } as Point;

        // Convert to the actual canvas coordinates
        const pointOnArcInXY = { x: pointOnArc.x + canvasCenter.x, y: pointOnArc.y + canvasCenter.y } as Point;
        
        // Draw the handler circle on the arc of the center circle
        const handlerCircle = new Circle(pointOnArcInXY, HANDLER_CIRCLE_RADIUS, DEFAULT_LINE_WIDTH, 
                                            DEFAULT_DRAWINGS_COLOR, DEFAULT_DRAWINGS_COLOR, true);
        handlerCircle.drawOnCanvas(ctx);
        setHandlerCircle(handlerCircle);
        
        // Draw the line between center and the handler circle
        ctx.beginPath();
        ctx.moveTo(pointOnArcInXY.x, pointOnArcInXY.y);
        ctx.lineTo(canvasCenter.x, canvasCenter.y);
        ctx.strokeStyle = DEFAULT_DRAWINGS_COLOR;
        ctx.lineWidth = DEFAULT_LINE_WIDTH;
        ctx.stroke();
        ctx.closePath();

        const angleInRadian = getAngleInRadian(cosineValue, sineValue, true);
        const angleInDegreeForUI = getAngleInDegreeForUI(angleInRadian);

        if (angleInDegreeForUI == 180) {
            highlightDiameter(ctx, canvasCenter, pointOnArcInXY);
        }
        else if (angleInDegreeForUI == 90 || angleInDegreeForUI == 270) {
            highlightRightAngle(ctx, canvasCenter, pointOnArcInXY);
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.beginPath();
            ctx.strokeStyle = DEFAULT_DRAWINGS_COLOR;
            ctx.lineWidth = DEFAULT_LINE_WIDTH;
            ctx.arc(canvasCenter.x, canvasCenter.y, (radius * ANGLE_MARKER_WIDTH_FACTOR), 0, angleInRadian, true);
            ctx.stroke();
            ctx.closePath();
        }

        ctx.globalCompositeOperation = "destination-over";        
        ctx.beginPath();
        ctx.moveTo(canvasCenter.x, canvasCenter.y);
        ctx.fillStyle = SELECTED_SECTOR_FILL_COLOR;
        ctx.arc(canvasCenter.x, canvasCenter.y, radius, 0, getAngleInRadian(cosineValue, sineValue, true), true);
        ctx.closePath();
        ctx.fill();

        console.log(`Angle is ${angleInDegreeForUI} degree`);
        setAngle(angleInDegreeForUI);        
    }, [canvasContext, canvasDimension, setAngle])

    const startDragging = useCallback((mouseOrTouchPoint: Point, addEventListener: (() => void)) => {
        if (!initialized || !handlerCircle) {
            console.log('Not properly initialized');
            return;
        }

        const coordsInCanvas = getContainerCoords(mouseOrTouchPoint, canvasRef.current!.getBoundingClientRect());
        // console.log(`inCanvas: ${coordsInCanvas.x}, ${coordsInCanvas.y}`);
        // console.log(`handlerCenter: ${handlerCircle?.centerPoint?.x}, ${handlerCircle?.centerPoint?.y}`);

        if (handlerCircle.contains(coordsInCanvas)) {
            draggingRef.current = true;
            addEventListener();
        }
    }, [handlerCircle, initialized]);

    const handleNativeMouseMove = useCallback((e: MouseEvent) => {
        // console.log('mousemove');
        if (!draggingRef.current) {
            return;
        }
        drawAngleChange({x: e.clientX, y: e.clientY});
    }, [drawAngleChange]);

    const handleNativeTouchMove = useCallback((e: TouchEvent) => {
        // console.log('mousemove');
        if (!draggingRef.current) {
            return;
        }
        const touchList = e.changedTouches[0];
        drawAngleChange({x: touchList.clientX, y: touchList.clientY});
    }, [drawAngleChange]);

    const handleMouseDown = useCallback((e : React.MouseEvent<HTMLCanvasElement>) => {
        // console.log('mousedown');
        startDragging({x: e.clientX, y: e.clientY}, () => {
            // We need to use useRef to keep the reference to the handleNativeMouseMove event handler,
            // because in order to get removeEventListener in handleMouseUp() to work as expected, 
            // we need the idential instance of it which was used for addEventListener
            // handleNativeMoveRef.current = handleNativeMouseOrTouchMove;
            // canvasRef.current?.addEventListener('mousemove', handleNativeMoveRef.current);
            handleNativeMouseMoveRef.current = handleNativeMouseMove;
            canvasRef.current?.addEventListener('mousemove', handleNativeMouseMoveRef.current);
        });
    }, [handleNativeMouseMove, startDragging])

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        // // console.log('touchstart');
        const touchList = e.changedTouches[0];
        startDragging({x: touchList.clientX, y: touchList.clientY}, () => {
            handleNativeTouchMoveRef.current = handleNativeTouchMove;
            canvasRef.current?.addEventListener('touchmove', handleNativeTouchMoveRef.current);
        });
    }, [handleNativeTouchMove, startDragging])

    const handleMouseUp = useCallback((e : React.MouseEvent<HTMLCanvasElement>) => {
        // console.log('mouseup');
        draggingRef.current = false;
        canvasRef.current?.removeEventListener('mousemove', handleNativeMouseMoveRef.current);
    }, []);

    const handleTouchEnd = useCallback((e : React.TouchEvent<HTMLCanvasElement>) => {
        // console.log('touchup');
        draggingRef.current = false;
        canvasRef.current?.removeEventListener('touchmove', handleNativeTouchMoveRef.current);
    }, []);

    useEffect(() => {
        // Calculate appropriate canvas size based on browser viewport
        setCanvasDimension(calculateCanvasDimension());
    }, []);

    useEffect(() => {
        // Add CanvasRenderingContext to state after the component has been initialized
        setCanvasContext(getCanvasContext(canvasRef));
    }, []);

    // If context has already been set to state, we can use that
    useEffect(() => {
        if (canvasContext != null) {
            const handlerCircle = drawInitialState(canvasContext, 
                (canvasDimension ?? { width: DEFAULT_CANVAS_WIDTH, height: DEFAULT_CANVAS_HEIGHT }));
            
            setHandlerCircle(handlerCircle);
            setInitialized(true);
        }
    }, [canvasContext, canvasDimension]);

    useEffect(() => {
        if (initialized)
        {}
    }, [canvasDimension, initialized] )

  return (
    <canvas 
        id={CANVAS_ELEMENT_ID} 
        className={styles.canvas}
        ref={canvasRef}
        width={(canvasDimension?.width ?? DEFAULT_CANVAS_WIDTH)} 
        height={(canvasDimension?.height ?? DEFAULT_CANVAS_HEIGHT)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
            {t('canvasNotSupported')}
    </canvas>
  );
}