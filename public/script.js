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
    const outputText = document.getElementById('outputText');
    const copyButton = document.getElementById('copyButton');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating specification...';
    loadingIndicator.style.display = 'none';
    document.querySelector('.output-section').prepend(loadingIndicator);

    // Update event categories when business type changes
    businessTypeSelect.addEventListener('change', () => {
        const selectedBusinessType = businessTypeSelect.value;
        updateEventCategories(selectedBusinessType);
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        generateSpecification();
    });

    // Handle copy button click
    copyButton.addEventListener('click', () => {
        const output = outputText.innerHTML;
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

    // Function to generate the specification
    function generateSpecification() {
        const businessType = document.getElementById('businessType').value;
        const platformType = document.getElementById('platformType').value;
        const deviceType = document.getElementById('deviceType').value;
        const trackingTool = document.getElementById('trackingTool').value;
        
        const selectedEvents = Array.from(document.querySelectorAll('input[name="events"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedEvents.length === 0) {
            alert('Please select at least one event to track.');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        outputText.innerHTML = '';

        // Call the API to generate the specification
        callClaudeAPI(businessType, platformType, deviceType, trackingTool, selectedEvents);
    }

    // Function to call Claude API
    async function callClaudeAPI(businessType, platformType, deviceType, trackingTool, selectedEvents) {
        try {
            // API endpoint - this points to our local server
            const apiUrl = '/api/generate-spec';
            
            // Make the API call
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    businessType, 
                    platformType, 
                    deviceType, 
                    trackingTool, 
                    selectedEvents 
                }),
            });
            
            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Display the response
            outputText.innerHTML = data.specification;
            
        } catch (error) {
            console.error('Error calling Claude API:', error);
            outputText.innerHTML = `<div class="error-message">Error generating specification: ${error.message}. Please try again later.</div>`;
            
            // Fallback to mock response if API call fails
            simulateAPIResponse(businessType, platformType, deviceType, trackingTool, selectedEvents);
        } finally {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
        }
    }

    // Fallback function for when API is not available (for demo purposes)
    function simulateAPIResponse(businessType, platformType, deviceType, trackingTool, selectedEvents) {
        // This is a mock response - in a real implementation, this would be an API call
        const mockResponse = `<div class="word-doc">
    <h1>Analytics Technical Specification</h1>
    
    <h2>1. Overview</h2>
    <p>This document outlines the tracking implementation for ${businessType} platform on ${deviceType} devices using ${trackingTool}.</p>
    
    <h2>2. User Identity</h2>
    <ul>
        <li>Anonymous users: Tracked via sessionId and deviceId</li>
        <li>Registered users: Tracked via userId (hashed) and sessionId</li>
    </ul>
    
    <h2>3. Privacy & Compliance</h2>
    <ul>
        <li>All PII data is hashed before transmission</li>
        <li>User consent is required for tracking</li>
        <li>Data retention policy: 90 days</li>
        <li>GDPR/CCPA compliance implemented</li>
    </ul>
    
    <h2>4. Events</h2>
    
    <h3>4.1 User Registration</h3>
    <p><strong>Description:</strong> Tracks when a user completes the registration process</p>
    <p><strong>Properties:</strong></p>
    <ul>
        <li>userId (string, required)</li>
        <li>sessionId (string, required)</li>
        <li>deviceId (string, required)</li>
        <li>registrationMethod (string, optional)</li>
        <li>timestamp (ISO8601, required)</li>
    </ul>
    <p><strong>Implementation:</strong></p>
    <pre><code>analytics.track('User Registration', {
  userId: 'user_123',
  sessionId: 'session_456',
  deviceId: 'device_789',
  registrationMethod: 'email',
  timestamp: new Date().toISOString()
});</code></pre>
    
    <h3>4.2 Product View</h3>
    <p><strong>Description:</strong> Tracks when a user views a product</p>
    <p><strong>Properties:</strong></p>
    <ul>
        <li>productId (string, required)</li>
        <li>productName (string, required)</li>
        <li>productCategory (string, required)</li>
        <li>price (number, required)</li>
        <li>userId (string, optional)</li>
        <li>sessionId (string, required)</li>
    </ul>
    <p><strong>Implementation:</strong></p>
    <pre><code>analytics.track('Product View', {
  productId: 'prod_123',
  productName: 'Premium Widget',
  productCategory: 'Electronics',
  price: 99.99,
  userId: 'user_123',
  sessionId: 'session_456'
});</code></pre>
    
    <h2>5. Testing Guidelines</h2>
    <ol>
        <li>Use the ${trackingTool} debug mode</li>
        <li>Verify events in the ${trackingTool} dashboard</li>
        <li>Check property types and values</li>
        <li>Validate user identification</li>
    </ol>
    
    <h2>6. Documentation</h2>
    <ul>
        <li>${trackingTool} SDK Documentation: <a href="#">Link</a></li>
        <li>Implementation Guide: <a href="#">Link</a></li>
        <li>Best Practices: <a href="#">Link</a></li>
    </ul>
</div>`;

        outputText.innerHTML = mockResponse;
    }
}); 