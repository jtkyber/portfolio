export function isWebkit() {
    const ua = navigator.userAgent;
    return (
        (/AppleWebKit/.test(ua) && !/Chrome/.test(ua)) ||
        /\b(iPad|iPhone|iPod)\b/.test(ua)
    );
}
