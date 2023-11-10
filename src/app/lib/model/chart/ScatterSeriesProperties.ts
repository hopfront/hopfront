export enum ScatterSeriesShape {
    Circle = 'circle',
    Cross = 'cross',
    Diamond = 'diamond',
    Square = 'square',
    Star = 'star',
    Triangle = 'triangle',
    Wye = 'wye',
}

export interface ScatterSeriesProperties {
    isAnimationActive: boolean
    shape: ScatterSeriesShape
}