


interface SliderCreatorConfig {

    /**
     * id of the root div element
     * default to slider-container
     */
    rootId: string
    /**
     * class applied to every slide.
     * defaults to '.slide'
     */
    slideSelector: string
    height?: number
    width?: number
    backgroundColor: string
    textColor: string
    dotDisabled: boolean
    disableTouch?: boolean
    dot?: {
        unSelectedColor?: string
        selectedColor?: string,
        dotContainerClassName?: string,
        selectedDotClassName?: string,
        dotClassName?: string,
        dotBottomMargin?: number,
        width?: number,
        height?: number
    }
}

type DeepRequired<T> = {
    [P in keyof T]-?: Required<T[P]>
}

const DEFAULTS: DeepRequired<SliderCreatorConfig> = {
    rootId: 'slider-container',
    slideSelector: ".slide",
    height: window.innerHeight,
    dotDisabled: false,
    width: window.innerWidth,
    backgroundColor: 'transparent',
    textColor: 'inherit',
    disableTouch: false,
    dot: {
        selectedColor: 'white',
        unSelectedColor: 'gray',
        dotContainerClassName: 'dots-container',
        selectedDotClassName: "dot-selected",
        dotClassName: 'dot',
        dotBottomMargin: 10,
        width: 10,
        height: 10,

    }
} as const


function getOrDefault<K extends keyof SliderCreatorConfig>(key: K, value: SliderCreatorConfig[K] | undefined): SliderCreatorConfig[K] {
    if (typeof value !== 'undefined') {
        return value
    }
    return DEFAULTS[key]
}


const STYLES_SYMBOL = Symbol('styles-symbol')
const INDEX_SYMBOL = Symbol('INDEX_SYMBOL')
const GOINBACK_SYMBOL = Symbol('GOINBACK_SYMBOL')


const ROOT_DIV_CLASS = 'SliderCreator_root_div_c'

export class SliderCreator {
    constructor(config: Partial<SliderCreatorConfig> = {}) {
        this.config = {
            ...config,
            rootId: getOrDefault('rootId', config.rootId),
            dotDisabled: getOrDefault('dotDisabled', config.dotDisabled),
            slideSelector: getOrDefault('slideSelector', config.slideSelector),
            height: config.height,
            width: config.width,
            backgroundColor: getOrDefault('backgroundColor', config.backgroundColor),
            textColor: getOrDefault('textColor', config.textColor),
            dot: config.dot
            , disableTouch: config.disableTouch
        }
    }

    /*-------------------------
            PUBLIC Properties
    -------------------------------------*/

    public get currentIndex() {
        return this._currentIndex
    }

    public get isDragging() {
        return this._isDragging
    }

    public get dotClassName() {
        return this.config.dot?.dotClassName || DEFAULTS.dot.dotClassName
    }
    public get dotSelectedClassName() {
        return this.config.dot?.selectedDotClassName || DEFAULTS.dot.selectedDotClassName
    }

    public get dotContainerClassName() {
        return this.config.dot?.dotContainerClassName || DEFAULTS.dot.dotContainerClassName
    }

    public get width() {
        return this.config.width ? `${this.config.width}px` : "100vw"
    }

    public get height() {
        return this.config.height ? `${this.config.height}px` : '100vh'
    }

    public get inLastIndex() {
        return this.currentIndex === this.SlidesArray.length - 1
    }

    public get dotUnselectedColor() {
        return this.config.dot?.unSelectedColor || DEFAULTS.dot.unSelectedColor
    }
    public get dotSelectedColor() {
        return this.config.dot?.selectedColor || DEFAULTS.dot.selectedColor
    }
    public get isGoingBack() {
        return this[GOINBACK_SYMBOL]
    }

