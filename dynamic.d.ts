// declare const dynamic: (resolve: (value?: PromiseLike<any>) => void) => void;
// export default dynamic;

declare class dynamic {
    constructor(resolve: (value?: PromiseLike<any>) => void)
    static setDefaultLoadingComponent: (c?: React.ElementType) => void
}

export default dynamic
