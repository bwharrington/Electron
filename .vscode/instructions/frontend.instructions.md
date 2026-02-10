---
applyTo: 'frontend/harmony/**, frontend/harmony/**/*.{ts,tsx,js,jsx,less,css}, frontend/harmony/**/package.json'
---

# GitHub Copilot Instructions for Code Review

## Overview

This repository contains a large-scale React application with TypeScript. When reviewing pull requests that affect frontend code in the `frontend/harmony/**` directory, please use these instructions as your authoritative reference.

## Target Files

Focus your reviews on changes to:

-   `frontend/harmony/**/*.{ts,tsx,js,jsx,less,css}`
-   `frontend/harmony/**/package.json`
-   Any other files in the `frontend/harmony/**` directory structure

## Tech Stack Context

You are reviewing a modern React application with the following stack:

### Core Technologies

-   **React 18+** with TypeScript
-   **Redux** with custom middleware for state management
-   **Styled Components** for component-specific styling
-   **Less** for global styling and themes

### Design System

This project uses the Planview Design System with these packages:

-   `@planview/pv-uikit` - Core UI components
-   `@planview/pv-details` - Detail view components
-   `@planview/pv-editor` - Rich text editing components
-   `@planview/pv-filter` - Filtering and search components
-   `@planview/pv-form` - Form controls and validation
-   `@planview/pv-gantt` - Gantt chart components
-   `@planview/pv-grid` - Data grid components
-   `@planview/pv-icons` and `@planview/pv-icons-sprite` - Icon system
-   `@planview/pv-toolbar` - Toolbar and action components
-   `@planview/pv-utilities` - Utility functions and hooks
-   `@planview/pv-widget` - Widget and dashboard components

#### ❌ Watch out for:

-   Direct DOM manipulation in components
-   Business logic in presentation components
-   Circular dependencies between modules
-   Mixing of concerns (UI logic in reducers, etc.)

## TypeScript & Type Safety

### Type Safety Requirements

-   All function parameters and return types must be explicitly typed
-   Use `unknown` instead of `any` when type is truly unknown
-   All props properly typed with interfaces
-   Proper TypeScript patterns for conditional rendering

## React Components

### Component Structure

Components should follow a consistent pattern with proper separation of concerns.

#### ✅ Review for:

-   **Memo Usage**: Components wrapped in `memo()` for performance
-   **Hook Dependencies**: Proper dependency arrays in `useCallback`, `useMemo`, `useEffect`
-   **Event Handlers**: Use `useCallback` for event handlers
-   **Conditional Rendering**: Use proper TypeScript patterns

#### ❌ Watch out for:

-   Missing `memo()` on pure components
-   Incorrect hook dependencies
-   Inline functions in JSX (performance issue)
-   Direct mutation of props or state
-   Missing key props in lists

## Redux State Management

### Actions & Reducers

Components should connect to Redux using proper selectors and typed dispatch.

#### ✅ Review for:

-   Reducers are pure functions with proper typing
-   Actions follow established naming conventions
-   Proper error handling actions

### Middleware

Custom middleware should follow the established patterns.

#### ✅ Review for:

-   Proper typing of middleware functions
-   Side effects handled in middleware, not reducers
-   Error handling and logging
-   Navigation logic contained in navigation middleware

## Styling & Design System

#### ✅ Review for:

-   Use styled-components for component-specific styles
-   Design system tokens used instead of hardcoded values
-   Responsive design patterns
-   Accessibility considerations (focus states, contrast)

#### ❌ Watch out for:

-   Hardcoded colors (should use design system tokens)
-   Hardcoded px values (should use design system tokens)
-   Magic numbers without comments
-   Overly specific selectors
-   Missing responsive breakpoints

## Performance Considerations

#### ✅ Review for:

-   `memo()` usage on pure components
-   `useCallback` for event handlers
-   `useMemo` for expensive computations
-   Proper key props on list items
-   Lazy loading of heavy components
-   Normalized state structure
-   Avoiding unnecessary re-renders
-   Batched actions where appropriate

## Code Quality Standards

### Function Guidelines

#### ✅ Review for:

-   Functions should be small and focused (< 20 lines ideally)
-   Pure functions where possible
-   Descriptive function names
-   Proper error handling

