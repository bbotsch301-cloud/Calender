// Expo entry. On web, @expo/metro-runtime supplies the runtime shims
// needed by the bundler; it's a no-op on native. Import it FIRST so its
// polyfills are in place before any React / RN code runs.
import '@expo/metro-runtime';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
