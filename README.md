# React Native Version Update Checker - App Store & Play Store Version Detection Hook

[![npm version](https://img.shields.io/npm/v/react-native-simple-version-update.svg)](https://www.npmjs.com/package/react-native-simple-version-update)
[![npm downloads](https://img.shields.io/npm/dm/react-native-simple-version-update.svg)](https://www.npmjs.com/package/react-native-simple-version-update)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The easiest way to check for React Native app updates!** A lightweight, zero-configuration React Native hook that automatically detects if your mobile app needs to be updated by comparing the installed version with the latest version available on the **App Store (iOS)** and **Google Play Store (Android)**.

Perfect for React Native developers who need to:

- ✅ Check app version updates automatically
- ✅ Detect when users need to update their app
- ✅ Redirect users to App Store or Play Store for updates
- ✅ Compare semantic versions correctly (1.10.0 vs 1.9.0)
- ✅ Support both iOS and Android platforms
- ✅ Get TypeScript support out of the box

## 🚀 Features

- ✅ **Automatic Version Detection** - Fetches current app version from device using `react-native-device-info`
- ✅ **App Store Integration** - Gets latest iOS version from iTunes API using bundle ID
- ✅ **Play Store Integration** - Scrapes Google Play Store to find latest Android version
- ✅ **Smart Version Comparison** - Properly compares semantic versions (handles 1.10.0 vs 1.9.0 correctly)
- ✅ **Loading & Error States** - Built-in loading indicators and error handling for better UX
- ✅ **Manual Refresh** - Trigger version checks on-demand with `checkForUpdate()`
- ✅ **Store Redirect** - Automatically opens App Store or Play Store for app updates
- ✅ **TypeScript Support** - Full TypeScript definitions included
- ✅ **Zero Configuration** - Works out of the box, no setup required
- ✅ **React Native Hook** - Simple, clean API using React hooks pattern

## 📦 Installation

Install the React Native version update checker package along with its peer dependency:

### Using npm:

```bash
npm install react-native-simple-version-update react-native-device-info
```

### Using Yarn:

```bash
yarn add react-native-simple-version-update react-native-device-info
```

### Using pnpm:

```bash
pnpm add react-native-simple-version-update react-native-device-info
```

> **Note:** This package requires `react-native-device-info` as a peer dependency to get the current app version and bundle ID.

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

## 🎯 Use Cases

This React Native version update hook is perfect for:

- **Forcing App Updates** - Require users to update before using the app
- **Update Notifications** - Show update prompts when new versions are available
- **Version Monitoring** - Track which app versions users are running
- **Critical Updates** - Force updates for security patches or breaking changes
- **App Store Compliance** - Ensure users are on supported app versions

## 💻 Usage

### Basic JavaScript Example

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

## 🔧 How It Works

The `useVersionUpdate` hook performs the following steps:

1. **Version Detection**: Uses `react-native-device-info` to get the current installed app version from the device
2. **Store Lookup**:
   - **iOS**: Queries the iTunes App Store API (`itunes.apple.com/lookup`) using the app's bundle ID
   - **Android**: Scrapes the Google Play Store page using multiple regex patterns for maximum reliability
3. **Version Comparison**: Implements proper semantic versioning comparison algorithm (correctly handles cases like 1.10.0 > 1.9.0)
4. **Update Detection**: Compares current version vs. live version to determine if an update is needed
5. **Store Redirect**: Opens the appropriate App Store or Play Store URL when `handleUpdate()` is called

### Technical Details

- **iOS**: Uses official iTunes Search API - reliable and fast
- **Android**: Uses HTML parsing with multiple fallback patterns to handle Google Play Store layout changes
- **Version Parsing**: Normalizes version strings and compares numerically (not as strings)
- **Error Handling**: Gracefully handles network errors, missing apps, and API failures

## ⚠️ Important Notes

- **Automatic Check**: The hook automatically checks for updates when the component mounts
- **Semantic Versioning**: Version comparison follows semantic versioning (semver) rules
- **Network Required**: Network requests are required to fetch store versions - will fail if device is offline
- **Android Parsing**: Android version detection uses HTML parsing - may need updates if Google changes Play Store structure
- **Bundle ID**: Make sure your app's bundle ID matches the one published on App Store/Play Store
- **Rate Limiting**: Be mindful of API rate limits when checking versions frequently

## 🔍 Common Questions (FAQ)

### How do I check for updates manually?

Use the `checkForUpdate()` function returned by the hook:

```javascript
const { checkForUpdate } = useVersionUpdate();

// Later in your code
await checkForUpdate();
```

### Does this work with Expo?

Yes! This package works with Expo managed workflow, but you'll need to install `react-native-device-info` which may require a custom development build for some features.

### Can I customize the update modal?

Absolutely! The hook only provides the data - you have full control over the UI. Check the examples above for custom modal implementations.

### What if the store API is down?

The hook will set the `error` state, and you can handle it gracefully in your UI. The `isLoading` state will be set to `false`.

### Does this work with TestFlight or internal testing?

Yes, but the version must be published to the public App Store or Play Store for the API to return it.

### Can I force users to update?

Yes! You can check `needUpdate` and prevent app usage until they update:

```javascript
if (needUpdate) {
  // Show blocking modal, disable app features, etc.
}
```

## 🆚 Alternatives & Comparison

| Feature             | react-native-simple-version-update | react-native-version-check | react-native-update-apk |
| ------------------- | ---------------------------------- | -------------------------- | ----------------------- |
| iOS Support         | ✅                                 | ✅                         | ❌                      |
| Android Support     | ✅                                 | ✅                         | ✅                      |
| Zero Config         | ✅                                 | ❌                         | ❌                      |
| TypeScript          | ✅                                 | ❌                         | ❌                      |
| Semantic Versioning | ✅                                 | ⚠️                         | ⚠️                      |
| Loading States      | ✅                                 | ❌                         | ❌                      |
| Error Handling      | ✅                                 | ⚠️                         | ⚠️                      |

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to this React Native version update package:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development

```bash
# Clone the repository
git clone https://github.com/tyfonas1/react-native-simple-version-update.git

# Install dependencies
npm install

# Build the package
npm run build
```

## Contributing

Contributions are welcome! If you'd like to contribute to this package:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Avraam Gkoutzeloudis**

- GitHub: [@tyfonas1](https://github.com/tyfonas1)
- Package: [npmjs.com/package/react-native-simple-version-update](https://www.npmjs.com/package/react-native-simple-version-update)

## ⭐ Show Your Support

If this package helped you, please give it a ⭐ on GitHub and share it with other React Native developers!

## 🔗 Related Packages

- [react-native-device-info](https://github.com/react-native-device-info/react-native-device-info) - Device information for React Native
- [react-native](https://reactnative.dev/) - React Native framework
- [semver](https://semver.org/) - Semantic Versioning specification

---

**Keywords:** react native version check, react native app update, react native version comparison, app store version check, play store version check, react native hook, version update hook, semantic versioning react native, force app update react native, check app version react native
