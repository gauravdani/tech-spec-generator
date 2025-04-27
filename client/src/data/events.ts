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

export const eventsByBusinessType: Record<string, EventCategory[]> = {
  eCommerce: [
    {
      id: 'product',
      name: 'Product Interactions',
      events: [
        { id: 'product_viewed', name: 'Product Viewed', description: 'When a user views a product detail page' },
        { id: 'product_clicked', name: 'Product Clicked', description: 'When a user clicks on a product in a list' },
        { id: 'product_searched', name: 'Product Searched', description: 'When a user searches for products' },
        { id: 'product_compared', name: 'Product Compared', description: 'When a user compares products' },
        { id: 'product_wishlisted', name: 'Product Wishlisted', description: 'When a user adds a product to wishlist' }
      ]
    },
    {
      id: 'cart',
      name: 'Cart & Checkout',
      events: [
        { id: 'add_to_cart', name: 'Add to Cart', description: 'When a user adds an item to cart' },
        { id: 'remove_from_cart', name: 'Remove from Cart', description: 'When a user removes an item from cart' },
        { id: 'begin_checkout', name: 'Begin Checkout', description: 'When a user initiates checkout' },
        { id: 'add_payment_info', name: 'Add Payment Info', description: 'When a user adds payment information' },
        { id: 'purchase_complete', name: 'Purchase Complete', description: 'When a user completes a purchase' }
      ]
    }
  ],
  SaaS: [
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
  ],
  Gaming: [
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
  ],
  FinTech: [
    {
      id: 'transactions',
      name: 'Transactions',
      events: [
        { id: 'transfer_initiated', name: 'Transfer Initiated', description: 'When a user initiates a transfer' },
        { id: 'payment_completed', name: 'Payment Completed', description: 'When a payment is completed' },
        { id: 'bill_paid', name: 'Bill Paid', description: 'When a user pays a bill' }
      ]
    },
    {
      id: 'investments',
      name: 'Investments',
      events: [
        { id: 'investment_made', name: 'Investment Made', description: 'When a user makes an investment' },
        { id: 'portfolio_viewed', name: 'Portfolio Viewed', description: 'When a user views their portfolio' }
      ]
    }
  ],
  EdTech: [
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
  ],
  Healthcare: [
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
  ],
  RealEstate: [
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
  ]
}; 