# Windows XP Sound Effects Integration

This document describes how Windows XP sound effects have been integrated into the desktop application.

## Sound Effects Utility

Created `src/common/sounds/soundEffects.ts` which provides:

- **`playSound(sound, volume)`**: Play a sound effect with optional volume control (0-1)
- **`stopSound()`**: Stop any currently playing sound

## Sound Integrations

### 1. **Startup Sound** (`Windows XP Startup.mp3`)

- **Location**: `src/authenticated/AuthenticatedContent.tsx`
- **Trigger**: Plays when the user successfully logs in and the authenticated content loads
- **Volume**: 0.3

### 2. **Start Menu Sound** (`Windows XP Start.mp3`)

- **Location**: `src/authenticated/taskbar/StartButton.tsx`
- **Trigger**: Plays when the Start button is clicked
- **Volume**: 0.4

### 3. **Log Off Sound** (`Windows XP Logoff Sound.mp3`)

- **Location**: `src/authenticated/taskbar/StartMenu.tsx`
- **Trigger**: Plays when the user clicks "Log Off" in the Start menu
- **Volume**: 0.4

### 4. **Shutdown Sound** (`Windows XP Shutdown.mp3`)

- **Location**: `src/authenticated/taskbar/StartMenu.tsx`
- **Trigger**: Plays when the user clicks "Turn Off Computer" in the Start menu
- **Volume**: 0.4
- **Note**: Includes a 500ms delay before closing the window to allow the sound to play

### 5. **Critical Stop Sound** (`Windows XP Critical Stop.mp3`)

- **Location**: `src/common/errors/ErrorsRenderer.tsx`
- **Trigger**: Plays whenever an error dialog is shown to the user
- **Volume**: 0.4

### 6. **Balloon Notification Sound** (`Windows XP Balloon.mp3`)

- **Location**: Multiple locations
  - `src/authenticated/files/useDesktopFileUploader.ts` - Plays when file uploads complete successfully
  - `src/common/confirmation/ConfirmationDialog.tsx` - Plays when confirmation dialogs open
- **Volume**: 0.3

### 7. **Logon Sound** (`Windows XP Logon Sound.mp3`)

- **Status**: Available but not currently used
- **Note**: The Startup sound is used for login instead, which is more appropriate for the app flow

## Sound Files Location

All sound files are located in: `/public/sounds/`

## Volume Levels

Sound effects use conservative volume levels (0.3-0.4) to avoid being jarring:

- **0.3**: Used for ambient sounds (startup, balloon notifications)
- **0.4**: Used for user actions (start menu, logoff, shutdown, errors)

## Technical Notes

- Only one sound plays at a time (previous sounds are stopped when a new sound starts)
- Sounds are played asynchronously and errors are caught gracefully to avoid breaking the app
- The Audio API is used directly for maximum compatibility
- Sounds clean up their references automatically when finished playing
