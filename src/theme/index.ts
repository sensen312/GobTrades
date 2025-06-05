// src/theme/index.ts
import { createConfig } from '@gluestack-ui/themed';
import { config as defaultConfig } from '@gluestack-ui/config'; // Gluestack's default config

// Creates the Gluestack UI configuration object.
// Reasoning: Centralizes all styling tokens (colors, fonts, spacing, etc.)
// and component style overrides for a consistent and maintainable app theme.
export const config = createConfig({
  ...defaultConfig, // Start with Gluestack's defaults to ensure all components have base styles.
  tokens: {
    ...defaultConfig.tokens, // Include default tokens for colors, fonts, spacing, etc.
    colors: {
      ...defaultConfig.tokens.colors, // Keep default color palette for basic colors.

      // --- Custom Goblin Market Palette ---
      // Reasoning: Defines the specific color scheme for the app's unique aesthetic.
      // Naming convention: colorNameShade (e.g., goblinGreen500).
      goblinGreen50: '#F0FDF4', goblinGreen100: '#DCFCE7', goblinGreen200: '#BBF7D0',
      goblinGreen300: '#86EFAC', goblinGreen400: '#4ADE80', goblinGreen500: '#22C55E', // Primary action color
      goblinGreen600: '#16A34A', goblinGreen700: '#15803D', goblinGreen800: '#166534',
      goblinGreen900: '#14532D', goblinGreen950: '#052E16',

      goblinGold50: '#FFFBEB', goblinGold100: '#FEF3C7', goblinGold200: '#FDE68A',
      goblinGold300: '#FCD34D', goblinGold400: '#FBBF24', goblinGold500: '#F59E0B', // Secondary/accent color
      goblinGold600: '#D97706', goblinGold700: '#B45309', goblinGold800: '#92400E',
      goblinGold900: '#78350F', goblinGold950: '#451A03',

      parchment50: '#FEFDFB', parchment100: '#FBF8EF', parchment200: '#F5F0E0',
      parchment300: '#EDE8D0', // Main light background
      parchment400: '#E0D8C0', // Card background
      parchment500: '#D2C8B0', // Border color
      parchment600: '#B8AF9A',

      woodBrown50: '#FDFBF9', woodBrown100: '#F6F1ED', woodBrown200: '#EBE1DB',
      woodBrown300: '#D9C9BD', woodBrown400: '#C7B19F', woodBrown500: '#A1887F', // Muted text, borders
      woodBrown600: '#8D6E63', woodBrown700: '#795548', woodBrown800: '#6D4C41',
      woodBrown900: '#5D4037', woodBrown950: '#4E342E', // Dark text

      // --- Semantic Text Colors ---
      // Reasoning: Defines text colors based on their semantic meaning for consistency.
      textPrimary: '$woodBrown950',     // Dark brown for primary text
      textSecondary: '$woodBrown500',   // Lighter brown for secondary/muted text
      textLight: '$parchment100',     // For text on dark backgrounds
      textOnPrimary: '$parchment50', // Text on primary action buttons (goblinGreen500)
      textOnGold: '$woodBrown950',    // Text on gold accent elements
      textLink: '$goblinGreen700',    // Link color
      textDisabled: '$parchment600',     // Color for disabled text/elements

      // --- Functional Colors ---
      // Reasoning: Defines colors for UI states like error, success, warning, info.
      errorBase: defaultConfig.tokens.colors.red600 || '#DC2626',
      errorBg: defaultConfig.tokens.colors.red100 || '#FEE2E2',
      error700: defaultConfig.tokens.colors.red700 || '#B91C1C', // For darker error elements
      warningBase: '$goblinGold500',
      warningBg: '$goblinGold100',
      successBase: '$goblinGreen600',
      successBg: '$goblinGreen100',
      infoBase: defaultConfig.tokens.colors.blue500 || '#3B82F6',
      infoBg: defaultConfig.tokens.colors.blue100 || '#DBEAFE',

      // --- Component-Specific Semantic Colors ---
      // Reasoning: Defines colors used by specific components or UI areas.
      backgroundLight: '$parchment200', // Main screen background (slightly off-white parchment)
      backgroundCard: '$parchment300',   // Card backgrounds (a bit darker parchment)
      backgroundModal: '$parchment100', // Modal backgrounds (lighter parchment)
      inputBackground: '$parchment50',   // Input field background
      inputBorder: '$parchment600',       // Default input border
      inputPlaceholder: '$woodBrown500',// Placeholder text color
      tagBg: '$goblinGold400',           // Background for tags
      tagText: '$woodBrown950',           // Text color for tags
      iconColor: '$woodBrown800',         // Default icon color
      iconColorMuted: '$woodBrown500',   // Muted icon color
      likedHeart: '$errorBase',           // Color for a "liked" heart icon
      modalOverlay: 'rgba(45, 56, 38, 0.75)', // Dark, slightly transparent green overlay
      marketClosedOverlay: 'rgba(54, 48, 42, 0.9)', // Darker, more opaque overlay for market closed
      shadowColor: '$woodBrown950',       // Shadow color
      borderLight: '$parchment500',       // General light border color
    },
    fonts: {
      ...defaultConfig.tokens.fonts,
      // Reasoning: Defines custom fonts as per project aesthetic.
      // These must be loaded via useLoadAssets.ts.
      heading: 'MedievalSharp-Regular', // Custom heading font
      body: 'Lato-Regular',             // Custom body font
      mono: defaultConfig.tokens.fonts.mono || 'monospace', // Fallback for mono
    },
    // Spacing, radii, borderWidths, fontSizes, lineHeights, fontWeights, opacity
    // are inherited from defaultConfig.tokens but can be overridden here if needed.
    // Example: Ensure consistent radii for rounded corners.
    radii: {
      ...defaultConfig.tokens.radii,
      'none': 0, 'xs': 2, 'sm': 4, 'md': 6, 'lg': 8, 'xl': 12, '2xl': 16, '3xl': 24, 'full': 9999,
    },
    fontSizes: { // Example override for slightly larger base sizes
        ...defaultConfig.tokens.fontSizes,
        'xs': 12, 'sm': 14, 'md': 16, 'lg': 18, 'xl': 20,
        '2xl': 24, '3xl': 28, '4xl': 32, '5xl': 38, '6xl': 48,
    },
    lineHeights: { // Added for completeness
        ...defaultConfig.tokens.lineHeights,
        'xs': 16, 'sm': 18, 'md': 22, 'lg': 26, 'xl': 30,
    },
  },
  aliases: {
    ...defaultConfig.aliases,
    // Reasoning: Custom aliases can simplify common style combinations.
    // 'card-base': 'bg-backgroundCard rounded-md borderWidth-1 borderColor-borderLight shadow-md p-3',
  },
  // Component-specific theme overrides.
  // Reasoning: Allows fine-tuning the default appearance and props of Gluestack UI components.
  components: {
    Button: {
      // Reasoning: Customizes button appearance to fit the theme.
      theme: {
        borderRadius: '$md',
        borderWidth: 1,
        _text: {
          fontFamily: '$heading',
          fontWeight: '$semibold', // Gluestack might use different weight keys
          fontSize: '$md',
        },
        variants: {
          variant: {
            solid: {
              bg: '$goblinGreen600', // Primary action buttons
              borderColor: '$goblinGreen700',
              _text: { color: '$textOnPrimary' },
              ':hover': { bg: '$goblinGreen700' },
              ':active': { bg: '$goblinGreen800' },
              ':disabled': { opacity: 0.6, bg: '$goblinGreen400' }, // Clearer disabled state
            },
            outline: {
              borderWidth: 1, // Ensure outline has a border
              borderColor: '$goblinGreen600',
              bg: 'transparent',
              _text: { color: '$goblinGreen700' },
              ':hover': { bg: '$goblinGreen100' },
              ':active': { bg: '$goblinGreen200' },
              ':disabled': { opacity: 0.5, borderColor: '$goblinGreen300', _text: { color: '$goblinGreen300'} },
            },
          },
          action: { // For semantic button variations
            secondary: { // Example for a secondary action button
              bg: '$goblinGold500', borderColor: '$goblinGold600',
              _text: { color: '$textOnGold' },
              ':hover': { bg: '$goblinGold600' }, ':active': { bg: '$goblinGold700' },
              ':disabled': { opacity: 0.6, bg: '$goblinGold400' },
            },
            negative: { // For destructive actions like "Delete"
              bg: '$errorBase', borderColor: '$error700',
              _text: { color: '$textLight' },
              ':hover': { bg: '$error700' }, ':active': { bg: (defaultConfig.tokens.colors.red800 || '#991B1B') }, // Ensure red800 exists or use a direct value
              ':disabled': { opacity: 0.6, bg: '$errorBase' },
            }
          },
        },
        defaultProps: {
          variant: 'solid', // Default button variant
          size: 'md',
        },
      },
    },
    Input: {
      // Reasoning: Customizes input field appearance.
      theme: {
        variants: {
          variant: {
            outline: {
              bg: '$inputBackground',
              borderWidth: 1,
              borderColor: '$inputBorder',
              borderRadius: '$sm',
              _input: { // Styles for the actual text input part
                color: '$textPrimary',
                fontFamily: '$body',
                placeholderTextColor: '$inputPlaceholder',
                fontSize: '$md',
                p: '$3', // Padding inside the input field
              },
              ':hover': { borderColor: '$woodBrown600' },
              ':focus': { borderColor: '$goblinGreen500', borderWidth: 2 }, // Highlight focus
              ':invalid': { borderColor: '$errorBase', borderWidth: 2 },
              ':disabled': { opacity: 0.5, bg: '$parchment200' },
            },
          },
        },
        defaultProps: {
          variant: 'outline',
          size: 'md',
        },
      },
    },
    Textarea: {
      // Reasoning: Customizes textarea appearance, similar to Input.
      theme: {
        variants: {
          variant: {
            outline: {
              bg: '$inputBackground',
              borderWidth: 1,
              borderColor: '$inputBorder',
              borderRadius: '$sm',
              _input: { // Styles for the actual text input part
                color: '$textPrimary',
                fontFamily: '$body',
                placeholderTextColor: '$inputPlaceholder',
                fontSize: '$md',
                p: '$3',
                textAlignVertical: 'top', // Important for multi-line input
              },
              ':hover': { borderColor: '$woodBrown600' },
              ':focus': { borderColor: '$goblinGreen500', borderWidth: 2 },
              ':invalid': { borderColor: '$errorBase', borderWidth: 2 },
              ':disabled': { opacity: 0.5, bg: '$parchment200' },
            },
          },
        },
        defaultProps: {
          variant: 'outline',
          size: 'md',
        },
      },
    },
    Text: {
      // Reasoning: Sets default font and color for general text.
      theme: {
        defaultProps: {
          fontFamily: '$body',
          color: '$textPrimary',
          fontSize: '$md',
          lineHeight: '$md', // Example, adjust as needed
        },
      },
    },
    Heading: {
      // Reasoning: Sets default font and color for headings.
      theme: {
        defaultProps: {
          fontFamily: '$heading',
          color: '$textPrimary',
          fontWeight: '$bold', // Gluestack uses 'bold'
          lineHeight: '$xl', // Example, adjust as needed
        },
      },
    },
    Badge: {
        // Reasoning: Styles for tags and other badge-like elements.
        theme: {
            defaultProps: {
                size: 'md', // Slightly larger default badges
                variant: 'solid',
                action: 'info', // Default semantic meaning
                borderRadius: '$sm',
            },
            variants: {
                action: {
                    info: { // Default style, used for tags
                        bg: '$tagBg',
                        borderColor: '$goblinGold600',
                        borderWidth: 1,
                        _text: { color: '$tagText', fontFamily: '$body', fontSize: '$sm', fontWeight: '$semibold' },
                    },
                    // Add other actions like 'success', 'error', 'warning' if needed
                },
            },
        },
    },
    ModalContent: { // Targeting ModalContent for overall modal styling
        // Reasoning: Customizes modal appearance.
        theme: {
            bg: '$backgroundModal',
            borderRadius: '$lg', // More rounded modals
            borderWidth: 2,
            borderColor: '$woodBrown600',
            p: '$0', // Remove padding from content, apply to header/body/footer
            shadowColor: '$shadowColor',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5, // Android shadow
        }
    },
    ModalHeader: {
        theme: {
            borderBottomWidth: 1,
            borderColor: '$borderLight',
            p: '$4', // Add padding here
        }
    },
    ModalBody: {
        theme: {
            p: '$4', // Add padding here
        }
    },
    ModalFooter: {
        theme: {
            borderTopWidth: 1,
            borderColor: '$borderLight',
            p: '$4', // Add padding here
        }
    },
    ModalCloseButton:{
        theme: {
            _icon:{ color: '$iconColorMuted'},
            ':hover': { bg: '$parchment400' },
            ':active': { bg: '$parchment500' },
        }
    },
    Checkbox: {
        // Reasoning: Styles for checkboxes used in forms/filters.
        theme: {
            size: 'md',
            _indicator: {
                borderRadius: '$xs',
                borderWidth: 2,
                borderColor: '$woodBrown500',
                bg: '$parchment100', // Unchecked background
                ':checked': {
                    bg: '$goblinGreen500',
                    borderColor: '$goblinGreen700',
                },
                ':hover': {
                    borderColor: '$goblinGreen500',
                    ':checked': { borderColor: '$goblinGreen700' },
                },
                ':disabled': {
                    opacity: 0.5,
                    borderColor: '$borderLight',
                    bg: '$parchment200',
                    ':checked': {
                        bg: '$goblinGreen300',
                        borderColor: '$goblinGreen400',
                    }
                },
            },
            _icon: {
                color: '$textOnPrimary', // Checkmark color
            },
            _label: {
                color: '$textPrimary',
                fontFamily: '$body',
                fontSize: '$md',
                ml: '$2',
            },
        },
    },
    Avatar: {
        // Reasoning: Styles for user profile pictures.
        theme: {
            borderRadius: '$full',
            borderWidth: 2,
            borderColor: '$woodBrown600', // Darker border for definition
            bg: '$parchment400', // Fallback background
            _text: { // Fallback text style
                fontFamily: '$heading',
                fontWeight: '$bold',
                color: '$textPrimary',
            },
        },
    },
    // Other components like Select, Radio, Switch, Tooltip, Menu can be themed here if used.
  },
});

// TypeScript augmentation to make the custom config available to Gluestack UI components.
// Reasoning: Ensures TypeScript understands the custom tokens and component styles.
type ConfigTypeTheme = typeof config; // Renamed to avoid conflict
declare module '@gluestack-ui/themed' {
  interface UIConfig extends ConfigTypeTheme {}
}
