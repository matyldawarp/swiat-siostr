// The version of the game now running, shown in Settings: docs/version.json, which the
// Pages workflow (.github/workflows/pages.yml) writes on every build and tools/dev-server.mjs
// serves locally from .git. Read once at start (main.js), so it stays the version of the
// files this page loaded. Any other server has no such file: the version is then unknown.

let loading = null;

export function loadVersion() {
    if (!loading) {
        loading = fetch('version.json', { cache: 'no-store' })
            .then((response) => (response.ok ? response.json() : null))
            .catch(() => null);
    }
    return loading;
}

// "Wersja 5ccde19, 14.11.2026, 13:05", in the device's time zone.
export function versionText(version) {
    if (!version || !version.sha) {
        return 'Wersja nieznana';
    }
    const date = new Date(version.date).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' });
    return `Wersja ${version.sha.slice(0, 7)}, ${date}${version.local ? ' (lokalnie)' : ''}`;
}
