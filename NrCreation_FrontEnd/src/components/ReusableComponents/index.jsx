import Pagination from './Pagination'

// Loading States
export { default as LoadingSpinner } from './LoadingSpinner'
export { default as PageLoader } from './PageLoader'
export { default as SkeletonLoader } from './SkeletonLoader'

// UI Components
export { default as Breadcrumbs } from './Breadcrumbs'
export { default as EmptyState } from './EmptyState'
export { default as ErrorBoundary } from './ErrorBoundary'
export { default as Modal } from './Modal'
export { default as Toast } from './Toast'
export { Pagination }

/*
Component Descriptions:

1. Loading States:
   - LoadingSpinner: Small spinner for buttons and inline loading
   - PageLoader: Full-page loading overlay with backdrop
   - SkeletonLoader: Placeholder loading animation for content

2. UI Components:
   - Breadcrumbs: Navigation trail showing current page location
   - EmptyState: Placeholder for empty lists/search results
   - ErrorBoundary: Catches and displays errors gracefully
   - Modal: Reusable modal/dialog component
   - Toast: Notification messages (success/error/warning)

Usage Examples:
1. Page Loading:
   ```jsx
   const [isLoading, setIsLoading] = useState(true)
   
   return (
     <>
       {isLoading && <PageLoader />}
       <div className={isLoading ? 'opacity-50' : ''}>
         {content}
       </div>
     </>
   )
   ```

2. Button Loading:
   ```jsx
   <Button disabled={isLoading}>
     {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
     Submit
   </Button>
   ```

3. Content Loading:
   ```jsx
   {isLoading ? (
     <SkeletonLoader count={5} />
   ) : (
     <ProductList products={products} />
   )}
   ```

4. Empty States:
   ```jsx
   {items.length === 0 && (
     <EmptyState
       icon={ShoppingBag}
       title="No items found"
       description="Try adjusting your search"
     />
   )}
   ```

5. Error Handling:
   ```jsx
   <ErrorBoundary>
     <ComponentThatMightError />
   </ErrorBoundary>
   ```

6. Notifications:
   ```jsx
   <Toast
     type="success"
     message="Item added to cart"
     duration={3000}
   />
   ```
*/ 