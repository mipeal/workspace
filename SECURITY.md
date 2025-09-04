# Security Policy

## Overview

This CTF Scoreboard Dashboard is designed with security and privacy as core principles. This document outlines our security practices, data handling policies, and procedures for reporting security vulnerabilities.

## Security Architecture

### Client-Side Security

#### Data Storage
- **Local Storage Only**: Configuration data (CTFd URL and API token) is stored exclusively in the browser's `localStorage`
- **No Server-Side Storage**: We do not store, log, or persist any user credentials or CTFd data on our servers
- **Session-Based**: All data exists only during your browser session and is cleared when you close the application

#### API Token Handling
- **Client-Side Only**: API tokens never leave your browser environment
- **Direct Proxy**: Tokens are only transmitted through our secure proxy to your specified CTFd instance
- **No Logging**: API tokens are never logged, cached, or stored in server logs
- **Secure Transmission**: All API communications use HTTPS encryption

### Server-Side Security

#### API Proxy Design
- **Stateless Proxy**: Our `/api/ctfd` endpoint acts as a simple proxy without storing any data
- **Input Validation**: All incoming requests are validated for required parameters
- **Rate Limiting Protection**: Built-in exponential backoff to respect CTFd rate limits
- **Error Handling**: Sanitized error responses that don't expose sensitive information

#### Request Security
- **POST-Only**: API endpoint only accepts POST requests to prevent CSRF attacks
- **CORS Protection**: Configured to only accept requests from the application domain
- **No Caching**: API responses are explicitly marked as non-cacheable
- **Token Isolation**: Each request is isolated and tokens are not shared between sessions

## Data Handling Practices

### What Data We Access
The application only accesses publicly available CTF data through the CTFd API:
- **Scoreboard Information**: User rankings, scores, and solve counts
- **Challenge Data**: Challenge names, descriptions, categories, and solve statistics
- **Submission Data**: Public submission logs and timestamps
- **Competition Metadata**: CTF name, start/end times, and general configuration

### What Data We Do NOT Access
- **User Passwords**: Never accessed or transmitted
- **Private User Information**: Email addresses, personal details, or private user data
- **Challenge Flags**: Actual challenge solutions or flag values
- **Admin Data**: Administrative functions or sensitive CTFd configuration
- **Team Internal Data**: Private team communications or internal team data

### Data Processing
- **Real-Time Only**: Data is processed in real-time for display purposes only
- **No Analytics**: We do not collect analytics, telemetry, or user behavior data
- **No Third-Party Services**: Data is not shared with any external services or APIs
- **Temporary Processing**: Data exists only during active browser sessions

## Privacy Protection

### User Privacy
- **Anonymous Usage**: No user identification or tracking mechanisms
- **No Cookies**: Application does not use cookies for tracking or storage
- **Local Configuration**: All user preferences stored locally in browser
- **No Registration**: No account creation or user registration required

### CTFd Instance Privacy
- **Isolated Connections**: Each user connects only to their specified CTFd instance
- **No Cross-Instance Data**: Data from different CTFd instances is never mixed or shared
- **Respect Rate Limits**: Intelligent rate limiting to avoid overwhelming CTFd servers
- **Clean Requests**: All API requests are properly formatted and authenticated

## Security Best Practices

### For Users
1. **Use HTTPS**: Always access CTFd instances over HTTPS
2. **Secure Tokens**: Generate API tokens with minimal required permissions
3. **Token Rotation**: Regularly rotate API tokens as per your organization's policy
4. **Browser Security**: Keep your browser updated and use secure browsing practices

### For CTFd Administrators
1. **API Permissions**: Create dedicated API tokens with read-only permissions for scoreboard access
2. **Rate Limiting**: Configure appropriate rate limits on your CTFd instance
3. **CORS Configuration**: Configure CORS settings if needed for your deployment
4. **Monitor Usage**: Monitor API usage for any unusual patterns

## Deployment Security

### Self-Hosting Recommendations
- **HTTPS Only**: Deploy with valid SSL certificates
- **Environment Variables**: Use environment variables for any sensitive configuration
- **Regular Updates**: Keep dependencies updated to patch security vulnerabilities
- **Access Controls**: Implement appropriate network security controls

### Third-Party Hosting
- **Reputable Platforms**: Use trusted hosting platforms (Vercel, Netlify, etc.)
- **Environment Security**: Ensure hosting platform follows security best practices
- **Domain Security**: Use custom domains with appropriate DNS security measures

## Vulnerability Reporting

### Reporting Process
If you discover a security vulnerability, please report it responsibly:

1. **Do Not** create public GitHub issues for security vulnerabilities
2. **Include**: 
   - Detailed description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Suggested remediation if available

### Response Timeline
- **Acknowledgment**: Within 48 hours of report
- **Initial Assessment**: Within 1 week
- **Resolution**: Security patches released as soon as possible
- **Disclosure**: Coordinated disclosure after patch availability

## Compliance and Standards

### Security Standards
- **OWASP Guidelines**: Application follows OWASP security best practices
- **Secure Development**: Code follows secure coding practices
- **Dependency Management**: Regular security audits of dependencies
- **Minimal Attack Surface**: Reduced functionality to minimize potential vulnerabilities

### Data Protection
- **No Personal Data**: Application avoids processing personal data where possible
- **Data Minimization**: Only accesses necessary data for functionality
- **Purpose Limitation**: Data used only for intended scoreboard display purposes
- **Retention Limits**: No long-term data retention

## Contact Information

For security-related questions or concerns:
- **General Questions**: Create an issue on the GitHub repository
- **Documentation**: Refer to this security policy and README.md

## Updates to This Policy

This security policy may be updated to reflect changes in our security practices or to address new security considerations. Users will be notified of significant changes through:
- Updates to this document in the repository
- Release notes for security-related updates
- Communication through appropriate channels for critical security updates

---

**Last Updated**: September 4, 2025
**Version**: 1.0
