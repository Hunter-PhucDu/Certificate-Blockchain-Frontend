const LOCK_KEY = "app_active_tab";

export function acquireTabLock(onConflict: () => void) {
  const myId = Date.now().toString();
  localStorage.setItem(LOCK_KEY, myId);
  window.addEventListener("storage", (e) => {
    if (e.key === LOCK_KEY && e.newValue !== myId) {
      onConflict();
    }
  });
}

export function releaseTabLock() {
  localStorage.removeItem(LOCK_KEY);
}
