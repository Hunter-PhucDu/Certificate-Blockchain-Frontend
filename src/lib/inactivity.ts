export function setupInactivityLogout(
  onLogout: () => void,
  timeout = 30 * 60 * 1000, // 30 minutes
) {
  let timer: NodeJS.Timeout;
  const events = ["click", "keydown", "mousemove", "scroll", "touchstart"];

  const reset = () => {
    clearTimeout(timer);
    timer = setTimeout(onLogout, timeout);
  };

  events.forEach((evt) => window.addEventListener(evt, reset));
  reset();

  return () => {
    clearTimeout(timer);
    events.forEach((evt) => window.removeEventListener(evt, reset));
  };
}