    /*-------------------------
    PRIVATE Properties
    -------------------------------------*/
    [GOINBACK_SYMBOL] = false
    private get rootDivClass() {
        return ROOT_DIV_CLASS + "_" + this.config.rootId
    }
    private get dotWidth() {
        return this.config.dot?.width || DEFAULTS.dot.width
    }
    private get dotHeight() {
        return this.config.dot?.height || DEFAULTS.dot.height
    }
    private _isDragging = false
    private get RootDiv() {
        return this.Slider.parentElement as HTMLDivElement
    }
    private get Slider() {
        return document.getElementById(this.config.rootId) as HTMLDivElement
    }

    private get dotBottomMargin() {
        return this.config.dot?.dotBottomMargin || DEFAULTS.dot.dotBottomMargin
    }


    private get SlidesArray() {
        return Array.from(document.querySelectorAll(this.config.slideSelector)) as HTMLElement[]
    }

    private get negativeWidth() {
        if (this.config.width) {
            return -this.config.width
        }
        const w = this.Slider.clientWidth / this.SlidesArray.length
        return -w
        // return -this.RootDiv.clientWidth
        // return -window.innerWidth
    }

    private get rootDivStyles() {
        return `
            width: ${this.width};
            height: ${this.height};
            max-width: 100%;
            max-height: 100%;
            overflow-x: hidden;
            background-color: ${this.config.backgroundColor};
            color: ${this.config.textColor};
            line-height: 1.7;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            margin-left:auto;
            margin-right: auto;
            position: relative;
            `
    }

    private get sliderStyles() {
        return `
        height: ${this.height};
        display: inline-flex;
        overflow-x: hidden;
        transform: translateX(0);
        transition: transform 0.3s ease-out;
        cursor: grab;
        `
    }
    private get slideSelectorStyles() {
        /**
         *  OTHERS REMOVED
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
         */
        return `
        max-height: ${this.height};
        width: ${this.width};
        height: 100%;
        user-select: none;
        padding: 0;
        `
    }
    private _updateCallbacks: ((slider: SliderCreator) => void)[] = []
    private config: SliderCreatorConfig


    private startPosition = 0
    private currentTranslate = 0
    private prevTranslate = 0
    private animationId = 0
    private get _currentIndex() {
        return this[INDEX_SYMBOL]
    }
    private set _currentIndex(index: number) {
        this.toggleDotBackground(this._currentIndex, index)
        this[INDEX_SYMBOL] = index
    }
    private [INDEX_SYMBOL] = 0

    private dots: HTMLDivElement[] = []



    /*-----------------------------------------------------
                     PUBLIC METHODS
      * --------------------------------------------------- */

    public forward() {
        const len = this.SlidesArray.length - 1
        const up = this._currentIndex < len
        if (this._currentIndex === 0 || up) {
            this.goToSlideIndex(this._currentIndex + 1)
        }
        return this
    }


    public goToSlideIndex(index: number, animateAndExecCallbacks = true) {
        const len = this.SlidesArray.length - 1
        const isInBounds = index >= 0 && index <= len
        if (!isInBounds) {
            return this
        }
        this._currentIndex = index
        if (animateAndExecCallbacks) {
            this._isDragging = true
            this.animationId = requestAnimationFrame(this.animation.bind(this))
        }
        this.touchEnd()
        if (animateAndExecCallbacks) {
            this.executeCallbacks()
        }
        return this
    }


    public rotate() {
        if (this.currentIndex === 0) {
            this[GOINBACK_SYMBOL] = false
        }
        if (this.inLastIndex) {
            this.goToSlideIndex(this.currentIndex - 1)
            this[GOINBACK_SYMBOL] = true
        } else if (this.isGoingBack) {
            this.back()
        } else {

            this.next()
        }
        //   currentSlide = this.currentIndex
    }

