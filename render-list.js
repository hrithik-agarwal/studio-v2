
  /**
   * APP RENDER FLOW DOCUMENTATION
   *
   * This return statement handles the entire application rendering logic with multiple conditional paths:
   *
   * WRAPPER HIERARCHY:
   * 1. ThemeProvider - Applies FluentUI theme to entire app
   * 2. Fluent2ThemeProvider - Applies Fluent 2 design system
   * 3. React.Fragment - Groups global components + main conditional rendering
   *
   * RENDERING FLOW (based on application state):
   *
   * ┌─────────────────────────────────────────────────────────────┐
   * │ ALWAYS RENDERED (if conditions met):                        │
   * │ - HeaderBanner: Shows if isAppLoaded=true AND no errors     │
   * │ - SessionTimeout: Shows if isSessionDefaultLoaded=true      │
   * └─────────────────────────────────────────────────────────────┘
   *
   * ┌─────────────────────────────────────────────────────────────┐
   * │ MAIN CONDITIONAL RENDERING:                                 │
   * │                                                             │
   * │ IF isAppLoaded = TRUE:                                      │
   * │   ├─ IF window.isError = TRUE                               │
   * │   │   └─ Show ErrorPage                                     │
   * │   │                                                         │
   * │   ├─ ELSE IF window.isInactivePlan = TRUE                   │
   * │   │   └─ Show InactivePlan (subscription expired)           │
   * │   │                                                         │
   * │   └─ ELSE (Normal app flow)                                 │
   * │       ├─ HeaderSky (top navigation)                         │
   * │       ├─ ErrorBoundary wrapper                              │
   * │       │   ├─ SidebarSky (left sidebar)                      │
   * │       │   ├─ NotificationProvider (toast notifications)     │
   * │       │   │   ├─ Content wrapper div                        │
   * │       │   │   │   ├─ SuccessAndErrorMessage                 │
   * │       │   │   │   ├─ LakehouseErrorModal                    │
   * │       │   │   │   │                                         │
   * │       │   │   │   └─ IF window.isFullAccess = TRUE          │
   * │       │   │   │       └─ Suspense (lazy loading)            │
   * │       │   │   │           └─ Switch (React Router)          │
   * │       │   │   │               └─ All app routes             │
   * │       │   │   │                                             │
   * │       │   │   │       ELSE (limited access)                 │
   * │       │   │   │           └─ Suspense                       │
   * │       │   │   │               └─ Only BillingInfo route     │
   * │       │   │   │                                             │
   * │       │   │   └─ Footer                                     │
   * │       │   │                                                 │
   * │       └─────────────────────────────────────────────────    │
   * │                                                             │
   * │ ELSE (isAppLoaded = FALSE):                                 │
   * │   ├─ IF userAccesstoInstance = TRUE                         │
   * │   │   ├─ IF showExternalTenantCreationError = TRUE          │
   * │   │   │   └─ ErrorCard (infra setup failed)                 │
   * │   │   │                                                     │
   * │   │   ├─ ELSE IF isCheckResourceFailed = TRUE               │
   * │   │   │   └─ SkypointLogoLoader (loading spinner)           │
   * │   │   │                                                    │
   * │   │   ├─ ELSE IF isShowCreateTenant OR                    │
   * │   │   │         createOwnInfrastructure = TRUE            │
   * │   │   │   └─ InfrastructurePopUp (tenant setup)           │
   * │   │   │                                                    │
   * │   │   └─ ELSE                                             │
   * │   │       └─ SetupPage (account setup in progress)        │
   * │   │                                                        │
   * │   └─ ELSE (no instance access)                            │
   * │       └─ HeaderSky + NoAccessCard                         │
   * └─────────────────────────────────────────────────────────────┘
   *
   * KEY STATE FLAGS:
   * - isAppLoaded: Main app resources loaded and user access verified
   * - window.isError: Global error state
   * - window.isInactivePlan: Subscription/billing issue
   * - window.isFullAccess: User has full app permissions vs billing only
   * - userAccesstoInstance: User has access to current instance
   * - isCheckResourceFailed: Resource check is in progress (loading)
   * - showExternalTenantCreationError: Tenant creation failed
   * - isShowCreateTenant: Show tenant creation dialog
   */