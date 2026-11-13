import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {
  slug: string;
  photo: string;
  alt: string;
  rounded?: boolean;
};

export function memberPath(slug: string) {
  return `/members/${slug}`;
}

export default function MemberPhotoLink({ slug, photo, alt, rounded = false }: Props) {
  return (
    <Box
      component={Link}
      to={memberPath(slug)}
      aria-label={alt}
      sx={{
        display: 'block',
        border: '2px solid',
        borderColor: 'secondary.main',
        borderRadius: rounded ? 2 : 0,
        overflow: 'hidden',
        lineHeight: 0,
        boxSizing: 'border-box',
        transition: 'border-width 160ms ease',
        '&:hover': { borderWidth: '7px' },
      }}
    >
      <Box
        component="img"
        src={photo}
        alt=""
        sx={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', display: 'block' }}
      />
    </Box>
  );
}
