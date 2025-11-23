// Reusable modal component

export function createModal(
  title: string,
  content: string,
  onClose?: () => void
): HTMLElement {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;

  const closeModal = () => {
    modal.remove();
    if (onClose) onClose();
  };

  modal.querySelector(".modal-close")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.body.appendChild(modal);
  return modal;
}

export function closeModal(modal: HTMLElement): void {
  modal.remove();
}

