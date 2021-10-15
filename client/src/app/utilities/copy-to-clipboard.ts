export function copyToClipboard(text: string) {
    const handler = (event: any) => {
        event.clipboardData.setData('text/plain', text);
        event.preventDefault();
        document.removeEventListener('copy', handler, true);
    };
    document.addEventListener('copy', handler, true);
    document.execCommand('copy');
}
