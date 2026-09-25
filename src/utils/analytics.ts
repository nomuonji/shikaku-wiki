export type AnalyticsParams = Record<
  string,
  string | number | boolean | undefined
>;

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;

  const gtag = (
    window as typeof window & {
      gtag?: (
        command: 'event',
        eventName: string,
        eventParams?: AnalyticsParams,
      ) => void;
    }
  ).gtag;

  gtag?.('event', name, params);
}
