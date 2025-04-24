// Event categories by business type
const eventCategories = {
    eCommerce: {
        'User Actions': [
            'User Registration',
            'User Login',
            'Password Reset',
            'Profile Update'
        ],
        'Shopping': [
            'Product View',
            'Add to Cart',
            'Remove from Cart',
            'Checkout Start',
            'Checkout Complete',
            'Payment Info Entered'
        ],
        'Product Interaction': [
            'Product Search',
            'Product Filter',
            'Product Sort',
            'Wishlist Add',
            'Product Review'
        ]
    },
    OTT: {
        'User Actions': [
            'User Registration',
            'User Login',
            'Profile Update'
        ],
        'Content Interaction': [
            'Content View',
            'Content Search',
            'Content Filter',
            'Playback Start',
            'Playback Pause',
            'Playback Resume',
            'Playback Complete'
        ],
        'Subscription': [
            'Subscription Start',
            'Subscription Cancel',
            'Payment Info Update'
        ]
    },
    SaaS: {
        'User Actions': [
            'User Registration',
            'User Login',
            'Password Reset',
            'Profile Update'
        ],
        'Feature Usage': [
            'Feature View',
            'Feature Action',
            'Feature Complete',
            'Feature Error'
        ],
        'Subscription': [
            'Subscription Start',
            'Subscription Cancel',
            'Plan Change',
            'Payment Info Update'
        ]
    },
    EdTech: {
        'User Actions': [
            'User Registration',
            'User Login',
            'Profile Update'
        ],
        'Learning': [
            'Course View',
            'Lesson Start',
            'Lesson Complete',
            'Quiz Start',
            'Quiz Complete',
            'Assignment Submit'
        ],
        'Progress': [
            'Progress Update',
            'Achievement Unlock',
            'Certificate Earn'
        ]
    },
    Fintech: {
        'User Actions': [
            'User Registration',
            'User Login',
            'Profile Update'
        ],
        'Transactions': [
            'Transaction Start',
            'Transaction Complete',
            'Transaction Failed'
        ],
        'Account': [
            'Account View',
            'Balance Check',
            'Transfer Initiate',
            'Transfer Complete'
        ]
    },
    Gaming: {
        'User Actions': [
            'User Registration',
            'User Login',
            'Profile Update'
        ],
        'Gameplay': [
            'Game Start',
            'Level Start',
            'Level Complete',
            'Achievement Unlock'
        ],
        'Social': [
            'Friend Add',
            'Friend Remove',
            'Chat Message',
            'Group Join'
        ]
    }
};

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('specForm');
    const businessTypeSelect = document.getElementById('businessType');
    const eventCategoriesContainer = document.getElementById('eventCategories');
    const promptText = document.getElementById('promptText');
    const outputText = document.getElementById('outputText');
    const copyButton = document.getElementById('copyButton');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating specification...';
    loadingIndicator.style.display = 'none';
    document.querySelector('.output-container').prepend(loadingIndicator);

    // Update event categories when business type changes
    businessTypeSelect.addEventListener('change', () => {
        const selectedBusinessType = businessTypeSelect.value;
        updateEventCategories(selectedBusinessType);
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        generatePrompt();
    });

    // Handle copy button click
    copyButton.addEventListener('click', () => {
        const output = outputText.textContent;
        navigator.clipboard.writeText(output).then(() => {
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
            }, 2000);
        });
    });

    // Function to update event categories based on business type
    function updateEventCategories(businessType) {
        eventCategoriesContainer.innerHTML = '';
        
        if (!businessType) return;

        const categories = eventCategories[businessType];
        
        Object.entries(categories).forEach(([category, events]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'event-category';
            
            const categoryLabel = document.createElement('label');
            categoryLabel.textContent = category;
            categoryDiv.appendChild(categoryLabel);

            events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event-checkbox';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = event;
                checkbox.name = 'events';
                checkbox.value = event;
                
                const label = document.createElement('label');
                label.htmlFor = event;
                label.textContent = event;
                
                eventDiv.appendChild(checkbox);
                eventDiv.appendChild(label);
                categoryDiv.appendChild(eventDiv);
            });

            eventCategoriesContainer.appendChild(categoryDiv);
        });
    }

    // Function to generate the prompt
    function generatePrompt() {
        const businessType = document.getElementById('businessType').value;
        const platformType = document.getElementById('platformType').value;
        const deviceType = document.getElementById('deviceType').value;
        const trackingTool = document.getElementById('trackingTool').value;
        
        const selectedEvents = Array.from(document.querySelectorAll('input[name="events"]:checked'))
            .map(checkbox => checkbox.value);

        const prompt = `As a data engineer, generate a detailed, privacy-compliant event tracking specification document to be used by frontend/mobile engineers and product managers. The tracking is to be implemented using ${trackingTool}.

The specification should be customized for a ${businessType} business running on ${platformType} for ${deviceType}.

🧩 Include only the following events based on user selection from a list of event categories or individual event names:

${selectedEvents.join(', ')}

For each selected event, include the following:

📌 Event Name

📝 Clear description of what it captures

📊 Event properties — required and optional (with example values)

💻 Frontend implementation snippet — in JavaScript (for web) or relevant SDK for other platforms

⚙️ Trigger instruction — when, where, and under what conditions the event should be triggered

Organize the document so that each event and its code snippet appear together (side by side or one after the other).

Additional specifications:

🧑‍💻 User identity: Clarify how to handle anonymous, guest, and registered users

🔐 Consent & privacy: Events should only fire if the user has opted-in per GDPR/CCPA; include conditional tracking logic

🧪 Testing guide: Describe how to test and validate event capture using tools like Segment Debugger, browser console, or SDK logs

📈 PM usage section: Describe how product managers can analyze this data for funnels, user segmentation, or conversion

📚 Provide references: Link to SDK documentation, JS libraries, CDN links, and other relevant technical sources

Write the document in a clear, professional tone — understandable by engineers and product managers alike. Prioritize clarity, structure, and practical implementation.`;

        promptText.textContent = prompt;

        // Call the API to generate the specification
        callClaudeAPI(prompt);
    }

    // Function to call Claude API
    async function callClaudeAPI(prompt) {
        try {
            // Show loading indicator
            loadingIndicator.style.display = 'block';
            outputText.textContent = '';
            
            // API endpoint - this points to our local server
            const apiUrl = '/api/generate-spec';
            
            // Make the API call
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });
            
            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Display the response
            outputText.textContent = data.specification;
            
        } catch (error) {
            console.error('Error calling Claude API:', error);
            outputText.textContent = `Error generating specification: ${error.message}. Please try again later.`;
            
            // Fallback to mock response if API call fails
            simulateAPIResponse(prompt);
        } finally {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
        }
    }

    // Fallback function for when API is not available (for demo purposes)
    function simulateAPIResponse(prompt) {
        // This is a mock response - in a real implementation, this would be an API call
        const mockResponse = `# Event Tracking Specification

## Overview
This document outlines the tracking implementation for ${businessType} platform on ${deviceType} devices using ${trackingTool}.

## User Identity
- Anonymous users: Tracked via sessionId and deviceId
- Registered users: Tracked via userId (hashed) and sessionId

## Privacy & Compliance
- All PII data is hashed before transmission
- User consent is required for tracking
- Data retention policy: 90 days
- GDPR/CCPA compliance implemented

## Events

### User Registration
**Description:** Tracks when a user completes the registration process
**Properties:**
- userId (string, required)
- sessionId (string, required)
- deviceId (string, required)
- registrationMethod (string, optional)
- timestamp (ISO8601, required)

**Implementation:**
\`\`\`javascript
analytics.track('User Registration', {
  userId: 'user_123',
  sessionId: 'session_456',
  deviceId: 'device_789',
  registrationMethod: 'email',
  timestamp: new Date().toISOString()
});
\`\`\`

### Product View
**Description:** Tracks when a user views a product
**Properties:**
- productId (string, required)
- productName (string, required)
- productCategory (string, required)
- price (number, required)
- userId (string, optional)
- sessionId (string, required)

**Implementation:**
\`\`\`javascript
analytics.track('Product View', {
  productId: 'prod_123',
  productName: 'Premium Widget',
  productCategory: 'Electronics',
  price: 99.99,
  userId: 'user_123',
  sessionId: 'session_456'
});
\`\`\`

## Testing Guidelines
1. Use the ${trackingTool} debug mode
2. Verify events in the ${trackingTool} dashboard
3. Check property types and values
4. Validate user identification

## Documentation
- ${trackingTool} SDK Documentation: [Link]
- Implementation Guide: [Link]
- Best Practices: [Link]`;

        outputText.textContent = mockResponse;
    }
}); 