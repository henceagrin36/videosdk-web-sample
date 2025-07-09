/**
 * Attempt to create a pop-out window for the video player.
 *
 * Zoom guides referenced
 * https://developers.zoom.us/docs/video-sdk/web/video-picture-in-picture/
 * https://developers.zoom.us/blog/video-sdk-picture-in-picture/
 */
export const handlePopout = () => {
  const popout = window.open('', '', 'width=600,height=400');

  if (!popout) {
    throw new Error('Failed to open popout window');
  }

  popout.document.title = window.document.title;
  popout.document.body.style.backgroundColor = 'hsl(0, 0%, 92%)';

  Array.from(document.styleSheets).forEach((styleSheet) => {
    Array.from(styleSheet.cssRules).forEach((rule) => {
      const style = document.createElement('style');
      style.textContent = rule.cssText;
      popout.document.head.appendChild(style);
    });
  });

  const thisDocument = window.document;
  const pipDocument = popout.document;

  // Copy the video-player-container element to the PiP window
  const videoContainer = thisDocument.querySelector('video-player-container');
  if (!videoContainer) {
    return;
  }
  const videoContainerParent = videoContainer.parentElement;
  pipDocument.body.appendChild(videoContainer);

  // May need to add these to popout window???
  // popout.mediaStream = window.mediaStream;
  // popout.zmClient = window.zmClient;

  // Create a <p> element that tells the user the video has moved
  const movedElement = thisDocument.createElement('p');
  movedElement.classList.add('text-center');
  movedElement.id = 'msg-moved-to-pip';
  movedElement.textContent = 'Video has been moved to picture-in-picture window';
  videoContainerParent?.appendChild(movedElement);

  popout.addEventListener('pagehide', ({ target }) => {
    const parentWindow = window.document;
    const pipDocument = target as Document;

    // Re-capture our video-player-container element inside the PiP window
    const videoContainer = pipDocument?.querySelector('video-player-container');
    if (!videoContainer) {
      return;
    }
    parentWindow?.querySelector('p#msg-moved-to-pip')?.replaceWith(videoContainer);
  });
};
