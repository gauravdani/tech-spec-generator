// GA4 Configuration
export const GA4_CONFIG = {
  measurementId: 'G-KBFPMTX15X',
  streamId: '11160862224'
};

// Initialize GA4
export const initGA4 = () => {
  // Load the Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_CONFIG.measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag exactly as per official instructions
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GA4_CONFIG.measurementId);
};

// Track page views
export const trackPageView = (path: string) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      send_to: GA4_CONFIG.measurementId
    });
  }
};

// Track button clicks
export const trackButtonClick = (buttonName: string, category: string = 'engagement') => {
  if (window.gtag) {
    window.gtag('event', 'button_click', {
      button_name: buttonName,
      category: category,
      send_to: GA4_CONFIG.measurementId
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string) => {
  if (window.gtag) {
    window.gtag('event', 'form_submission', {
      form_name: formName,
      send_to: GA4_CONFIG.measurementId
    });
  }
};

// Track specification generation
export const trackSpecGeneration = (businessType: string, trackingTool: string) => {
  if (window.gtag) {
    window.gtag('event', 'spec_generation', {
      business_type: businessType,
      tracking_tool: trackingTool,
      send_to: GA4_CONFIG.measurementId
    });
  }
};

// Add TypeScript declarations
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
} 