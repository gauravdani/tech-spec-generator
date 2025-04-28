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
            if (!businessType || !platformType || !deviceType || !trackingTool || selectedEvents.length === 0) {
                alert('Please fill in all fields and select at least one event');
                return;
            }

            console.log('🟡 CLIENT: Form validation passed, preparing request');
            console.log('🟡 CLIENT: Selected events:', selectedEvents);

            // Get the output elements
            const outputSection = document.getElementById('outputSection');
            const outputText = document.getElementById('outputText');
            
            // Clear the output text and show the section
            outputText.innerHTML = '';
            outputSection.style.display = 'block';
            
            // Show loading indicator
            loadingIndicator.style.display = 'flex';
            
            console.log('🟡 CLIENT: Making fetch request to server');
            // Make a POST request with the form data
            const response = await fetch('http://localhost:3000/api/generate-spec', {
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check if the response is a stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let result = '';
            
            // Process the stream
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    console.log('🟢 CLIENT: Stream complete');
                    break;
                }
                
                // Decode the chunk
                const chunk = decoder.decode(value, { stream: true });
                console.log('🟡 CLIENT: Received chunk:', chunk);
                
                // Process each line in the chunk
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.text) {
                                result += data.text;
                                // Convert markdown to HTML
                                const htmlContent = convertMarkdownToHtml(result);
                                outputText.innerHTML = htmlContent;
                                console.log('🟢 CLIENT: Updated output with new text');
                            }
                        } catch (e) {
                            console.error('🔴 CLIENT: Error parsing JSON:', e);
                        }
                    }
                }
            }
            
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            console.log('🟢 CLIENT: Specification generation complete');
        } catch (error) {
            console.error('🔴 CLIENT: Error generating specification:', error);
            outputText.innerHTML = `<div class="error">Error generating specification: ${error.message}</div>`;
            loadingIndicator.style.display = 'none';
        }
    }

    // Function to convert markdown to HTML
    function convertMarkdownToHtml(markdown) {
        // Simple markdown conversion
        let html = markdown
            // Headers
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
            
            // Bold and italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            
            // Lists
            .replace(/^\s*\*\s(.*$)/gm, '<li>$1</li>')
            .replace(/^\s*\d+\.\s(.*$)/gm, '<li>$1</li>')
            
            // Tables
            .replace(/\|([^\n]*)\|/g, function(match) {
                const cells = match.split('|').filter(cell => cell.trim() !== '');
                return '<tr>' + cells.map(cell => `<td>${cell.trim()}</td>`).join('') + '</tr>';
            })
            
            // Paragraphs
            .replace(/\n\n/g, '</p><p>');
        
        // Wrap lists
        html = html.replace(/<li>.*?<\/li>/g, function(match) {
            return '<ul>' + match + '</ul>';
        });
        
        // Wrap tables
        html = html.replace(/<tr>.*?<\/tr>/g, function(match) {
            return '<table>' + match + '</table>';
        });
        
        // Wrap paragraphs
        html = '<p>' + html + '</p>';
        
        return html;
    }
}); 