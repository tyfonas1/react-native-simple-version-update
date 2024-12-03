import { useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import { Linking, Platform } from 'react-native';

const useVersionUpdate = () => {
    const [currentVersion, setCurrentVersion] = useState<string | null>(null);
    const [liveVersion, setLiveVersion] = useState<string | null>(null);
    const [needUpdate, setNeedUpdate] = useState<boolean>(false);
    const [updateUrl, setUpdateUrl] = useState<string | null>(null);

    useEffect(() => {
        const checkForUpdate = async () => {
            const appVersion = DeviceInfo.getVersion(); // Current app version
            setCurrentVersion(appVersion);

            try {
                const latestVersion = await getLatestStoreVersion();
                setLiveVersion(latestVersion);

                if (latestVersion && compareVersions(latestVersion, appVersion)) {
                    setNeedUpdate(true);
                }
            } catch (error) {
                console.error('Error checking for update:', error);
            }
        };

        checkForUpdate();
    }, []);

    const getLatestStoreVersion = async () => {
        try {
            const bundleId = DeviceInfo.getBundleId();

            if (Platform.OS === 'ios') {
                const response = await fetch(
                    `https://itunes.apple.com/lookup?bundleId=${bundleId}`,
                );
                const data = await response.json();
                if (data.resultCount > 0) {
                    setUpdateUrl(data?.results[0]?.trackViewUrl);
                    return data.results[0].version;
                }
            } else {
                const response = await fetch(
                    `https://play.google.com/store/apps/details?id=${bundleId}`,
                );
                const html = await response.text();
                const regex =
                    /<div[^>]*>\s*Current\s+Version\s*<\/div>\s*<span[^>]*>\s*([0-9.]+)\s*<\/span>/;
                const match = regex.exec(html);

                if (match && match[1]) {
                    setUpdateUrl(
                        `https://play.google.com/store/apps/details?id=${bundleId}`,
                    );
                    return match[1];
                }
            }
            return null;
        } catch (error) {
            console.error('Error fetching the latest version:', error);
            return null;
        }
    };

    const compareVersions = (latestVersion: string, currentV: string) => {
        const latest = latestVersion.replace(/\./g, '');
        const current = currentV.replace(/\./g, '');
        return latest > current;
    };

    const handleUpdate = async () => {
        if (updateUrl) {
            await Linking.openURL(updateUrl);
        }
    };

    return {
        currentVersion,
        liveVersion,
        needUpdate,
        handleUpdate,
    };
};

export default useVersionUpdate;
