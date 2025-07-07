# IPNY Client Processor

An email processing tool for Italian citizenship document service client intake and management.

## Overview

This tool streamlines the process of analyzing client inquiries for Italian citizenship document services. It automatically extracts client information, estimates document requirements, and generates both Google Sheet data and professional email responses.

## Features

- **Client Information Extraction**: Automatically parses client emails to extract names, contact info, and referral sources
- **Document Estimation**: Analyzes family information to estimate required vital records
- **Google Sheets Integration**: Generates properly formatted data for client tracking spreadsheets
- **Email Draft Generation**: Creates professional email responses following IPNY SOP templates
- **Detailed Analysis**: Provides comprehensive internal analysis of each case

## Usage

1. **Input Client Information**:
   - Paste the client's email address
   - Paste the email body content
   - Add any additional information (Lorenzo's notes, phone conversation details, etc.)

2. **Process the Email**:
   - Click "Process Email & Generate Sheet Data"
   - Wait for Claude to analyze the information

3. **Use the Outputs**:
   - Copy the Google Sheet row data and paste into your tracking spreadsheet
   - Review the detailed IPNY analysis for case planning
   - Copy the draft email reply and customize as needed

## File Structure

```
ipny-client-processor/
├── index.html          # Main HTML structure
├── styles.css          # All styling and layout
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## Technical Requirements

- Modern web browser with JavaScript enabled
- Access to Claude's completion API (window.claude.complete)
- Internet connection for Google Sheets integration

## Integration

The tool integrates with:
- **Google Sheets**: Direct link to client tracking spreadsheet
- **Claude API**: For intelligent email analysis and response generation
- **IPNY SOP**: Follows established standard operating procedures

## Output Formats

### Google Sheet Data
Tab-separated values including:
- Lead Status (automatically set to "New Lead")
- Client name and email
- Referral source
- Document estimates and potential quotes
- Case notes

### IPNY Analysis
Detailed internal analysis covering:
- Client overview and urgency assessment
- Citizenship line analysis
- Document requirements breakdown
- Potential challenges identification
- Recommended next steps

### Email Draft
Professional email response including:
- Personalized greeting using client's first name
- Service scope explanation
- Clarifying questions organized by generation
- Professional signature block

## Development

This tool is built with vanilla HTML, CSS, and JavaScript for maximum compatibility and easy maintenance. The modular structure allows for easy enhancement and feature additions.

### Future Enhancement Ideas
- API integration for automated Google Sheets updates
- Email service integration for direct sending
- Document template generation
- Client portal integration
- Advanced document estimation algorithms

## Author

Created for Italian Passport NY (IPNY) document services.

## License

Private use only - not for redistribution.
