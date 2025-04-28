export interface EventCategory {
  id: string;
  name: string;
  events: Event[];
}

export interface Event {
  id: string;
  name: string;
  description: string;
}

export const genericEvents: EventCategory[] = [
  {
    id: 'app_lifecycle',
    name: 'App Lifecycle',
    events: [
      { id: 'app_opened', name: 'App Opened', description: 'When the application is launched or brought to foreground' },
      { id: 'app_closed', name: 'App Closed', description: 'When the application is closed or sent to background' },
      { id: 'page_viewed', name: 'Page Viewed', description: 'When a user views any page in the application' },
      { id: 'deep_link_clicked', name: 'Deep Link Clicked', description: 'When a user clicks on a deep link to the application' }
    ]
  },
  {
    id: 'user_interactions',
    name: 'User Interactions',
    events: [
      { id: 'cta_clicked', name: 'CTA Clicked', description: 'When a user clicks on any call-to-action button' },
      { id: 'feedback_submitted', name: 'Feedback Submitted', description: 'When a user submits feedback or ratings' }
    ]
  },
  {
    id: 'notifications',
    name: 'Notifications',
    events: [
      { id: 'notification_received', name: 'Notification Received', description: 'When a push notification is received' },
      { id: 'notification_clicked', name: 'Notification Clicked', description: 'When a user clicks on a notification' }
    ]
  },
  {
    id: 'permissions',
    name: 'Permissions & Settings',
    events: [
      { id: 'consent_given', name: 'Consent Given', description: 'When a user gives consent for data collection or processing' },
      { id: 'consent_withdrawn', name: 'Consent Withdrawn', description: 'When a user withdraws their consent' },
      { id: 'language_selected', name: 'Language Selected', description: 'When a user changes the application language' },
      { id: 'dark_mode_toggled', name: 'Dark Mode Toggled', description: 'When a user toggles dark/light mode' },
      { id: 'location_permission_granted', name: 'Location Permission Granted', description: 'When a user grants location access' }
    ]
  },
  {
    id: 'system',
    name: 'System Events',
    events: [
      { id: 'device_info_captured', name: 'Device Info Captured', description: 'When device information is collected' },
      { id: 'crash_detected', name: 'Crash Detected', description: 'When an application crash is detected' }
    ]
  }
];

// Helper function to combine business-specific and generic events
const combineEvents = (businessEvents: EventCategory[]): EventCategory[] => {
  return [...businessEvents, ...genericEvents];
};

