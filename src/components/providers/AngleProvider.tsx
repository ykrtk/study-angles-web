import { createContext, useContext, useState } from 'react';

export interface AngleContextType {
    angle: number;
    setAngle: (angle: number) => void;
}

export const AngleContext = createContext<AngleContextType>({
    angle: 0,
    setAngle: (angle: number) => {},
});

export const AngleProvider = (props: any) => {
    const { children } = props;

    // Get the default value
    const context: AngleContextType = useContext(AngleContext);

    const [angle, setAngle] = useState(context.angle);

    // For passing context to sub-components
    const newContext: AngleContextType = {
        angle,
        setAngle,
    };

    return (
        <AngleContext.Provider value={newContext}>
            {children}
        </AngleContext.Provider>
    );
};
