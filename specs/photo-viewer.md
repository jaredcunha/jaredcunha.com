# Spec: Full-screen photo viewer

Status: Ready to build. One behavior (clicking the black area) will be decided after trying it.

## Summary

Clicking a photo in a photo essay opens it full screen on a black background. From there, the reader can move through every photo in the post using the arrow keys, swiping, or subtle on-screen arrows, and close the viewer to return to the photo they clicked. Captions show at the bottom and can be hidden. The viewer is keyboard and screen reader accessible, and adds no image downloads until someone opens it.

## Scope

- **In scope:** photo essays (`/photos/[slug]`) only.
- **Photos included:** every `PhotoGridItem` photo and every individual MDX `Image` in the post, in page order, as one continuous sequence. Moving from the last photo of one grid to the first photo of the next happens inside the same viewer, with no closing or reopening.
- **Out of scope:** blog posts, and `PhotoGrid` group captions.
- **New:** an optional `caption` prop on `PhotoGridItem`, shown only in the viewer (see "Captions").

## Goals

- View any photo in a post at a large size, and step through all of them in page order.
- Work fully by keyboard, screen reader, mouse, and touch.
- No extra image downloads or noticeable JavaScript cost for readers who never open the viewer.

## Non-goals (for this version)

- Zoom and pan beyond the browser's native pinch zoom.
- Downloading, sharing, or showing EXIF data.
- A thumbnail strip or grid view inside the viewer.
- Moving between posts.
- URL changes or history entries. The browser's back button keeps its normal behavior and goes to the previous page.

## Current state

- Photos are rendered by `PhotoGridItem` (inside `PhotoGrid`) and by the MDX `Image` component. Both use the `Image` component in `src/app/components/ui/Image/Image.tsx`, which loads from Cloudinary at a width chosen per column size (300–800px).
- Per-photo captions only exist on MDX `Image` (`caption` prop). Three photo essays use `Image`, and five of those images have captions: `24-hours-in-manhattan`, `iceland-2018`, and `the-gray-island`.
- `PhotoGridItem` has no `caption` prop yet. This feature adds one.
- The longest photo essay has 87 photos.
- `focus-trap-react` is already a dependency (used by `SiteHeader`), but this feature shouldn't need it.

## User experience

### Opening

- Every photo in the post body is a trigger.
- Click, tap, or press Enter/Space on a focused photo to open the viewer at that photo.
- Photos show a pointer cursor and a visible focus ring. No other visual change to the page.

### Layout

- Covers the full viewport with a black background. The page behind it doesn't scroll.
- The photo is centered and scaled to fit (`object-fit: contain`), never cropped or upscaled past its natural size.
- **Close button:** top right. Always visible, subtle at rest, full opacity on hover or focus.
- **Full screen button:** next to Close. Uses the Fullscreen API on the viewer's inner container. Shown only where the browser supports it, so not on iPhone, where Safari limits full screen to video. In full screen, Escape first exits full screen, and a second Escape closes the viewer. Closing the viewer also leaves full screen.
- **Vertical centering:** equal space above and below the photo, just enough to clear the top controls, so photos sit in the middle of the screen.
- **Previous/next arrows:** vertically centered on the left and right edges. Low contrast, and they auto-hide (see "Auto-hiding controls"). Not shown on touch devices (see "Swiping").
- **Counter, such as "12 of 87":** small, top left.
- **Caption area:** bottom, below the photo, without overlapping it on large screens. On small screens it may overlay the bottom of the photo on a dark gradient.
- Respects safe areas on phones with notches (`env(safe-area-inset-*)`).

### Navigating

| Input | Action |
| --- | --- |
| Right arrow, swipe left, next button | Next photo |
| Left arrow, swipe right, previous button | Previous photo |
| Home / End | First / last photo |
| Escape, close button | Close |
| Tab / Shift+Tab | Cycle through the viewer's controls only |

- **No looping.** On the first photo there is no previous button, and on the last photo there is no next button. The matching arrow key and swipe do nothing.
- If the arrow button that disappears had keyboard focus, focus moves to the other arrow, or to the close button if there's only one photo. Focus is never lost to the page body.
- Transitions: the arrow keys and buttons slide to the neighboring photo. Home and End jump without sliding. No sliding when `prefers-reduced-motion: reduce` is set.

### Swiping

