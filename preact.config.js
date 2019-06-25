import { resolve } from 'path';
import CopyPlugin from 'copy-webpack-plugin';

export default function(config, env, helpers) {
  config.resolve.alias.src = resolve(__dirname, './src');

  config.plugins.push(new CopyPlugin([
    { from: './robots.txt', to: './' },
    { from: './sitemap.xml', to: './' },
  ]));
}
