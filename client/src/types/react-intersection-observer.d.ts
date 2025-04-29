declare module 'react-intersection-observer' {
  import { RefObject } from 'react';

  interface IntersectionObserverEntry {
    boundingClientRect: DOMRectReadOnly;
    intersectionRatio: number;
    intersectionRect: DOMRectReadOnly;
    isIntersecting: boolean;
    rootBounds: DOMRectReadOnly | null;
    target: Element;
    time: number;
  }

  interface IntersectionObserverProps {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
    trackVisibility?: boolean;
    delay?: number;
  }

  interface UseInViewOptions extends IntersectionObserverProps {
    triggerOnce?: boolean;
  }

  interface UseInViewResponse {
    ref: RefObject<Element>;
    inView: boolean;
    entry?: IntersectionObserverEntry;
  }

  export function useInView(options?: UseInViewOptions): UseInViewResponse;
  export function InView(props: {
    children: (props: { ref: RefObject<Element>; inView: boolean; entry?: IntersectionObserverEntry }) => React.ReactNode;
  } & IntersectionObserverProps): JSX.Element;
} 