- Swiping should feel like the iOS Photos app: the photo follows the finger, the next photo slides in alongside it, and releasing uses the platform's own momentum.
- Built with native CSS scroll snapping on a horizontal strip of photos, not custom gesture code. That gives real momentum, iOS's edge bounce on the first and last photo, and two-finger trackpad swipes on a Mac.
- One photo per swipe, however hard the flick (`scroll-snap-stop: always`).
- Swiping past either end never triggers the browser's swipe-to-go-back (`overscroll-behavior-x: contain`).
- Vertical swipes don't navigate, and pinch zoom keeps working.
- **No arrows on touch devices** (`hover: none`). The arrow buttons are hidden visually but stay available to screen readers, because VoiceOver takes over swipe gestures and its users need the buttons. They also reappear if focused from an external keyboard.

### Auto-hiding controls

- The previous/next arrows fade out after about 2 seconds without pointer movement, and fade back in on any mouse movement or touch.
- They stay visible while any viewer control has keyboard focus, or while the pointer is over them.
- Hiding is visual only. The buttons stay in the tab order and in the accessibility tree, and receiving focus shows them.
- Respects `prefers-reduced-motion` (no fade animation, just show and hide).

### Captions

- **Caption sources:**
  - Individual `Image` captions. These already show under the photo on the page, and keep doing so.
  - The new optional `caption` prop on `PhotoGridItem`, for example `<PhotoGridItem cols="6" src="..." alt="..." caption="Sunset over the Alhambra" />`. These show **only in the viewer**. Nothing is rendered under the photo on the page.
  - `PhotoGrid` group captions are ignored by the viewer, and keep showing on the page as they do today.
- When the current photo has a caption, it shows in the caption area at the bottom.
- A "Hide caption" / "Show caption" toggle sits in the caption area. When captions are hidden, the photo gets the space back.
- The setting carries over when moving between photos and when closing and reopening the viewer on the same page. It's kept in memory only: no cookies, `localStorage`, or `sessionStorage`. Reloading or leaving the page resets it to shown.
- Photos without a caption render no caption markup at all: no caption area, no toggle, and no empty element left for screen readers.

### Closing

- Escape or the close button.
- Clicking the black area outside the photo: **undecided.** Build it behind a single flag, off by default, so it can be switched on after trying it.
- Focus returns to the photo that was clicked to open the viewer, even after navigating to other photos.
- The page's scroll position is exactly as it was before opening.

## Accessibility

- Use the native `<dialog>` element opened with `showModal()`. That provides the modal behavior, focus containment, the Escape key, and makes the rest of the page inert, without a new dependency.
- The dialog has an accessible name, for example `aria-label="Photo viewer"`.
- Each trigger is a `<button>` wrapping the image, not a click handler on an `<img>`.
  - Accessible name: "Open photo 3 of 55".
  - The image's alt text is exposed as the button's description (`aria-describedby`). That way, screen reader users reading the page still hear what the photo shows, while the short name keeps navigation by buttons quick.
- When the viewer opens, focus moves into the dialog, and screen readers announce the dialog name and the current photo.
- The large photo uses the same alt text as on the page.
- A polite live region announces each change: "Photo 13 of 87", followed by the alt text.
- **Button labels:** "Close", "Previous photo", "Next photo", "Hide caption" / "Show caption". The caption toggle uses `aria-expanded` and `aria-controls`.
- Focus indicators meet WCAG 2.2 focus appearance against black.
- **Contrast:**
  - Caption text: at least 4.5:1.
  - Arrow and close icons: at least 3:1 whenever they're visible, including the "subtle" resting state.
- Tap targets are at least 44x44px, even when the visible icon is smaller.
- Respects `prefers-reduced-motion`.
- Works at 400% zoom and in Windows High Contrast / forced colors mode.

## Performance

- **No extra downloads until opened.** Nothing new loads on page load: no full-size images, no preloads.
- **Code splitting.** The viewer's JavaScript is loaded with `React.lazy` on first open, so it isn't in the initial page bundle. The triggers themselves add only a button wrapper.
- **Styles load with the page.** The viewer's CSS (about 1 kB gzipped) loads with photo essays rather than on demand, so the viewer is never shown unstyled while its stylesheet catches up.
- **While the viewer is open:**
  - The current photo loads at a size matched to the screen: Cloudinary width from the viewport width × device pixel ratio, capped (for example, at 2400px), with `f_auto` and a reasonable quality.
  - Once the current photo loads, the previous and next photos are prefetched at the same size. Nothing further ahead.
  - While the large version loads, the already-downloaded page version is shown scaled up, then swapped. This avoids a blank screen.
