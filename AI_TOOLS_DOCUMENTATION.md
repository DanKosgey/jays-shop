# AI Tools Documentation for Jay's Phone Repair Chatbot

This document provides comprehensive documentation for all the AI tools available in the Jay's Phone Repair chatbot system.

## Overview

The AI chatbot for Jay's Phone Repair is equipped with 12 specialized tools that enable it to handle a wide range of customer inquiries related to repair services, product information, shop policies, and more.

## Tool Documentation

### 1. getRepairTicketStatus
**Description**: Retrieves the current status of a repair ticket using its ticket number.
**Parameters**: 
- `ticketNumber` (string): The unique identifier for the repair ticket
**Returns**: RepairTicket object with detailed information about the ticket
**Use Cases**: 
- Checking repair progress
- Getting estimated completion dates
- Viewing current status and priority

### 2. getDetailedTicketInfo
**Description**: Provides comprehensive information about a repair ticket including customer details, device information, and status history.
**Parameters**: 
- `ticketNumber` (string): The unique identifier for the repair ticket
**Returns**: Object containing ticket details and status history
**Use Cases**: 
- Getting complete repair history
- Viewing detailed device information
- Understanding service notes and updates

### 3. getProductInfo
**Description**: Retrieves detailed information about a specific product by name.
**Parameters**: 
- `productName` (string): The name of the product to look up
**Returns**: Product object with pricing, description, and availability
**Use Cases**: 
- Checking product specifications
- Getting pricing information
- Verifying product availability

### 4. searchProducts
**Description**: Searches for products by name, description, or category.
**Parameters**: 
- `query` (string): Search query string
- `limit` (number, optional): Maximum number of results (default: 10)
**Returns**: Array of Product objects matching the search criteria
**Use Cases**: 
- Finding specific products
- Browsing product categories
- Searching for accessories or parts

### 5. getAllProducts
**Description**: Retrieves a list of all available products in the store with their prices and stock information.
**Parameters**: 
- `limit` (number, optional): Maximum number of products to return (default: 10)
- `category` (string, optional): Filter products by category
**Returns**: Array of Product objects
**Use Cases**: 
- Browsing all available products
- Getting inventory overview
- Category-specific product listings

### 6. getProductCategories
**Description**: Retrieves all available product categories in the store.
**Parameters**: None
**Returns**: Array of category names (strings)
**Use Cases**: 
- Understanding product organization
- Browsing by category
- Providing category navigation options

### 7. getShopPricingInfo
**Description**: Provides comprehensive pricing information for all products and services.
**Parameters**: 
- `productCategory` (string, optional): Filter by product category
- `serviceName` (string, optional): Filter by service name
**Returns**: Object containing products array and services array with pricing details
**Use Cases**: 
- Getting complete pricing information
- Comparing service costs
- Viewing product and service bundles

### 8. getInventoryInfo
**Description**: Retrieves comprehensive inventory information including stock levels and availability.
**Parameters**: 
- `lowStockThreshold` (number, optional): Threshold for low stock items (default: 5)
- `category` (string, optional): Filter by product category
**Returns**: Object with inventory statistics including low stock and out of stock items
**Use Cases**: 
- Checking stock levels
- Identifying low inventory items
- Getting overall inventory status

### 9. getShopPolicy
**Description**: Provides information about shop policies like warranty, returns, etc.
**Parameters**: 
- `topic` (string): The policy topic (e.g., "warranty", "return policy", "privacy")
**Returns**: String with policy information
**Use Cases**: 
- Answering policy questions
- Providing warranty details
- Explaining return procedures

### 10. getRepairCostEstimate
**Description**: Provides estimated costs for common repair services.
**Parameters**: 
- `deviceModel` (string): e.g., "iPhone 13", "Samsung Galaxy S22"
- `repairType` (string): e.g., "screen replacement", "battery replacement", "charging port repair"
**Returns**: String with cost estimate and additional information
**Use Cases**: 
- Providing repair pricing estimates
- Comparing repair costs
- Helping customers budget for services

### 11. troubleshootIssue
**Description**: Offers basic troubleshooting steps for common phone issues.
**Parameters**: 
- `issue` (string): The problem the user is facing, e.g., "phone not charging", "running slow"
**Returns**: String with troubleshooting steps
**Use Cases**: 
- Helping customers with minor issues
- Providing immediate assistance
- Reducing unnecessary repair visits

### 12. bookAppointment
**Description**: Books an appointment for a repair diagnosis.
**Parameters**: 
- `customerName` (string): Customer's name
- `date` (string): Date for the appointment (YYYY-MM-DD format)
- `time` (string): Time for the appointment (HH:MM AM/PM format)
**Returns**: String with appointment confirmation details
**Use Cases**: 
- Scheduling repair consultations
- Booking diagnostic appointments
- Managing customer visit schedules

## Integration Details

All tools are integrated with the Supabase database and use the admin client for secure data access. The tools are designed to handle errors gracefully and provide informative error messages when data is not found or when validation fails.

## Error Handling

Each tool implements robust error handling:
- Database connection errors are caught and reported
- Invalid input parameters are validated with descriptive error messages
- Missing data scenarios return appropriate error messages rather than crashing
- Rate limiting and API quota issues are handled with retry suggestions

## Testing

All tools have been tested for:
- Normal operation with valid inputs
- Error conditions with invalid inputs
- Edge cases and boundary conditions
- Graceful handling of empty or missing data
- Performance under various load conditions

## Usage Guidelines

When using these tools:
1. Always validate input parameters before calling tools
2. Handle tool errors appropriately in the chatbot flow
3. Cache results when appropriate to improve performance
4. Log tool usage for analytics and debugging
5. Respect rate limits and implement retry logic when needed