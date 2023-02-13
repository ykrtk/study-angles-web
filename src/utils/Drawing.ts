export const DEGREE_TO_RADIAN : number = (Math.PI / 180);

export type Point = {
    x: number,
    y: number
};

export type Dimension = {
    width: number,
    height: number
};

export class Circle {
    private static readonly DEFAULT_COLOR_STYLE = 'black'

    constructor(
        public readonly centerPoint: Point, 
        public readonly radius: number,
        private lineWidth: number = 2,
        private strokeStyle: string = Circle.DEFAULT_COLOR_STYLE,
        private fillStyle: string = Circle.DEFAULT_COLOR_STYLE,
        private fill: boolean = false) {}

    contains(pointToCheck: Point) {
        const x = pointToCheck.x - this.centerPoint.x;
        const y = pointToCheck.y - this.centerPoint.y;
        const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return (distance <= this.radius); 
    }

    moveTo(point: Point) {
        this.centerPoint.x = point.x;
        this.centerPoint.y = point.y;
    }

    clearOnCanvas(canvasContext: CanvasRenderingContext2D) {
        if (canvasContext != null) {
            canvasContext.globalCompositeOperation = "destination-out";
            
            canvasContext.beginPath();
            canvasContext.arc(this.centerPoint.x, this.centerPoint.y, this.radius, 0, Math.PI * 2, false);
            canvasContext.fill();
            canvasContext.closePath();
        }
    }

    drawOnCanvas(canvasContext: CanvasRenderingContext2D) {
        if (canvasContext != null) {
            canvasContext.globalCompositeOperation = "source-over";

            canvasContext.beginPath();
            canvasContext.strokeStyle = this.strokeStyle;
            canvasContext.lineWidth = this.lineWidth;
            canvasContext.arc(this.centerPoint.x, this.centerPoint.y, this.radius, 0, Math.PI * 2, false);
            canvasContext.stroke();
            if (this.fill) {
                canvasContext.fillStyle = this.fillStyle;
                canvasContext.fill();
            }
            canvasContext.closePath();            
        }
    }
}

export const getAngleInDegreeForUI = (angleInRadian: number) : number => {
    return Math.round(360 - (angleInRadian / DEGREE_TO_RADIAN));
}

export const getAngleInRadian = (cosineValue: number, sineValue: number, counterClockWise: boolean) : number => {        
    if (!counterClockWise) {
        throw new Error('counterClockWise = false is not implemented!');
    }
    
    if (sineValue < 0) {
        // The left-top area (the second quadrant) and the right-top area (the first quadrant)
        return (2 * Math.PI) - Math.acos(cosineValue);
    } else {
        // The left-bottom area (the third quadrant) and the right-bottom area (the fourth quadrant)
        return Math.acos(cosineValue);
    }
}

export const getCenter = (width: number | undefined | null, height: number | undefined | null): Point => {
    width = width ?? 0;
    height = height ?? 0;

    return {
        x: Math.floor(width / 2),
        y: Math.floor(height / 2)
    };
}

export const getCircleRadius = (canvasWidth: number, canvasHeight: number, margin: number): number => {
    const shorterSide = Math.min(canvasWidth, canvasHeight);
    const circleContainerSide = shorterSide - (margin * 2);
    return Math.floor(circleContainerSide / 2); 
}

export const getContainerCoords = (clientCoords: Point, containerRect: DOMRect): Point => {
    return {
        x: clientCoords.x - containerRect.left,
        y: clientCoords.y - containerRect.top
    } as Point;
}
