const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Necessário para o expo-sqlite funcionar no navegador (web)
// Fonte: https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/#web-setup
config.resolver.assetExts.push('wasm');
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};

// Configuração do NativeWind (Tailwind). Fonte: https://www.nativewind.dev/docs/getting-started/installation
module.exports = withNativeWind(config, { input: './src/global.css' });
