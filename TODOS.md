# Farmers Market - TODO List

This document tracks pending tasks, improvements, and features for the Farmers Market application.

## 🚀 High Priority

### Authentication & Security

- [ ] Implement email verification for new user registrations
- [ ] Add password reset functionality
- [ ] Set up proper session management and security headers
- [ ] Add rate limiting to sensitive endpoints
- [ ] Implement CSRF protection

### Core Features

- [ ] Complete vendor onboarding flow
- [ ] Add market day scheduling system
- [ ] Implement order management and fulfillment
- [ ] Add payment processing integration
- [ ] Create customer review and rating system

## 🔧 Medium Priority

### Image Upload System

- [ ] **Implement cleanup logic for orphaned image uploads**
  - [ ] Track pending uploads that haven't been confirmed
  - [ ] Add cleanup endpoint to remove orphaned files
  - [ ] Implement scheduled cleanup job (24-hour timeout)
  - [ ] Add confirmation logic when uploads are used in product creation
  - [ ] Handle cleanup for both local and cloud storage providers
  - [ ] Include proper error handling and logging
  - [ ] Make cleanup configurable via environment variables
  - [ ] Add cleanup for Cloudinary and S3 when implemented

### Product Management

- [ ] Add product inventory tracking
- [ ] Implement product search and filtering
- [ ] Add product categories and tags
- [ ] Create product variation management
- [ ] Add bulk product import/export functionality

### User Experience

- [ ] Add loading states and skeleton screens
- [ ] Implement proper error boundaries
- [ ] Add toast notifications for user feedback
- [ ] Create responsive design for mobile devices
- [ ] Add keyboard navigation support

### Performance

- [ ] Implement image optimization and lazy loading
- [ ] Add caching strategies for API responses
- [ ] Optimize database queries and add indexes
- [ ] Implement pagination for large datasets
- [ ] Add service worker for offline functionality

## 📋 Low Priority

### Analytics & Reporting

- [ ] Add vendor analytics dashboard
- [ ] Implement sales reporting
- [ ] Create customer analytics
- [ ] Add market performance metrics
- [ ] Generate automated reports

### Advanced Features

- [ ] Add real-time notifications
- [ ] Implement chat system between vendors and customers
- [ ] Create subscription management for vendors
- [ ] Add multi-language support
- [ ] Implement advanced search with filters

### Infrastructure

- [ ] Set up automated testing (unit, integration, e2e)
- [ ] Implement CI/CD pipeline
- [ ] Add monitoring and logging
- [ ] Set up backup and disaster recovery
- [ ] Configure CDN for static assets

## 🐛 Bug Fixes

### Known Issues

- [ ] Fix image upload validation edge cases
- [ ] Resolve form submission race conditions
- [ ] Fix mobile responsive layout issues
- [ ] Address database connection pooling
- [ ] Fix authentication token refresh

## 🔄 In Progress

### Current Sprint

- [x] Add ProductCategory enum to database
- [x] Implement image upload system
- [x] Create configurable upload providers
- [ ] Complete product form with variations
- [ ] Add vendor dashboard improvements

## 📝 Notes

### Technical Debt

- Consider migrating to Next.js 15 when stable
- Evaluate moving to TypeScript strict mode
- Review and update dependencies regularly
- Consider implementing GraphQL for complex queries

### Future Considerations

- Plan for scaling to multiple markets
- Consider implementing microservices architecture
- Evaluate adding real-time features with WebSockets
- Plan for international expansion

---

## How to Use This TODO List

1. **Add new tasks** by creating a new checkbox item
2. **Mark completed tasks** by checking the box
3. **Move tasks** between priority levels as needed
4. **Add details** in sub-bullets for complex tasks
5. **Update status** regularly during development

## Task Status Legend

- [ ] **Not Started** - Task hasn't been worked on
- [🔄] **In Progress** - Currently being worked on
- [x] **Completed** - Task is finished
- [⚠️] **Blocked** - Waiting on dependencies or decisions
- [🔍] **Under Review** - Needs review or testing
