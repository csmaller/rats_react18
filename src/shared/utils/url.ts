const apiBaseUrl = 'https://api.ratsband.com/.netlify/functions/';
const laravelApiUrl =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '');

export const songsUrl = `${apiBaseUrl}songs`;
export const setListUrl = `${laravelApiUrl}/api/songs`;
export const songsPdfUrl = `${laravelApiUrl}/songs.pdf`;
export const mainVideoUrl = `${laravelApiUrl}/api/main-video`;
export const videosUrl = `${laravelApiUrl}/api/videos`;
export const epkUrl = `${laravelApiUrl}/api/epk`;
export const adminUrl = `${laravelApiUrl}/admin`;
export const contactUrl = `${apiBaseUrl}contact`;
export const contactInfoUrl = `${laravelApiUrl}/api/contact`;
export const authUrl = `${apiBaseUrl}auth`;
export const tourDatesUrl = `${apiBaseUrl}tourdates`;
