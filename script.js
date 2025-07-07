// IPNY Client Processor JavaScript

let processedData = '';
let emailDraftData = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Auto-focus on email field
    document.getElementById('clientEmail').focus();
    
    // Add keyboard shortcut for processing
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            processEmail();
        }
    });
});

// Format date to match Google Sheet format (7 Jul 2025)
function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Main processing function - generates sheet data and analysis only
async function processEmail() {
    const emailContent = document.getElementById('emailContent').value.trim();
    const clientEmail = document.getElementById('clientEmail').value.trim();
    const additionalInfo = document.getElementById('additionalInfo').value.trim();
    
    if (!emailContent) {
        alert('Please paste the email body content first.');
        return;
    }
    
    const outputSection = document.getElementById('outputSection');
    const outputText = document.getElementById('outputText');
    
    outputSection.classList.add('show');
    outputText.innerHTML = '<div class="loading">🔍 Analyzing email and estimating documents...</div>';
    
    // Hide email section initially
    document.getElementById('emailSection').style.display = 'none';
    document.getElementById('generateReplyBtn').style.display = 'inline-block';
    
    try {
        // First request: Generate Google Sheet data
        const prompt = createSheetDataPrompt(clientEmail, emailContent, additionalInfo);
        const response = await window.claude.complete(prompt);
        processedData = response.trim();
        outputText.textContent = processedData;
        
        // Second request: Generate detailed analysis
        const analysisPrompt = createAnalysisPrompt(clientEmail, emailContent, additionalInfo);
        const analysisResponse = await window.claude.complete(analysisPrompt);
        document.getElementById('analysisText').textContent = analysisResponse;
        
    } catch (error) {
        outputText.innerHTML = `<div class="error">❌ Error processing email: ${error.message}</div>`;
    }
}

// Generate email reply - separate function
async function generateEmailReply() {
    const emailContent = document.getElementById('emailContent').value.trim();
    const clientEmail = document.getElementById('clientEmail').value.trim();
    const additionalInfo = document.getElementById('additionalInfo').value.trim();
    
    const emailSection = document.getElementById('emailSection');
    const emailDraft = document.getElementById('emailDraft');
    
    emailSection.style.display = 'block';
    emailDraft.innerHTML = '<div class="loading">✍️ Generating email reply...</div>';
    
    try {
        const emailPrompt = createEmailDraftPrompt(clientEmail, emailContent, additionalInfo);
        const emailResponse = await window.claude.complete(emailPrompt);
        emailDraftData = emailResponse;
        emailDraft.textContent = emailResponse;
        
        // Hide the generate reply button after generating
        document.getElementById('generateReplyBtn').style.display = 'none';
        
    } catch (error) {
        emailDraft.innerHTML = `<div class="error">❌ Error generating email: ${error.message}</div>`;
    }
}

// Create prompt for Google Sheet data with exact column format
function createSheetDataPrompt(clientEmail, emailContent, additionalInfo) {
    const today = formatDate(new Date());
    
    return `Analyze this client inquiry for an Italian citizenship document service. Extract information and estimate document needs.

CLIENT EMAIL ADDRESS: ${clientEmail || 'Not provided'}

EMAIL BODY:
${emailContent}

ADDITIONAL INFORMATION: ${additionalInfo || 'None provided'}

ANALYSIS INSTRUCTIONS:
1. Extract client name from how they sign the email, introduce themselves, or any name mentioned
2. Use provided email address, or extract from signature if email field empty
3. Determine referral source using ALL information provided:
   - If mentions "Lorenzo" or "Agnoloni" anywhere = "Agnoloni"
   - If mentions being referred by someone else = use their name or "Friend"
   - If mentions finding website/googling = "Website"
   - Check additional info for referral context
   - Otherwise = "Direct inquiry"
4. Estimate US vital records needed based on ALL family info:
   - Count birth certificates (client + ancestors in citizenship line)
   - Count marriage certificates (couples in citizenship line)
   - Count death certificates (deceased individuals mentioned)
   - Count divorce documents if mentioned
   - Do NOT count Italian documents or naturalization (Lorenzo handles those)
   - Use any document estimates mentioned in additional info
   - If minimal family details provided, estimate 4-6 documents as typical

RESPOND WITH ONLY tab-separated data for Google Sheet with these EXACT 12 columns:
Status	Name	Email	Referred by	Initial inquiry	Project start	Last update	Number of docs	Potential Quote	Actual Quote	PAID	Notes

Format requirements:
- Status: New Lead
- Name: Full name as they sign their message or introduce themselves
- Email: Use provided email or extract from signature
- Referred by: Use referral source logic above
- Initial inquiry: ${today}
- Project start: (leave blank)
- Last update: ${today}
- Number of docs: Number only (your best estimate)
- Potential Quote: $X,XXX.XX (Number of docs × $130, formatted with dollar sign and decimals)
- Actual Quote: (leave blank)
- PAID: (leave blank)
- Notes: Brief summary combining inquiry details and relevant additional info (under 50 words)

Respond with ONLY the single tab-separated line, no explanations.`;
}

