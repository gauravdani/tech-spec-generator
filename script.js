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
            'Payment Info Entered',
            'Order Complete'
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
    form.addEventListener('submit', generateSpecification);

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

    // Function to generate specification
    async function generateSpecification(event) {
        event.preventDefault();
        
        try {
            console.log('🟡 CLIENT: Starting specification generation');
            
            const businessType = document.getElementById('businessType').value;
            const platformType = document.getElementById('platformType').value;
            const deviceType = document.getElementById('deviceType').value;
            const trackingTool = document.getElementById('trackingTool').value;
            
            // Get selected events
            const selectedEvents = Array.from(document.querySelectorAll('input[name="events"]:checked'))
                .map(checkbox => checkbox.value);

            // Validate inputs
            if (!businessType || !platformType || !deviceType || !trackingTool) {
                alert('Please fill in all required fields');
                return;
            }

            if (selectedEvents.length === 0) {
                alert('Please select at least one event to track');
                return;
            }

            console.log('🟡 CLIENT: Form validation passed, preparing request');
            console.log('🟡 CLIENT: Selected events:', selectedEvents);

            // Show loading indicator
            loadingIndicator.style.display = 'flex';
            outputText.textContent = '';

            // Create a container for the HTML content
            const outputContainer = document.createElement('div');
            outputContainer.className = 'spec-document';
            outputText.appendChild(outputContainer);

            console.log('🟡 CLIENT: Making fetch request to server');
            // Make a POST request with the form data
            const response = await fetch('/api/generate-spec', {
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
                })
            });

            // Check if the response is ok
            if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
            }

            console.log('🟢 CLIENT: Server response received, setting up stream reader');

            // Set up a reader for the response stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';
            let chunkCount = 0;
            let textChunkCount = 0;

            // Process the stream
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    console.log('🟢 CLIENT: Stream complete');
                    break;
                }
                
                // Decode the chunk
                const chunk = decoder.decode(value, { stream: true });
                chunkCount++;
                console.log(`🟢 CLIENT: Received chunk #${chunkCount}`);
                
                // Process each line in the chunk
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6); // Remove 'data: ' prefix
                        
                        if (dataStr === '[DONE]') {
                            console.log('🟢 CLIENT: Received [DONE] signal from server');
                            break;
                        }
                        
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.text) {
                                textChunkCount++;
                                console.log(`🟢 CLIENT: Processing text chunk #${textChunkCount}: "${data.text}"`);
                                accumulatedText += data.text;
                                outputContainer.innerHTML = accumulatedText;
                            }
                        } catch (error) {
                            console.error('🔴 CLIENT: Error parsing event data:', error);
                        }
                    }
                }
            }

            console.log(`🟢 CLIENT: Stream processing complete. Received ${chunkCount} chunks, processed ${textChunkCount} text chunks`);

            // Hide loading indicator
            loadingIndicator.style.display = 'none';

        } catch (error) {
            console.error('🔴 CLIENT: Error:', error);
            loadingIndicator.style.display = 'none';
            outputText.textContent = 'Error: Failed to generate specification. Please try again.';
        }
    }
}); 