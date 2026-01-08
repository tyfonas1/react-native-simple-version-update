# Version Update Checker for React Native

A lightweight and easy-to-use custom React Native hook that checks if your app needs to be updated by comparing the installed version with the latest version available on the App Store (iOS) or Google Play Store (Android).

## Features

- ✅ Fetch the current app version installed on the device
- ✅ Get the latest version available on the App Store (iOS) or Google Play Store (Android)
- ✅ Proper semantic version comparison (handles versions like 1.10.0 vs 1.9.0 correctly)
- ✅ Loading and error states for better UX
- ✅ Manual refresh capability
- ✅ Automatic redirect to the appropriate store page for updating
- ✅ TypeScript support with full type definitions
- ✅ Zero configuration required

## Installation

Install the package and its peer dependency:

```bash
npm install react-native-simple-version-update react-native-device-info
```

Or if you're using Yarn:

```bash
yarn add react-native-simple-version-update react-native-device-info
```

### iOS Setup

For iOS, you may need to add the following to your `Info.plist` to allow network requests:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

### Android Setup

For Android, ensure you have the `INTERNET` permission in your `AndroidManifest.xml` (usually already present):

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## Usage

### Basic Example

```javascript
import React from 'react';
import { Text, View, Modal, Button, ActivityIndicator } from 'react-native';
import useVersionUpdate from 'react-native-simple-version-update';

const App = () => {
  const {
    currentVersion,
    liveVersion,
    needUpdate,
    isLoading,
    error,
    handleUpdate,
    checkForUpdate,
  } = useVersionUpdate();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Checking for updates...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Current Version: {currentVersion}</Text>
      <Text>Live Version: {liveVersion || 'Unknown'}</Text>

      {error && <Text style={{ color: 'red' }}>Error: {error.message}</Text>}

      {/* Show modal if update is needed */}
      {needUpdate && (
        <Modal transparent={true} animationType="fade" visible={needUpdate}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                minWidth: 300,
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10 }}>Update Available!</Text>
              <Text style={{ marginBottom: 20 }}>
                A new version ({liveVersion}) is available. Please update to continue.
              </Text>
              <Button title="Update Now" onPress={handleUpdate} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default App;
```

### TypeScript Example

```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import useVersionUpdate from 'react-native-simple-version-update';

const App: React.FC = () => {
  const {
    currentVersion,
    liveVersion,
    needUpdate,
    isLoading,
    error,
    handleUpdate,
    checkForUpdate,
  } = useVersionUpdate();

  return (
    <View>
      <Text>Current: {currentVersion}</Text>
      <Text>Latest: {liveVersion}</Text>
      {needUpdate && <Button title="Update" onPress={handleUpdate} />}
      <Button title="Refresh" onPress={checkForUpdate} />
    </View>
  );
};

export default App;
```

## API Reference

### `useVersionUpdate()`

Returns an object with the following properties:

| Property         | Type                  | Description                               |
| ---------------- | --------------------- | ----------------------------------------- |
| `currentVersion` | `string \| null`      | The currently installed app version       |
| `liveVersion`    | `string \| null`      | The latest version available on the store |
| `needUpdate`     | `boolean`             | Whether an update is required             |
| `isLoading`      | `boolean`             | Whether the version check is in progress  |
| `error`          | `Error \| null`       | Any error that occurred during the check  |
| `handleUpdate`   | `() => Promise<void>` | Opens the app store page for updating     |
| `checkForUpdate` | `() => Promise<void>` | Manually trigger a version check          |

## How It Works

1. **Version Detection**: Uses `react-native-device-info` to get the current app version
2. **Store Lookup**:
   - **iOS**: Queries the iTunes API using the app's bundle ID
   - **Android**: Scrapes the Google Play Store page (multiple regex patterns for reliability)
3. **Version Comparison**: Properly compares semantic versions (e.g., 1.10.0 > 1.9.0)
4. **Update Redirect**: Opens the appropriate store URL when `handleUpdate()` is called

## Notes

- The hook automatically checks for updates when the component mounts
- Version comparison uses semantic versioning rules
- Network requests may fail if the device is offline or the store is unreachable
- The Android version detection relies on parsing HTML, which may need updates if Google changes their page structure

## Contributing

Contributions are welcome! If you'd like to contribute to this package:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Author

Avraam Gkoutzeloudis
