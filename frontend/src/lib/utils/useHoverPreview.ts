export function useHoverPreview(node: HTMLElement, buildPreview: () => HTMLElement) {
  let previewEl: HTMLElement | null = null;

  function show() {
    if (previewEl) return;
    previewEl = buildPreview();
    previewEl.classList.add("hover-preview");
    previewEl.style.position = "absolute";
    previewEl.style.zIndex = "1000";
    document.body.appendChild(previewEl);

    const rect = node.getBoundingClientRect();
    previewEl.style.top = `${rect.bottom + window.scrollY + 4}px`;
    previewEl.style.left = `${rect.left + window.scrollX}px`;
  }

  function hide() {
    previewEl?.remove();
    previewEl = null;
  }

  node.addEventListener("mouseenter", show);
  node.addEventListener("mouseleave", hide);

  return {
    update(newBuildPreview: () => HTMLElement) {
      buildPreview = newBuildPreview;
    },
    destroy() {
      hide();
      node.removeEventListener("mouseenter", show);
      node.removeEventListener("mouseleave", hide);
    }
  };
}
