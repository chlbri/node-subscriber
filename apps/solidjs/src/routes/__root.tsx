import {
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/solid-router';
import { HydrationScript } from 'solid-js/web';

import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: '@bemedev/subscriber solidJS Visual Tester' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  }),

  shellComponent: ({ children }) => {
    return (
      <html lang='en'>
        <head>
          <HydrationScript />
          <HeadContent />
        </head>
        <body class='font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)] flex flex-col min-h-screen bg-slate-950/80'>
          <div class='flex-1'>{children}</div>
          <Scripts />
        </body>
      </html>
    );
  },
});