export const eventsByBusinessType: Record<string, EventCategory[]> = {
  eCommerce: combineEvents([
    {
      id: 'product',
      name: 'Product Interactions',
      events: [
        { id: 'product_viewed', name: 'Product Viewed', description: 'When a user views a product detail page' },
        { id: 'product_clicked', name: 'Product Clicked', description: 'When a user clicks on a product in a list' },
        { id: 'product_searched', name: 'Product Searched', description: 'When a user searches for products' },
        { id: 'product_compared', name: 'Product Compared', description: 'When a user compares products' },
        { id: 'product_shared', name: 'Product Shared', description: 'When a user shares a product' },
        { id: 'product_reviewed', name: 'Product Reviewed', description: 'When a user reviews a product' },
        { id: 'product_rated', name: 'Product Rated', description: 'When a user rates a product' },
        { id: 'product_wishlisted', name: 'Product Wishlisted', description: 'When a user adds to wishlist' },
        { id: 'wishlist_viewed', name: 'Wishlist Viewed', description: 'When a user views their wishlist' },
        { id: 'price_drop_alert', name: 'Price Drop Alert Set', description: 'When a user sets a price alert' },
        { id: 'size_selected', name: 'Size Selected', description: 'When a user selects a size' },
        { id: 'color_swatch', name: 'Color Swatch Clicked', description: 'When a user clicks a color option' },
        { id: 'out_of_stock', name: 'Out of Stock Notified', description: 'When user requests stock notification' },
        { id: 'recently_viewed', name: 'Recently Viewed Viewed', description: 'When user views recent products' },
        { id: 'back_in_stock', name: 'Back in Stock Alert Clicked', description: 'When user sets back in stock alert' },
        { id: 'similar_products', name: 'Similar Products Viewed', description: 'When user views similar products' }
      ]
    },
    {
      id: 'checkout',
      name: 'Checkout & Purchase',
      events: [
        { id: 'checkout_started', name: 'Checkout Started', description: 'When a user initiates checkout' },
        { id: 'shipping_selected', name: 'Shipping Method Selected', description: 'When a user selects shipping' },
        { id: 'payment_selected', name: 'Payment Method Selected', description: 'When a user selects payment' },
        { id: 'gift_wrap', name: 'Gift Wrap Selected', description: 'When gift wrapping is selected' },
        { id: 'promo_applied', name: 'Promo Code Applied', description: 'When a promo code is applied' },
        { id: 'billing_entered', name: 'Billing Info Entered', description: 'When billing info is provided' },
        { id: 'address_saved', name: 'Address Saved', description: 'When an address is saved' },
        { id: 'order_placed', name: 'Order Placed', description: 'When an order is successfully placed' },
        { id: 'order_failed', name: 'Order Failed', description: 'When an order fails to process' },
        { id: 'order_confirmed', name: 'Order Confirmed', description: 'When an order is confirmed' },
        { id: 'order_cancelled', name: 'Order Cancelled', description: 'When an order is cancelled' },
        { id: 'order_returned', name: 'Order Returned', description: 'When an order is returned' },
        { id: 'order_tracked', name: 'Order Tracked', description: 'When an order is tracked' },
        { id: 'refund_initiated', name: 'Refund Initiated', description: 'When a refund is requested' },
        { id: 'refund_processed', name: 'Refund Processed', description: 'When a refund is processed' }
      ]
    }
  ]),
  OTT: combineEvents([
    {
      id: 'streaming',
      name: 'Streaming Events',
      events: [
        { id: 'video_played', name: 'Video Played', description: 'When a video starts playing' },
        { id: 'video_paused', name: 'Video Paused', description: 'When a video is paused' },
        { id: 'video_resumed', name: 'Video Resumed', description: 'When a video resumes playing' },
        { id: 'video_skipped', name: 'Video Skipped', description: 'When a video is skipped' },
        { id: 'episode_completed', name: 'Episode Completed', description: 'When an episode finishes' },
        { id: 'series_followed', name: 'Series Followed', description: 'When a series is followed' },
        { id: 'series_rated', name: 'Series Rated', description: 'When a series is rated' },
        { id: 'genre_filter', name: 'Genre Filter Applied', description: 'When genre filter is used' },
        { id: 'continue_watching', name: 'Continue Watching Clicked', description: 'When continue watching is used' },
        { id: 'watch_history', name: 'Watched History Viewed', description: 'When watch history is viewed' },
        { id: 'episode_skipped', name: 'Episode Skipped', description: 'When an episode is skipped' },
        { id: 'watchlist_added', name: 'Watchlist Added', description: 'When item is added to watchlist' },
        { id: 'watchlist_removed', name: 'Watchlist Removed', description: 'When item is removed from watchlist' },
        { id: 'subtitle_on', name: 'Subtitle Turned On', description: 'When subtitles are enabled' },
        { id: 'audio_changed', name: 'Audio Language Changed', description: 'When audio language is changed' }
      ]
    }
  ]),
  SaaS: combineEvents([
    {
      id: 'user_account',
      name: 'User Account',
      events: [
        { id: 'signup', name: 'Sign Up', description: 'When a user creates a new account' },
        { id: 'login', name: 'Login', description: 'When a user logs into their account' },
        { id: 'logout', name: 'Logout', description: 'When a user logs out' },
        { id: 'password_reset', name: 'Password Reset', description: 'When a user resets their password' }
      ]
    },
    {
      id: 'subscription',
      name: 'Subscription',
      events: [
        { id: 'subscription_started', name: 'Subscription Started', description: 'When a user starts a subscription' },
        { id: 'subscription_cancelled', name: 'Subscription Cancelled', description: 'When a user cancels their subscription' },
        { id: 'plan_changed', name: 'Plan Changed', description: 'When a user changes their subscription plan' }
      ]
    }
  ]),
  Gaming: combineEvents([
    {
      id: 'gameplay',
      name: 'Gameplay',
      events: [
        { id: 'game_started', name: 'Game Started', description: 'When a user starts a game' },
        { id: 'level_completed', name: 'Level Completed', description: 'When a user completes a level' },
        { id: 'achievement_unlocked', name: 'Achievement Unlocked', description: 'When a user unlocks an achievement' }
      ]
    },
    {
      id: 'monetization',
      name: 'Monetization',
      events: [
        { id: 'in_app_purchase', name: 'In-App Purchase', description: 'When a user makes an in-app purchase' },
        { id: 'virtual_currency_purchased', name: 'Virtual Currency Purchased', description: 'When a user buys virtual currency' }
      ]
    }
  ]),
  FinTech: combineEvents([
    {
      id: 'transactions',
      name: 'Transactions',
      events: [
        { id: 'transaction_initiated', name: 'Transaction Initiated', description: 'When a user initiates any financial transaction' },
        { id: 'transaction_completed', name: 'Transaction Completed', description: 'When a transaction is successfully completed' },
        { id: 'transaction_failed', name: 'Transaction Failed', description: 'When a transaction fails to process' },
        { id: 'bill_paid', name: 'Bill Paid', description: 'When a user successfully pays a bill' }
      ]
    },
    {
      id: 'payment_methods',
      name: 'Payment Methods',
      events: [
        { id: 'upi_linked', name: 'UPI Linked', description: 'When a user links their UPI ID' },
        { id: 'card_added', name: 'Card Added', description: 'When a user adds a new card' },
        { id: 'card_removed', name: 'Card Removed', description: 'When a user removes a card' }
      ]
    },
    {
      id: 'loans',
      name: 'Loans',
      events: [
        { id: 'loan_applied', name: 'Loan Applied', description: 'When a user applies for a loan' },
        { id: 'loan_approved', name: 'Loan Approved', description: 'When a loan application is approved' },
        { id: 'emi_set', name: 'EMI Set', description: 'When EMI details are configured for a loan' }
      ]
    },
    {
      id: 'investments',
      name: 'Investments',
      events: [
        { id: 'mutual_fund_bought', name: 'Mutual Fund Bought', description: 'When a user purchases mutual fund units' },
        { id: 'stock_traded', name: 'Stock Traded', description: 'When a user trades stocks' },
        { id: 'sip_started', name: 'SIP Started', description: 'When a user starts a Systematic Investment Plan' }
      ]
    },
    {
      id: 'account',
      name: 'Account Management',
      events: [
        { id: 'kyc_verified', name: 'KYC Verified', description: 'When a user completes KYC verification' },
        { id: 'wallet_recharged', name: 'Wallet Recharged', description: 'When a user adds money to their wallet' }
      ]
    }
  ]),
  EdTech: combineEvents([
    {
      id: 'learning',
      name: 'Learning Progress',
      events: [
        { id: 'course_started', name: 'Course Started', description: 'When a user starts a course' },
        { id: 'lesson_completed', name: 'Lesson Completed', description: 'When a user completes a lesson' },
        { id: 'quiz_submitted', name: 'Quiz Submitted', description: 'When a user submits a quiz' },
        { id: 'certificate_earned', name: 'Certificate Earned', description: 'When a user earns a certificate' }
      ]
    },
    {
      id: 'engagement',
      name: 'Learning Engagement',
      events: [
        { id: 'video_watched', name: 'Video Watched', description: 'When a user watches a video lecture' },
        { id: 'note_taken', name: 'Note Taken', description: 'When a user takes notes' },
        { id: 'discussion_posted', name: 'Discussion Posted', description: 'When a user posts in discussions' }
      ]
    }
  ]),
  Healthcare: combineEvents([
    {
      id: 'appointments',
      name: 'Appointments',
      events: [
        { id: 'appointment_booked', name: 'Appointment Booked', description: 'When a patient books an appointment' },
        { id: 'appointment_cancelled', name: 'Appointment Cancelled', description: 'When an appointment is cancelled' },
        { id: 'check_in_completed', name: 'Check-in Completed', description: 'When a patient checks in' }
      ]
    },
    {
      id: 'medical_records',
      name: 'Medical Records',
      events: [
        { id: 'record_viewed', name: 'Record Viewed', description: 'When medical records are accessed' },
        { id: 'prescription_renewed', name: 'Prescription Renewed', description: 'When a prescription is renewed' },
        { id: 'test_results_viewed', name: 'Test Results Viewed', description: 'When test results are viewed' }
      ]
    }
  ]),
  RealEstate: combineEvents([
    {
      id: 'property_search',
      name: 'Property Search',
      events: [
        { id: 'property_viewed', name: 'Property Viewed', description: 'When a property listing is viewed' },
        { id: 'search_filters_applied', name: 'Search Filters Applied', description: 'When search filters are used' },
        { id: 'saved_search_created', name: 'Saved Search Created', description: 'When a search is saved' }
      ]
    },
    {
      id: 'property_interaction',
      name: 'Property Interaction',
      events: [
        { id: 'contact_agent', name: 'Contact Agent', description: 'When an agent is contacted' },
        { id: 'schedule_viewing', name: 'Schedule Viewing', description: 'When a viewing is scheduled' },
        { id: 'mortgage_calculator_used', name: 'Mortgage Calculator Used', description: 'When mortgage calculator is used' }
      ]
    }
  ])
};

