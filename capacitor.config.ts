/// <reference types="@capawesome/capacitor-android-edge-to-edge-support" />
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'money.unclejim.app',
	appName: 'Uncle Jim',
	webDir: 'dist',
	server: {
		androidScheme: 'https',
	},
	android: {
		adjustMarginsForEdgeToEdge: 'force',
	},
	plugins: {
		App: {
			iosScheme: "unclejim",
			androidScheme: "unclejim"
		},
		BarcodeScanning: {
			photoLibraryUsageDescription: "To scan QR codes using the camera"
		},
		StatusBar: {
			overlaysWebView: false,
			backgroundColor: '#0D0D1A',
		},
		SplashScreen: {
			backgroundColor: "#0D0D1A",
			androidScaleType: "CENTER_CROP",
			launchAutoHide: true,
			splashFullScreen: true,
		},
		LocalNotifications: {
			smallIcon: "ic_notification",
			iconColor: "#F4706C",
		},
		PushNotifications: {
			presentationOptions: ["badge", "sound", "alert"]
		},
		CapacitorHttp: {
			enabled: true
		},
		"EdgeToEdge": {
			"backgroundColor": "#0D0D1A"
		}
	}
};

export default config;