### Variable Naming

#### ✅ Review for:

-   Descriptive variable names
-   Consistent naming conventions (camelCase)
-   Boolean variables prefixed with `is`, `has`, `should`
-   Constants in UPPER_CASE

### Comments and Documentation

#### ✅ Review for:

-   JSDoc comments for complex functions
-   Inline comments for business logic
-   TODO comments with tickets/issues
-   Type annotations serving as documentation

## Testing Requirements

### Component Testing

New components should include:

-   Unit tests for component logic
-   Playwright tests

### File Naming

#### ✅ Review for:

-   PascalCase for component files
-   camelCase for utility files
-   lowercase with hyphens for style files

## Common Issues & Anti-patterns

### ❌ Common Issues to Flag:

1. **Direct State Mutation**

```tsx
// Bad
state.items.push(newItem)

// Good
return { ...state, items: [...state.items, newItem] }
```

2. **Missing Error Boundaries**

```tsx
// Bad: Component without error handling
const UserProfile = ({ userId }: { userId: string }) => {
    const userData = fetchUserData(userId) // Could throw error
    return <div>{userData.name}</div>
}

// Good: Wrap components with error boundaries
const UserProfileWithErrorBoundary = ({ userId }: { userId: string }) => {
    return (
        <ErrorBoundary fallback={<div>Failed to load user profile</div>}>
            <UserProfile userId={userId} />
        </ErrorBoundary>
    )
}

// Good: Component with internal error handling
const UserProfile = ({ userId }: { userId: string }) => {
    const [userData, setUserData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchUserData(userId).then(setUserData).catch(setError)
    }, [userId])

    if (error) return <ErrorMessage error={error} />
    if (!userData) return <LoadingSpinner />

    return <div>{userData.name}</div>
}
```

3. **Inline Styles**

```tsx
// Bad
<div style={{ color: 'red', fontSize: '14px' }}>

// Good
const StyledDiv = styled.div`
  color: ${colors.error};
  font-size: ${fonts.small};
`
```

4. **Prop Drilling**

```tsx
// Bad: Passing props through multiple component levels
const App = () => {
    const [user, setUser] = useState(null)
    return <Dashboard user={user} onUserUpdate={setUser} />
}

const Dashboard = ({ user, onUserUpdate }: DashboardProps) => {
    return <Sidebar user={user} onUserUpdate={onUserUpdate} />
}

const Sidebar = ({ user, onUserUpdate }: SidebarProps) => {
    return <UserWidget user={user} onUserUpdate={onUserUpdate} />
}

const UserWidget = ({ user, onUserUpdate }: UserWidgetProps) => {
    return <div>{user?.name}</div> // Finally using the prop!
}

// Good: Use Redux for global state
import { updateUser } from 'path/to/actions' // Ensure correct import path
import { User } from 'path/to/types' // Ensure correct import path

const newData: User = {
    // Populate with appropriate user data fields
    name: 'New User',
    // ...other fields
}

const UserWidget = () => {
    const user: User | null = useAppSelector((state) => state.user.current)
    const dispatch = useAppDispatch()

    return <div onClick={() => dispatch(updateUser(newData))}>{user?.name}</div>
}

// Good: Use Context for component subtree state
const UserContext = createContext<UserContextType>(null)

const App = () => {
    const [user, setUser] = useState(null)
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Dashboard />
        </UserContext.Provider>
    )
}

const UserWidget = () => {
    const { user, setUser } = useContext(UserContext)
    return <div>{user?.name}</div>
}
```

5. **Missing Loading States**

```tsx
// Always handle loading, error, and success states
if (loading) return <Spinner />
if (error) return <ErrorMessage error={error} />
return <MainContent data={data} />
```

## Feature Toggle Management

### Feature Toggle Patterns

Feature toggles control the rollout of new functionality and should be implemented consistently across all relevant code paths.

#### ✅ Review for:

-   **Consistent Toggle Usage**: All related functionality uses the same feature toggle
-   **Complete Coverage**: Feature toggles are applied at all appropriate entry points
-   **Proper Fallback**: Legacy/default behavior is maintained when feature is disabled
-   **Clean Implementation**: Toggle checks don't create confusing conditional logic

#### Feature Toggle Types to Check:

