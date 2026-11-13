import { Box } from '@mui/material';
import { useId } from 'react';

const links = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/rageagainstthesupremes',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/rageagainstthesupremes/',
  },
] as const;

function FacebookMark() {
  return (
    <Box component="svg" viewBox="0 0 24 24" aria-hidden="true" sx={{ width: '100%', height: '100%', display: 'block' }}>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.6 19v-6.1h2l.3-2.4h-2.3V9.1c0-.7.2-1.2 1.2-1.2H16V5.8c-.2 0-.9-.1-1.7-.1-1.7 0-2.9 1-2.9 3v1.7H9.1v2.4h2.3V19h2.2z"
      />
    </Box>
  );
}

function InstagramMark({ gradientId }: { gradientId: string }) {
  return (
    <Box component="svg" viewBox="0 0 24 24" aria-hidden="true" sx={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id={gradientId} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="70%" stopColor="#d6249f" />
          <stop offset="100%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6" fill={`url(#${gradientId})`} />
      <rect x="4.3" y="4.3" width="15.4" height="15.4" rx="4.2" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16.7" cy="7.3" r="1" fill="#fff" />
    </Box>
  );
}

function SocialBadge({
  name,
  href,
  size,
  gradientId,
}: {
  name: (typeof links)[number]['name'];
  href: string;
  size: number;
  gradientId: string;
}) {
  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`RATS on ${name}`}
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        borderRadius: '50%',
        '@keyframes socialSpin': {
          to: { transform: 'rotate(360deg)' },
        },
        '&:hover .social-ring, &:focus-visible .social-ring': {
          animation: 'socialSpin 1.2s linear infinite',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'secondary.main',
          outlineOffset: 4,
        },
        '@media (prefers-reduced-motion: reduce)': {
          '&:hover .social-ring, &:focus-visible .social-ring': {
            animation: 'none',
          },
        },
      }}
    >
      <Box
        className="social-ring"
        aria-hidden="true"
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'conic-gradient(#ffe082, #ffb300 28%, #a86b00 52%, #ffb300 76%, #ffe082)',
          mask: 'radial-gradient(circle, transparent 48%, #000 50%)',
          WebkitMask: 'radial-gradient(circle, transparent 48%, #000 50%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '30%',
          top: '30%',
          width: '40%',
          height: '40%',
        }}
      >
        {name === 'Facebook' ? <FacebookMark /> : <InstagramMark gradientId={gradientId} />}
      </Box>
    </Box>
  );
}

export default function SocialLinks({ size = 88 }: { size?: number }) {
  const gradientId = useId().replace(/:/g, '');

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 3 } }}>
      {links.map((link) => (
        <SocialBadge
          key={link.name}
          name={link.name}
          href={link.href}
          size={size}
          gradientId={`${gradientId}-${link.name}`}
        />
      ))}
    </Box>
  );
}
