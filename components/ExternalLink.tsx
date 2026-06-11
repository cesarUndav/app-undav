// components/ExternalLink.tsx
// Componente para abrir enlaces externos. En web usa Link normalmente y en móvil abre el navegador externo.

import { Link, type LinkProps } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';
import React from 'react';

type ExternalLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export function ExternalLink({ href, ...rest }: ExternalLinkProps) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as LinkProps['href']}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault();
          await openBrowserAsync(href);
        }
      }}
    />
  );
}