1. **Feature Flags**: `state.hasFeature('<feature_name>')`

    - New functionality rollouts
    - A/B testing features
    - Experimental components

2. **Customer Features**: `state.get('customer_<feature_name>')`

    - Customer-specific functionality
    - Premium features
    - Customer configuration flags

3. **Mode Checks**: `state.get('<mode_name>')`
    - Template mode: `state.get('templateMode')`
    - Display modes and user preferences

#### ❌ Common Issues to Flag:

```tsx
// Bad: Missing feature toggle on related functionality
const handleNewFeature = () => {
    // New feature logic but no toggle check
    return newFeatureImplementation()
}

// Bad: Inconsistent toggle usage
{
    state.hasFeature('new_feature') && <ComponentA />
}
// ... elsewhere in code without toggle
;<ComponentB /> // Should also be behind same toggle if related

// Bad: Toggle check but no fallback behavior
{
    state.hasFeature('new_feature') && <NewComponent />
}
// Missing: What happens when feature is disabled?

// Bad: Complex nested toggle logic
{
    state.hasFeature('feature_a') ? (
        state.get('customer_premium') ? (
            <PremiumComponent />
        ) : state.hasFeature('feature_b') ? (
            <AlternativeComponent />
        ) : null
    ) : (
        <DefaultComponent />
    )
}
```

#### Review Questions for Feature Toggles:

1. **Coverage**: Are all related UI elements, API calls, and logic behind the same toggle?
2. **Consistency**: Is the feature toggle used consistently across all affected components?
3. **Fallback**: What happens when the feature is disabled? Is the user experience still functional?
4. **Performance**: Are toggle checks optimized to prevent unnecessary re-renders?
5. **Testing**: How would you test both enabled and disabled states of the feature?
6. **Cleanup**: Is there a plan to remove the toggle once the feature is fully rolled out?

## Review Checklist

### Before Approving a PR, Ensure:

#### Code Quality

-   [ ] TypeScript types are complete and accurate
-   [ ] No use of `any` type without justification
-   [ ] Functions are properly typed with return types
-   [ ] Error handling is implemented
-   [ ] Code follows established patterns

#### React & Performance

-   [ ] Components use `memo()` where appropriate
-   [ ] Hook dependencies are correct
-   [ ] Event handlers use `useCallback`
-   [ ] Expensive computations use `useMemo`
-   [ ] Props are properly typed with interfaces
-   [ ] No unnecessary re-renders
-   [ ] Large components are lazy-loaded
-   [ ] List items have proper keys
-   [ ] Images have proper loading attributes

#### Redux Integration

-   [ ] Reducers are pure functions
-   [ ] Side effects are handled in middleware

#### Styling

-   [ ] Styles follow the established patterns
-   [ ] Design system tokens are used
-   [ ] Responsive design is considered
-   [ ] Accessibility requirements are met

#### Security

-   [ ] User input is properly sanitized
-   [ ] No direct HTML injection
-   [ ] Proper authentication checks

#### Feature Toggles

-   [ ] Feature toggles are consistent across all related functionality
-   [ ] Proper fallback behavior when features are disabled
-   [ ] Toggle checks use correct patterns (`state.hasFeature()`, `state.get()`)
-   [ ] No missing feature checks on new functionality
-   [ ] Feature toggle logic is clean and understandable

#### Documentation

-   [ ] Complex logic has comments
-   [ ] Public APIs have JSDoc comments
-   [ ] README updates if needed

### Questions to Ask During Review

1. **Architecture**: Does this change fit the established patterns?
2. **Performance**: Could this cause performance issues?
3. **Maintainability**: Will this be easy to modify in the future?
4. **Testing**: How would you test this functionality?
5. **Edge Cases**: What happens when this fails?
6. **Accessibility**: Is this accessible to all users?
7. **Security**: Are there any security implications?

### Additional Resources

-   [React Best Practices](https://react.dev/learn)
-   [Redux Style Guide](https://redux.js.org/style-guide)
-   [TypeScript Handbook](https://www.typescriptlang.org/docs/)
-   [Styled Components Documentation](https://styled-components.com/docs)
-   [PVDS component Documentation](https://planview-ds.github.io/react-pvds/)

---

_This document should be updated as the codebase evolves and new patterns are established._
