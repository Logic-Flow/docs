import screenshot from './screenshot';

export default function screenshotPlugin() {
  return {
    name: 'screenshotPlugin',
    configureServer() {
      screenshot();
    },
  };
}
