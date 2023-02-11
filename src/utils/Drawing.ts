export type Point = {
    x: number,
    y: number
};

export type Dimension = {
    width: number,
    height: number
};

export const getContainerCoords = (clientCoords: Point, containerRect: DOMRect): Point => {
    return {
        x: clientCoords.x - containerRect.left,
        y: clientCoords.y - containerRect.top
    } as Point;
}

export const isInCircle = (circleCenter: Point, circleRadius: number, coordsToCheck: Point): boolean => {
    const left = circleCenter.x - circleRadius;
    const right = circleCenter.x + circleRadius;
    const top = circleCenter.y - circleRadius;
    const bottom = circleCenter.y + circleRadius;

    return (coordsToCheck.x >= left && coordsToCheck.x <= right 
            && coordsToCheck.y >= top && coordsToCheck.y <= bottom);
}