- GIFs keep their current handling (not reformatted, width capped).
- Closing the viewer doesn't clear the browser cache, so reopening the same photo is instant.

## Implementation notes

- **Collecting the photos.** Each `PhotoGridItem` and MDX `Image` registers itself with a post-level context, in page order: `src`, `alt`, caption (from either component), and a ref to its trigger button. The viewer reads this single ordered list, so it spans every grid and individual image in the post.
- **Provider.** Wrap the post body in the provider in `src/app/photos/[slug]/page.tsx` only. Outside the provider (blog posts), `PhotoGridItem` and `Image` render exactly as they do today, with no button.
- **Page order.** Determine order from the DOM (for example, `compareDocumentPosition`) rather than mount order, so it stays correct regardless of how React mounts components.
- **Server components.** `PhotoGrid` is currently a server component. The trigger and provider need to be client components. Keep the server-rendered HTML the same apart from the button wrapper.
- **Scroll lock.** Lock body scroll while open, and restore the exact scroll position on close.
- **`PhotoGridItem` caption prop.** Add `caption?: string` to `PhotoGridItemProps`. Pass it to the viewer context only. Don't render it in the grid item's markup, including as visually hidden text.
- **Click-outside flag.** A single constant or prop, defaulting to off.
- **Reuse.** Build the large image URL with the existing helpers in `src/app/utils/image-cdn.ts`.

## Acceptance criteria

1. On a photo essay, clicking, tapping, or pressing Enter/Space on any photo opens the viewer on that photo. Blog posts are unchanged.
2. Arrow keys, swipes, and the on-screen arrows move through every photo in the post, across all grids and individual images, in page order, without reopening the viewer.
3. There is no previous button on the first photo and no next button on the last. Navigation doesn't loop.
4. Escape and the close button close the viewer. Focus returns to the photo that was clicked, and the scroll position is unchanged.
5. Tab stays within the viewer while it's open. Keyboard focus is never lost when an arrow button disappears.
6. Screen readers announce triggers as "Open photo N of M" with the alt text as the description, and announce the dialog, the position, and the alt text on each change.
7. Captions from individual `Image` photos and from `PhotoGridItem`'s `caption` prop show in the viewer, can be hidden and shown, and the setting holds for the rest of the page visit without any browser storage.
8. A `PhotoGridItem` caption never appears on the page under the photo. Photos without a caption render no caption markup in the viewer.
9. On devices with a mouse, the arrows auto-hide after inactivity and reappear on pointer movement or focus. On touch devices they're never shown visually. In both cases they're always reachable by keyboard and screen reader.
10. On touch devices, the photo follows the finger and settles on exactly one photo per swipe, with native momentum.
11. With the viewer never opened, the page loads the same images as before, and its JavaScript grows by no more than a small amount (target under 2 KB gzipped).
12. With the viewer open, only the current photo and its two neighbors load at full size.
13. Works in current Safari (iOS and macOS), Chrome, Firefox, and Edge.
14. Passes an axe scan, and a manual check with VoiceOver (macOS and iOS) and NVDA.

## Decided

| Question | Decision |
| --- | --- |
| Scope | Photo essays only. Includes `PhotoGrid` photos and individual `Image` photos as one sequence. |
| Group captions | Ignored by the viewer. |
| `PhotoGridItem` captions | New optional `caption` prop, shown in the viewer only, never on the page. |
| Focus on close | Return to the photo that was clicked. |
| Back button | No URL or history change. Back goes to the previous page. |
| End of list | No looping. No next button on the last photo, no previous button on the first. |
| Trigger name | "Open photo N of M". |
| Caption setting | Remembered in memory for the page visit only. No browser storage. |
| Arrows | Auto-hide with a mouse. Not shown on touch devices, but kept for screen readers. |
| Swiping | Follows the finger, iOS-style, using native scroll snapping. |
| Full screen | Button next to Close, where the browser supports it. |

## Still open

- **Click the black area to close.** Ships behind a flag, off by default. Decide after trying it.
