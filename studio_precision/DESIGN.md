---
name: Studio Precision
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#e1e3e4'
  on-secondary-container: '#626566'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a0053'
  on-tertiary-container: '#9e6ade'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e1e3e4'
  secondary-fixed-dim: '#c5c7c8'
  on-secondary-fixed: '#191c1d'
  on-secondary-fixed-variant: '#454748'
  tertiary-fixed: '#eedbff'
  tertiary-fixed-dim: '#dab9ff'
  on-tertiary-fixed: '#2a0053'
  on-tertiary-fixed-variant: '#5e289b'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Open Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Open Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  code:
    fontFamily: Courier Prime
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style

This design system centers on the intersection of raw artistry and technical precision. It is designed for a sculptor and prop maker whose work demands high-fidelity visual representation and a professional, gallery-grade presentation.

The aesthetic follows a **High-Contrast / Modern** philosophy. It utilizes expansive whitespace to frame imagery like physical artifacts in a gallery. The interface remains intentionally understated to ensure the physical textures of the sculptures—metal, clay, resin—remain the focal point. For the user, the experience should feel curated, architectural, and highly responsive. While the public-facing portfolio is cinematic and immersive, the administrative interface shifts toward a **Minimalist / Utilitarian** style, emphasizing functional clarity and efficient content management.

## Colors

The palette is rooted in a strict monochromatic foundation to provide maximum contrast for portfolio photography. 

- **Light Mode:** High-contrast black on white. The secondary color (#F8F9FA) is reserved for subtle structural divisions and card backgrounds to maintain depth without adding visual noise.
- **Dark Mode:** A deep charcoal foundation (#121212) that reduces eye strain while allowing the accent color (#BB86FC) to highlight interactive elements and call-to-actions.
- **Admin Interface:** Uses the neutral and secondary tones primarily to create a focused, low-distraction environment for metadata entry and asset uploading.

## Typography

The typography strategy differentiates between "Atmosphere" (Headlines) and "Information" (Body).

- **Headlines:** Montserrat is used for its geometric stability and bold presence. Display sizes use tight letter spacing and heavy weights to mimic the impact of a gallery placard.
- **Body:** Open Sans provides a neutral, highly legible counterpoint. It is set with generous line heights to ensure long-form project descriptions remain accessible.
- **Utility:** A monospaced font (Courier Prime) is introduced specifically for the Admin Panel to reflect the Jekyll-inspired, technical nature of the backend management.

## Layout & Spacing

This design system uses a **Fluid Grid** approach with a mobile-first priority. 

- **Portfolio Grid:** Employs a masonry layout for the main gallery. On mobile, this collapses to a single column with full-bleed imagery. On desktop, it scales to a 12-column grid where items span 4 or 6 columns to create visual rhythm.
- **Margins:** Large horizontal margins (24px on mobile, up to 120px on desktop) are used to create a "frame" effect around the content.
- **Admin Layout:** Switches to a fixed-sidebar navigation with a fluid content area, prioritizing data density and functional grouping over artistic whitespace.

## Elevation & Depth

To maintain a "modern gallery" feel, the system avoids heavy drop shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** Depth is communicated through color shifts (e.g., a light grey surface sitting on a white background).
- **Interactive States:** Lift is achieved through subtle scale transforms (1.02x) rather than shadows.
- **Admin Panel:** Uses 1px borders (#E1E1E1) to define input areas and containers, ensuring a "flat" but structured hierarchy that feels efficient and precise.

## Shapes

The design system utilizes **Sharp (0)** roundedness. 

The choice of 90-degree angles reinforces the architectural and industrial nature of prop making and sculpture. This applies to buttons, image containers, and input fields. In the Admin Panel, these sharp edges create a professional, "tool-like" aesthetic that aligns with the utilitarian design narrative.

## Components

### Buttons
- **Primary:** Solid black (light mode) or solid accent (dark mode). No border-radius. Text is uppercase Label-MD.
- **Secondary:** Transparent background with a 2px solid stroke. 

### Portfolio Cards
- **Structure:** Image-first. Title and category appear on hover (desktop) or directly below the image (mobile). 
- **Transition:** Smooth opacity fade for metadata and a slight zoom-in effect on the image when focused.

### Input Fields (Admin)
- **Style:** Underlined or fully boxed with a 1px border. Focus state is indicated by a weight increase of the bottom border or a color shift to the primary accent.
- **Labels:** Always visible, positioned above the field in Label-MD.

### Chips/Tags
- **Style:** Small, rectangular boxes with light grey backgrounds and dark text. Used for "Categories" or "Materials" (e.g., #Resin, #Bronze).

### Lists
- **Admin:** Clean, row-based lists with divider lines and hover states for "Edit" and "Delete" actions. 
- **Public:** Minimalist bullet points or numbered lists with increased vertical padding.