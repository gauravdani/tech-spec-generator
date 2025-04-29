/**
 * Prompt template configuration
 * This file contains the template for generating prompts for Claude
 */

export const PROMPT_TEMPLATE = (formData: {
  businessType: string;
  platformTypes: string[];
  deviceTypes: string[];
  trackingTool: string;
  selectedEvents: string[];
}) => {
  return `As a data engineer, generate a detailed, privacy-compliant event tracking specification document to be used by frontend/mobile engineers and product managers.
it should take into account only the below CONTEXT and REQUIREMENTS and FORMAT.

CONTEXT:
- Business Type: ${formData.businessType}
- Platform Type: ${formData.platformTypes.join(', ')}
- Device Type: ${formData.deviceTypes.join(', ')}
- Tracking Tool: ${formData.trackingTool}
- Events to Track: ${formData.selectedEvents.join(', ')}

REQUIREMENTS:
1. Generate ONLY the technical specification for the above events. Title should be "Analytics Tracking Specification Document for ${formData.businessType} on ${formData.platformTypes.join(', ')} platform(s)"
2. Technical specifications should have the following sections:
   - Introduction
   - Installation Instructions
   - Implementation Guidelines (for each event)
   - User Identity Handling (with code snippets if any)
   - Consent & Privacy Safeguards  (with code snippets if any)
   - Testing Guidelines
   - Product Manager Usage Section (reporting/funnel examples)
   - Documentation Links to SDKs or tools
   - Best Practices
3. Each Implementation Guideline for each event must include:
   - Event name
   - Description
   - Required and optional properties with example values
   - Implementation code snippet
   - Trigger conditions
   - Reporting Guidelines(in summary) on how to look up the event in the reporting tool
4.User Identity Handling (anonymous vs registered)
5.Consent & Privacy Safeguards (GDPR/CCPA-compliant)
6.Testing Guidelines (how to verify events)
7.Product Manager Usage Section (reporting/funnel examples)
8.Documentation Links to SDKs or tools
9.Ensure code and explanation for each event appear together.
10.Add an introduction section to the document that explains the purpose of the document and the importance of privacy and data protection.
11. Directly begin with the document with the title followed by the introduction, "Here is the event tracking specification document in HTML format, based on the provided context and requirements" is not required.
12. After introduction, add a section with title Dependencies and list installation instructions (Where, What, How) associated with platform type, related to SDKs/JS Libraries required for the events.
13. Add a section with title mandatory properties and list all the mandatory properties, device_type(tv, mobile, desktop, console, set-top-box, etc), device_manufacturer(manufacturer of device), device_model(actual model of device), device_platform(ios, android, web, etc), user_type(anonymous, registered) as properties for all events.
14. Code snippets should be in the language from platform types, if not specified, use javascript.

FORMAT:
Return the content in clean HTML using ONLY these tags:
- <h1> through <h4> for headings
- <p> for paragraphs
- <table> with <thead> and <tbody> for properties
- <pre><code> for code snippets
- <ul> and <ol> for lists
- <blockquote> for important notes
- <a> for links
- <strong> and <em> for emphasis

IMPORTANT:
- DO NOT include any inline styles or CSS classes
- DO NOT include any markdown formatting
- DO NOT include any content outside the scope of the specified events
- DO NOT include any general information or context
- DO NOT include any previous conversation context
- Focus ONLY on the technical implementation details for the specified events`;
}; 