    public next() {
        const len = this.SlidesArray.length - 1
        const isInBounds = this._currentIndex > 0 && this._currentIndex <= len
        const isLast = this._currentIndex === len
        const up = this._currentIndex < len
        if (this._currentIndex === 0) {
            this.goToSlideIndex(1)
        } else if (isLast) {
            this.goToSlideIndex(0)
        } else if (isInBounds) {
            if (up) {
                this.goToSlideIndex(this._currentIndex + 1)
            } else {
                this.goToSlideIndex(this._currentIndex - 1)
            }
        }
    }

    public back() {
        const len = this.SlidesArray.length - 1
        const isInBounds = this._currentIndex > 0 && this._currentIndex <= len
        if (isInBounds) {
            this.goToSlideIndex(this._currentIndex - 1)
        }
    }



    public init({ disableContexMenu } = {
        disableContexMenu: false
    }) {
        if (!this.Slider) {
            throw new Error(`${SliderCreator.name} expected to find div with querySelector "${this.config.rootId}" but element was not found in DOM.`)
        }
        window.addEventListener('resize', () => {
            this.onResize()
        })
        this.setStyles()
        if (!this.config.dotDisabled) {
            this.addDots()
        }
        if (disableContexMenu) {
            this.RootDiv.oncontextmenu = (e) => {
                e.preventDefault()
                e.stopPropagation()
                return false
            }
        }

        if (!this.config.disableTouch) {


            this.SlidesArray.forEach((slide, index) => {
                const slideImage = slide.querySelector('img')
                slideImage?.addEventListener('dragstart', (e) => {
                    e.preventDefault()
                })

                //touch events
                slide.addEventListener('touchstart', (e) => {
                    this.touchStart(e, index)
                }, {
                    passive: true
                })
                slide.addEventListener('touchend', (e) => {
                    this.touchEnd(e)
                })
                slide.addEventListener('touchmove', (e) => {
                    this.touchMove(e)
                }, {
                    passive: true
                })
                //Mouse events
                slide.addEventListener('mousedown', (e) => {
                    this.touchStart(e, index)
                })
                slide.addEventListener('mouseup', (e) => {
                    this.touchEnd(e)
                })
                slide.addEventListener('mouseleave', (e) => {
                    this.touchEnd(e)
                })
                slide.addEventListener('mousemove', (e) => {
                    this.touchMove(e)
                })
            })
        }
        return this
    }



    public onSlideChange(callback: (visualizer: SliderCreator) => void) {
        this._updateCallbacks.push(callback)
    }


    /*-----------------------------------------------------
                    PRIVATE METHODS
     * --------------------------------------------------- */

    private onResize() {
        this.goToSlideIndex(this.currentIndex, false)
    }
    private addDots() {
        const dotsContainer = document.createElement('div')
        dotsContainer.classList.add(this.dotContainerClassName)
        this.RootDiv.append(dotsContainer)
        const total = this.SlidesArray.length - 1
        this.dots = []
        for (let i = 0; i <= total; i++) {
            this.dots.push(document.createElement('div'))
        }
        for (let [index, dot] of this.dots.entries()) {
            dot.classList.add(this.dotClassName)
            if (index === this._currentIndex) {
                dot.classList.add(this.dotSelectedClassName)
            }
            dot.onclick = () => {
                this.goToSlideIndex(index)
            }
            dotsContainer.append(dot)
        }
    }


    private toggleDotBackground(prevIndex: number, nextIndex: number) {
        if (this.dots[prevIndex]) {
            this.dots[prevIndex].style.background = this.dotUnselectedColor
        }
        if (this.dots[nextIndex]) {
            this.dots[nextIndex].style.background = this.dotSelectedColor
        }
    }

    private getPositionX(event: MouseEvent | TouchEvent) {
        if (event instanceof MouseEvent) {
            return event.pageX
        } else {
            return event.touches[0].clientX
        }
    }
    private touchStart(event: MouseEvent | TouchEvent, index: number) {
        this._currentIndex = index
        this.startPosition = this.getPositionX(event)
        this._isDragging = true
        this.animationId = requestAnimationFrame(this.animation.bind(this))
    }


