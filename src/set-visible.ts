export default function setVisible(): void {
  for (const item of Array.from(
    window.document.querySelectorAll('.card-item.hidden'),
  )) {
    item.classList.remove('hidden');
  }
}
