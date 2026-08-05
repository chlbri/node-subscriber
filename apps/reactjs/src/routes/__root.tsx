import {
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';

import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: '@bemedev/subscriber reactJS Visual Tester' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  }),

  shellComponent: ({ children }) => {
    return (
      <html lang='en' suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body className='font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)] flex flex-col min-h-screen bg-slate-950/80'>
          <div className='flex-1'>{children}</div>
          <Scripts />
        </body>
      </html>
    );
  },
});
