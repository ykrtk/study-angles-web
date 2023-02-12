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

export const getContainerCoords = (clientCoords: Point, containerRect: DOMRect): Point => {
    return {
        x: clientCoords.x - containerRect.left,
        y: clientCoords.y - containerRect.top
    } as Point;
}
