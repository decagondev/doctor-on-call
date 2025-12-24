# Firebase Cloud Functions

Cloud Functions for Doctor On Call platform. These functions handle admin actions that require elevated privileges.

## Functions

### `approveDoctor`
Callable function to approve or reject a doctor account. Only admins can call this function.

**Parameters:**
- `userId` (string): The user ID of the doctor to approve/reject
- `approved` (boolean): Whether to approve (true) or reject (false) the doctor

**Returns:**
- `success` (boolean): Whether the operation succeeded
- `userId` (string): The user ID that was updated
- `approved` (boolean): The new approval status

### `banUser`
Callable function to ban or unban a user account. Only admins can call this function.

**Parameters:**
- `userId` (string): The user ID to ban/unban
- `banned` (boolean): Whether to ban (true) or unban (false) the user

**Returns:**
- `success` (boolean): Whether the operation succeeded
- `userId` (string): The user ID that was updated
- `banned` (boolean): The new banned status

## Setup

1. Install dependencies:
```bash
cd functions
npm install
```

2. Build TypeScript:
```bash
npm run build
```

## Development

Run functions locally with Firebase emulator:
```bash
npm run serve
```

## Deployment

Deploy functions to Firebase:
```bash
npm run deploy
```

Or deploy from project root:
```bash
firebase deploy --only functions
```

## Requirements

- Node.js 18+
- Firebase CLI installed globally
- Firebase project configured

