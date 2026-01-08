import { useState, useEffect, useCallback } from 'react';
import DeviceInfo from 'react-native-device-info';
import { Linking, Platform } from 'react-native';

export interface UseVersionUpdateReturn {
  currentVersion: string | null;
  liveVersion: string | null;
  needUpdate: boolean;
  isLoading: boolean;
  error: Error | null;
  handleUpdate: () => Promise<void>;
  checkForUpdate: () => Promise<void>;
}

/**
 * Custom React Native hook to check if your app needs to be updated
 * by comparing the installed version with the latest version available
 * on the App Store (iOS) or Google Play Store (Android).
 *
 * @returns {UseVersionUpdateReturn} Object containing version info, update status, and helper functions
 */
const useVersionUpdate = (): UseVersionUpdateReturn => {
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [liveVersion, setLiveVersion] = useState<string | null>(null);
  const [needUpdate, setNeedUpdate] = useState<boolean>(false);
  const [updateUrl, setUpdateUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Properly compares two semantic version strings
   * @param latestVersion - The latest version string (e.g., "1.2.3")
   * @param currentVersion - The current version string (e.g., "1.2.2")
   * @returns true if latestVersion is greater than currentVersion
   */
  const compareVersions = useCallback((latestVersion: string, currentVersion: string): boolean => {
    const normalizeVersion = (version: string): number[] => {
      return version
        .split('.')
        .map((part) => {
          // Remove any non-numeric characters (e.g., "1.2.3-beta" -> "1.2.3")
          const numPart = part.replace(/[^0-9]/g, '');
          return parseInt(numPart || '0', 10);
        })
        .concat([0, 0, 0]) // Pad with zeros
        .slice(0, 3); // Take only first 3 parts
    };

    const latest = normalizeVersion(latestVersion);
    const current = normalizeVersion(currentVersion);

    for (let i = 0; i < 3; i++) {
      if (latest[i] > current[i]) {
        return true;
      }
      if (latest[i] < current[i]) {
        return false;
      }
    }

    return false; // Versions are equal
  }, []);

  /**
   * Fetches the latest version from the appropriate app store
   */
  const getLatestStoreVersion = useCallback(async (): Promise<{
    version: string | null;
    url: string | null;
  }> => {
    try {
      const bundleId = DeviceInfo.getBundleId();

      if (Platform.OS === 'ios') {
        const response = await fetch(`https://itunes.apple.com/lookup?bundleId=${bundleId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch iOS app info: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.resultCount > 0 && data.results?.[0]) {
          const appInfo = data.results[0];
          return {
            version: appInfo.version || null,
            url: appInfo.trackViewUrl || null,
          };
        }
      } else {
        // Android - Google Play Store
        const response = await fetch(
          `https://play.google.com/store/apps/details?id=${bundleId}&hl=en&gl=US`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch Android app info: ${response.statusText}`);
        }

        const html = await response.text();
        let latestVersion: string | null = null;

        // Try multiple regex patterns to find version
        const patterns = [
          /Current Version.+?>([\d.-]+)<\/span>/,
          /\[\[\["([\d-.]+?)"\]\]/,
          /"versionName":"([\d.]+)"/,
          /Version[\s\S]*?([\d.]+)/i,
        ];

        for (const pattern of patterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            latestVersion = match[1].trim();
            break;
          }
        }

        return {
          version: latestVersion,
          url: `https://play.google.com/store/apps/details?id=${bundleId}`,
        };
      }

      return { version: null, url: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error fetching the latest version: ${errorMessage}`);
    }
  }, []);

  /**
   * Checks for app updates by comparing current and live versions
   */
  const checkForUpdate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const appVersion = DeviceInfo.getVersion();
      setCurrentVersion(appVersion);

      const { version: latestVersion, url } = await getLatestStoreVersion();

      if (latestVersion) {
        setLiveVersion(latestVersion);
        setUpdateUrl(url);

        if (compareVersions(latestVersion, appVersion)) {
          setNeedUpdate(true);
        } else {
          setNeedUpdate(false);
        }
      } else {
        setLiveVersion(null);
        setNeedUpdate(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      console.error('Error checking for update:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getLatestStoreVersion, compareVersions]);

  /**
   * Opens the app store page for updating the app
   */
  const handleUpdate = useCallback(async () => {
    if (!updateUrl) {
      console.warn('No update URL available');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(updateUrl);
      if (canOpen) {
        await Linking.openURL(updateUrl);
      } else {
        throw new Error(`Cannot open URL: ${updateUrl}`);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to open update URL');
      setError(error);
      console.error('Error opening update URL:', error);
    }
  }, [updateUrl]);

  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  return {
    currentVersion,
    liveVersion,
    needUpdate,
    isLoading,
    error,
    handleUpdate,
    checkForUpdate,
  };
};

export default useVersionUpdate;