    private setSliderPosition() {
        this.Slider.style.transform = `translateX(${this.currentTranslate}px)`
    }
    private animation() {
        this.setSliderPosition()
        if (this._isDragging) {
            requestAnimationFrame(this.animation.bind(this))
            this.Slider.classList.add('grabbing')
        }
    }




    private setPositionByIndex() {
        this.currentTranslate = this._currentIndex * this.negativeWidth
        this.prevTranslate = this.currentTranslate
        this.setSliderPosition()
    }


    private move(up: boolean) {
        if (up) {
            this._currentIndex += 1
        } else {
            this._currentIndex -= 1
        }
        this.executeCallbacks()
    }

    private touchEnd(_?: MouseEvent | TouchEvent) {
        this._isDragging = false
        cancelAnimationFrame(this.animationId)
        const moveBy = this.currentTranslate - this.prevTranslate
        const len = this.SlidesArray.length - 1
        const isInBounds = this._currentIndex > 0 && this._currentIndex <= len
        if (moveBy < -100 && this._currentIndex < len) {
            this.move(true)
        }

        if (moveBy > 100 && isInBounds) {
            this.move(false)
        }
        this.setPositionByIndex()
        this.Slider.classList.remove('grabbing')

    }

    private touchMove(event: MouseEvent | TouchEvent) {
        if (this.isDragging) {
            const currentPosition = this.getPositionX(event)
            this.currentTranslate = this.prevTranslate + currentPosition - this.startPosition
        }
    }


    private get dotContainerStyles() {
        if (this.config.dotDisabled) {
            return ''
        }
        return `
        background: transparent;
        position: absolute;
        padding: 8px 12px;
        left: 50%;
        right: 50%;
        transform: translateX(-50%);
        bottom: ${this.dotBottomMargin}px;
        border: none;
        border-radius: 3px;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: fit-content;
        `
    }


    private get dotStyles() {
        if (this.config.dotDisabled) {
            return ''
        }
        return `
        width: ${this.dotWidth}px;
        height:  ${this.dotHeight}px;
        background: ${this.dotUnselectedColor};
        border-radius: 100%;
        padding-left: 5px;
        padding-right: 5px;
        margin: 4px;
        cursor: pointer;
        `
    }

    private setStyles(force = true) {
        //where styles set already?
        const appended = this.getApendedStyles()

        if (appended && !force) {
            return this
        } else if (appended) {
            appended.remove()
        }

        const customStyles = document.createElement('style')
        customStyles.id = this.stylesId
        //@ts-ignore
        customStyles[STYLES_SYMBOL] = STYLES_SYMBOL
        this.RootDiv.classList.add(this.rootDivClass)
        customStyles.innerHTML = `
        ${this.config.slideSelector} {
            ${this.slideSelectorStyles}
        }
        #${this.config.rootId}{
            ${this.sliderStyles}
        }
        .${this.rootDivClass} {
            ${this.rootDivStyles}
        }
        .grabbing{
            cursor:grabbing;
          }
          .${this.dotContainerClassName}{
            ${this.dotContainerStyles}
        }
        .${this.dotClassName}{
            ${this.dotStyles}
        }
        .${this.dotSelectedClassName}{
            ${this.config.dotDisabled ? "" : `background: ${this.dotSelectedColor};`}
        }
        `
        document.querySelector('head')?.append(customStyles)
        return this

    }



    private get stylesId() {
        return SliderCreator.name + "_" + this.rootDivClass
    }

    private getApendedStyles(): HTMLStyleElement | null {
        const appended = document.getElementById(this.stylesId) as any
        if (appended) {
            const sim = appended[STYLES_SYMBOL]
            if (sim) {
                return appended
            }
        }
        return null
    }




    private executeCallbacks() {
        for (let cb of this._updateCallbacks) {
            cb(this)
        }
    }

}





