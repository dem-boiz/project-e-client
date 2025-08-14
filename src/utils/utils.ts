function getCookie(name: string): string | null {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const c of cookies) {
    const [k, ...vParts] = c.split('=');
    if (k === decodeURIComponent(name)) {
      return decodeURIComponent(vParts.join('='));
    }
  }
  return null;
}
export { getCookie };