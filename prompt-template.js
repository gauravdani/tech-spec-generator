/**
 * Analytics Technical Specification Generator - Prompt Template
 * 
 * This file contains the template for generating analytics specifications.
 * Refine this template over time to ensure consistent, high-quality output.
 */

const generatePrompt = (businessType, platformType, deviceType, trackingTool, selectedEvents) => {
  return `As a data engineer, generate a detailed, privacy-compliant event tracking specification document to be used by frontend/mobile engineers and product managers. The tracking is to be implemented using ${trackingTool}.

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

Write the detailed document in a clear, professional tone — understandable by engineers and product managers alike. Prioritize clarity, structure, and practical implementation.

Format the output as a Word-like document with proper headings, sections, and formatting. Do not use markdown syntax.`;
};

module.exports = { generatePrompt }; 