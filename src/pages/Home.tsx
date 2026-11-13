import { Box, Container, Divider, Typography } from '@mui/material';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import BandNav, { HomeSection } from '../shared/components/BandNav';
import Video from '../shared/components/Video';
import Songs from './Songs';
import Contact from './Contact';
import Epk from './Epk';
import logo from '../assets/logo_transparent.png';

const sectionIds = ['home', 'media', 'contact', 'songs', 'epk'] as const;
type SectionId = (typeof sectionIds)[number];

function isSectionId(value: string): value is SectionId {
  return (sectionIds as readonly string[]).includes(value);
}

function rememberSection(id: SectionId) {
  const next = `#${id}`;
  if (window.location.pathname === '/' && window.location.hash !== next) {
    window.history.replaceState(window.history.state, '', next);
  }
}

function sectionTop(main: HTMLElement, id: SectionId) {
  const target = document.getElementById(id);
  if (!target) {
    return null;
  }

  return target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop;
}

function sectionInView(main: HTMLElement): SectionId {
  if (main.scrollTop > 0 && main.scrollTop + main.clientHeight >= main.scrollHeight - 4) {
    return 'epk';
  }

  const line = main.scrollTop + 96;
  let active: SectionId = 'home';

  for (const id of sectionIds) {
    const top = sectionTop(main, id);
    if (top !== null && top <= line) {
      active = id;
    }
  }

  return active;
}

function scrollToSection(id: SectionId, behavior: ScrollBehavior) {
  const main = document.getElementById('main');
  const top = main ? sectionTop(main, id) : null;

  if (!main || top === null) {
    return;
  }

  main.scrollTo({
    behavior,
    top: Math.max(0, top - 88),
  });
}

const Home = () => {
  const { hash } = useLocation();
  const pinned = useRef<SectionId | null>(null);

  const go = (section: HomeSection) => {
    pinned.current = section;
    rememberSection(section);
    scrollToSection(section, 'smooth');
    window.setTimeout(() => {
      if (pinned.current === section) {
        pinned.current = null;
      }
    }, 900);
  };

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const id = hash.replace('#', '');
    const main = document.getElementById('main');

    if (!isSectionId(id) || !main) {
      return () => {
        window.history.scrollRestoration = previous;
      };
    }

    pinned.current = id;
    const place = () => {
      if (pinned.current === id) {
        scrollToSection(id, 'auto');
      }
    };
    const release = () => {
      pinned.current = null;
    };

    place();
    const observer = new ResizeObserver(place);
    for (const child of main.children) {
      observer.observe(child);
    }
    main.addEventListener('wheel', release, { passive: true });
    main.addEventListener('touchmove', release, { passive: true });

    return () => {
      observer.disconnect();
      main.removeEventListener('wheel', release);
      main.removeEventListener('touchmove', release);
      window.history.scrollRestoration = previous;
    };
  }, [hash]);

  useEffect(() => {
    const main = document.getElementById('main');
    if (!main) {
      return;
    }

    let frame = 0;
    const onScroll = () => {
      if (pinned.current) {
        return;
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        rememberSection(sectionInView(main));
      });
    };

    main.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      main.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <Container
      id="main"
      sx={{
        overflowY: 'scroll',
        height: '100vh',
        width: '100%',
        maxWidth: '100% !important',
        scrollBehavior: 'smooth',
      }}
    >
      <BandNav overlay onSection={go} />
        <Container
          id="home"
          className="container home"
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pt: { xs: 10, md: 12 },
            pb: 6,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Rage Against the Supremes"
            sx={{ width: { xs: 'min(86vw, 340px)', md: 'min(52vw, 520px)' }, height: 'auto' }}
          />
          <Typography variant="h3" component="h1" sx={{ mt: 3, letterSpacing: '0.04em' }}>
            Ski Town Party Music
          </Typography>
          <Typography sx={{ mt: 1.5, maxWidth: 560, color: 'text.secondary', fontStyle: 'italic' }}>
            The most dangerous cover band in the world.
          </Typography>
        </Container>
        <Container className="container" sx={{ px: { xs: 1, sm: 4 } }}>
          <Video />
          <Divider sx={{ height: 20 }} />
        </Container>
       <Container
          id="contact"
          className="container"
          sx={{ px: { xs: 1, sm: 4} }}
        >
          <Contact />
          <Divider sx={{ height: 20 }} />
        </Container>
        
        <Container
          id="songs"
          className="container"
          sx={{ px: { xs: 1, sm: 4 } }}
        >
          <Songs />
          <Divider sx={{ height: 20}} />
        </Container>
        <Container id="epk" className="container" sx={{ px: { xs: 1, sm: 4 } }}>
          <Epk embedded />
        </Container>
      
    </Container>
  );
};

export default Home;
