# Version Update Checker for React Native

A custom React Native hook to check for app version updates on the App Store (iOS) and Google Play Store (Android). It compares the currently installed app version with the live version available on the stores and provides an easy way to prompt the user to update if necessary.

## Features
- Fetch the current app version installed on the device.
- Get the latest version available on the App Store (for iOS) or Google Play Store (for Android).
- Compare versions and determine if an update is needed.
- Optionally open the update URL (App Store or Google Play Store) when an update is required.

## Installation

To install the package, follow these steps:

1. Make sure you have `react-native-device-info` installed in your project. If you haven't already, run:

   ```bash
   npm install react-native-device-info

2. Add the package to your project:
   ```bash
   npm install your-package-name
   
Or if you're using Yarn:
    ```bash
    
    yarn add your-package-name
    
Usage
1. Import the Hook
In your component file, import the useVersionUpdate hook:

    ```javascript
    
    import useVersionUpdate from 'your-package-name';

2. Use the Hook in Your Component
In your component (e.g., App.js or App.tsx), call the useVersionUpdate hook:

    ```javascript
    import React, { useEffect } from 'react';
    import { Text, View, Modal, Button } from 'react-native';
    import useVersionUpdate from 'your-package-name';
    
    const App = () => {
      const { currentVersion, liveVersion, needUpdate, handleUpdate } = useVersionUpdate();
    
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Current Version: {currentVersion}</Text>
          <Text>Live Version: {liveVersion}</Text>
    
          {/* Show modal if update is needed */}
          {needUpdate && (
            <Modal transparent={true} animationType="fade" visible={needUpdate}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                  <Text>An update is available!</Text>
                  <Button title="Update Now" onPress={handleUpdate} />
                </View>
              </View>
            </Modal>
          )}
        </View>
      );
    };
    
    export default App;

3. Customize the Modal and Update Logic
You can adjust the modal and update logic to fit the design and behavior you need for your app. The example above shows a simple modal that will pop up if an update is needed, and clicking "Update Now" will open the app's store page.

Contributing
If you'd like to contribute to this package, feel free to fork the repository, make changes, and submit a pull request.