export const businessTypes = [
  { value: 'eCommerce', label: 'eCommerce' },
  { value: 'OTT', label: 'OTT' },
  { value: 'SaaS', label: 'SaaS' },
  { value: 'EdTech', label: 'EdTech' },
  { value: 'FinTech', label: 'FinTech' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'RealEstate', label: 'Real Estate' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Media', label: 'Media' },
  { value: 'B2B', label: 'B2B Enterprise' }
];

export const platformTypes = [
  { value: 'Web', label: 'Web' },
  { value: 'iOS', label: 'iOS' },
  { value: 'Android', label: 'Android' },
  { value: 'SmartTV', label: 'Smart TV' },
  { value: 'Console', label: 'Console' }
];

export const deviceTypes = [
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Tablet', label: 'Tablet' },
  { value: 'TV', label: 'TV' }
];

export const trackingTools = [
  { value: 'Segment', label: 'Segment' },
  { value: 'GTM', label: 'Google Tag Manager' },
  { value: 'RudderStack', label: 'RudderStack' },
  { value: 'Mixpanel', label: 'Mixpanel' },
  { value: 'Adobe', label: 'Adobe Analytics' },
  { value: 'Amplitude', label: 'Amplitude' },
  { value: 'Heap', label: 'Heap' },
  { value: 'Pendo', label: 'Pendo' },
  { value: 'Matomo', label: 'Matomo' },
  { value: 'Plausible', label: 'Plausible' },
  { value: 'Snowplow', label: 'Snowplow' },
  { value: 'Kissmetrics', label: 'Kissmetrics' },
  { value: 'Hotjar', label: 'Hotjar' },
  { value: 'GA4', label: 'Google Analytics 4 (GA4)' },
  { value: 'AEP', label: 'Adobe Experience Platform (AEP)' },
  { value: 'PostHog', label: 'PostHog' },
  { value: 'FullStory', label: 'FullStory' },
  { value: 'Kafka', label: 'Kafka' },
  { value: 'Kinesis', label: 'Kinesis' },
  { value: 'CloudWatch', label: 'CloudWatch' },
  { value: 'Google Ads', label: 'Google Ads' },
  { value: 'TikTok Ads', label: 'TikTok Ads' },
  { value: 'Snap Ads', label: 'Snap Ads' },
  { value: 'Pinterest Ads', label: 'Pinterest Ads' },
  { value: 'LinkedIn Ads', label: 'LinkedIn Ads' },
  { value: 'Twitter Ads', label: 'Twitter Ads' },
  { value: 'Facebook Ads', label: 'Facebook Ads' },
  { value: 'Instagram Ads', label: 'Instagram Ads' },
  { value: 'LinkedIn Ads', label: 'LinkedIn Ads' },
  { value: 'Customer Journey Analytics', label: 'Customer Journey Analytics' }
]; 