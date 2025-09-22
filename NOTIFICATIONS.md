# Enhanced Notification System

## Overview

The application now uses a modern popup notification system instead of browser alerts. The notifications are visually appealing, customizable, and provide a better user experience.

## Features

- ✅ **Multiple Types**: Success, Error, Warning, Info
- ✅ **Auto-dismiss**: Notifications automatically disappear after a set duration
- ✅ **Manual Close**: Users can close notifications manually
- ✅ **Animations**: Smooth slide-in/out animations
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Positioning**: Configurable positioning (top-right, top-left, etc.)
- ✅ **Stacking**: Multiple notifications stack nicely
- ✅ **Customizable**: Duration, persistence, and styling options

## Usage

### In Nuxt Pages (Recommended)

```typescript
// Use the composable (Nuxt/Vue 3)
const { success, error, warning, info } = useNotification();

// Success notification
success("Order Placed!", "Your claim code is: ABC123");

// Error notification
error("Order Failed", "Please try again later");

// Warning notification
warning("Low Stock", "Only 2 items remaining");

// Info notification
info("New Menu", "Today's special is available!");
```

### In Regular Vue Components or Utils

```typescript
// Import the utility functions
import {
  showSuccess,
  notifyError,
  showWarning,
  showInfo,
} from "@/utils/notifications";

// Use the utility functions
showSuccess("Success!", "Operation completed successfully", { duration: 5000 });
notifyError("Error!", "Something went wrong");
showWarning("Warning!", "Please check your input");
showInfo("Info", "This is an informational message");
```

### Advanced Options

```typescript
// Custom duration (0 = never auto-close)
success("Persistent Message", "This will stay until manually closed", {
  duration: 0,
  persistent: true,
});

// Custom positioning
showSuccess("Top Left Message", "Positioned at top-left", {
  position: "top-left",
});
```

## Implementation Details

### Files Created/Modified:

1. `composables/useNotification.ts` - Main composable for Nuxt
2. `components/NotificationContainer.vue` - Vue component for rendering notifications
3. `utils/notifications.ts` - Utility functions for direct usage
4. `app.vue` - Added NotificationContainer component
5. `pages/student/cart.vue` - Updated to use new notifications
6. `src/views/student/StudentCart.vue` - Updated to use new notifications

### Components:

- **NotificationContainer**: Vue component that renders notifications
- **useNotification**: Composable providing reactive notification management
- **NotificationManager**: Class-based utility for direct DOM manipulation

### Types Supported:

- `success` - Green theme with checkmark icon
- `error` - Red theme with X icon
- `warning` - Yellow theme with warning icon
- `info` - Blue theme with info icon

## Migration from `alert()`

### Before:

```javascript
alert("Order placed! Claim code: ABC123");
```

### After:

```javascript
// Using composable (in Vue components)
const { success } = useNotification();
success("Order Placed!", "Your claim code is: ABC123");

// Using utility (anywhere)
import { showSuccess } from "@/utils/notifications";
showSuccess("Order Placed!", "Your claim code is: ABC123");
```

## Customization

The notification system can be easily customized:

- **Colors**: Modify the color classes in the components
- **Animations**: Adjust CSS transitions and transforms
- **Positioning**: Change default positioning
- **Duration**: Modify default auto-close timing
- **Icons**: Replace SVG icons with custom ones

## Browser Compatibility

- Modern browsers (ES6+ support required)
- Mobile responsive design
- Touch-friendly close buttons
- Accessibility features included