// Create prompt for detailed analysis
function createAnalysisPrompt(clientEmail, emailContent, additionalInfo) {
    return `Based on the same client information, provide a detailed IPNY analysis for internal use:

CLIENT EMAIL ADDRESS: ${clientEmail || 'Not provided'}

EMAIL BODY:
${emailContent}

ADDITIONAL INFORMATION: ${additionalInfo || 'None provided'}

Provide a comprehensive analysis including:

1. CLIENT OVERVIEW:
   - Full name and contact info
   - How they found us / referral source
   - Urgency level or timeline mentioned

2. CITIZENSHIP LINE ANALYSIS:
   - Which ancestor's line they're claiming through
   - Key individuals in the citizenship chain
   - Any potential issues or gaps identified

3. DOCUMENT REQUIREMENTS:
   - List each specific document needed
   - Which offices/states will be contacted
   - Estimated complexity and timeline
   - Any documents they already possess

4. POTENTIAL CHALLENGES:
   - Missing information that needs clarification
   - Difficult jurisdictions or office requirements
   - Timing concerns or rush requests

5. NEXT STEPS:
   - What information to request from client
   - Whether Lorenzo consultation is needed
   - Recommended approach for this case

Format this as a clear, organized analysis for your internal review.`;
}

// Create prompt for email draft
function createEmailDraftPrompt(clientEmail, emailContent, additionalInfo) {
    return `Based on the same client information, create a draft email reply following the IPNY SOP format:

CLIENT EMAIL ADDRESS: ${clientEmail || 'Not provided'}

EMAIL BODY:
${emailContent}

ADDITIONAL INFORMATION: ${additionalInfo || 'None provided'}

Create a professional email response that:

1. Uses the client's first name (extract from how they signed the email)
2. Thanks Lorenzo for referral if applicable, or acknowledges their inquiry
3. Briefly explains your service scope (collecting and legalizing US documents for Italian citizenship)
4. Mentions typical complexity (different forms, fees, tracking through mail)
5. DO NOT mention specific pricing or rates - just that you'll provide a quote once you have their info
6. Asks specific clarifying questions organized by generation to complete their document list
7. Maintains the professional yet personal tone from your SOP templates
8. Ends with your standard signature block

Structure the questions based on what information is missing from their inquiry. If they provided detailed family info, ask fewer questions. If they were vague, ask more comprehensive questions following your SOP format of organizing by generation.

Use the email templates from your SOP as guidance but customize based on their specific inquiry. Include appropriate elements like:
- Introduction of service if they seem unfamiliar
- Table format if they need to provide lots of family info
- Direct questions if they just need clarification on a few points

End with something like "Once you confirm you'd like to proceed, I'll create your complete document list with pricing and timeline."

Subject line should be: "Re: Italian Citizenship Document Services"

Format as a complete email ready to send.`;
}

// Utility functions
function openGoogleSheet() {
    window.open('https://docs.google.com/spreadsheets/d/1PGQWAvHBVX94P2MMSd0k6px4C7El2VdsBzjKzbNthC0/edit?gid=411815426#gid=411815426', '_blank');
}

function copyToClipboard() {
    if (!processedData) {
        alert('No data to copy. Please process a client first.');
        return;
    }
    
    navigator.clipboard.writeText(processedData).then(() => {
        const btn = document.querySelector('[onclick="copyToClipboard()"]');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('Failed to copy to clipboard. Please select and copy the text manually.');
    });
}

function copyEmailDraft() {
    if (!emailDraftData) {
        alert('No email draft to copy. Please generate the email reply first.');
        return;
    }
    
    navigator.clipboard.writeText(emailDraftData).then(() => {
        const btn = document.querySelector('[onclick="copyEmailDraft()"]');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('Failed to copy email draft. Please select and copy the text manually.');
    });
}

function clearForm() {
    document.getElementById('emailContent').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('additionalInfo').value = '';
    document.getElementById('outputSection').classList.remove('show');
    document.getElementById('emailSection').style.display = 'none';
    document.getElementById('generateReplyBtn').style.display = 'none';
    processedData = '';
    emailDraftData = '';
    
    // Re-focus on email field
    document.getElementById('clientEmail').focus();
}
