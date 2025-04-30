// File: src/theme/index.ts
import { createConfig } from '@gluestack-ui/themed';
import { config as defaultConfig } from '@gluestack-ui/config';

// Creates the Gluestack UI configuration object.
export const config = createConfig({
  ...defaultConfig, // Start with Gluestack's defaults
  tokens: {
    ...defaultConfig.tokens, // Include default tokens
    colors: {
      ...defaultConfig.tokens.colors, // Keep default color palette

      // --- Goblin Market Palette ---
      goblinGreen50: '#F1F5F1', goblinGreen100: '#E3EBE3', goblinGreen200: '#C8D7C7',
      goblinGreen300: '#ABC3AA', goblinGreen400: '#8EAF8D', goblinGreen500: '#6A8B69',
      goblinGreen600: '#567155', goblinGreen700: '#435842', goblinGreen800: '#303F2F',
      goblinGreen900: '#1D261C', goblinGreen950: '#0E130E',

      goblinGold50: '#FFFBEB', goblinGold100: '#FEF3C7', goblinGold200: '#FDE68A',
      goblinGold300: '#FCD34D', goblinGold400: '#FBBF24', goblinGold500: '#D97706',
      goblinGold600: '#B45309', goblinGold700: '#92400E', goblinGold800: '#78350F',
      goblinGold900: '#602808', goblinGold950: '#4C2006',

      parchment50: '#FEFDFB', parchment100: '#FBF8EF', parchment200: '#F5F0E0',
      parchment300: '#EDE8D0', parchment400: '#E0D8C0', parchment500: '#D2C8B0',
      parchment600: '#B8AF9A',

      woodBrown50: '#F7F3F1', woodBrown100: '#EBE1DB', woodBrown200: '#D9C9BD',
      woodBrown300: '#C7B19F', woodBrown400: '#B59A81', woodBrown500: '#8B4513',
      woodBrown600: '#7A3C10', woodBrown700: '#69330D', woodBrown800: '#582A0A',
      woodBrown900: '#472107', woodBrown950: '#261104',

      // --- Text Colors ---
      textPrimary: '#3A302A', textSecondary: '#6E5E54', textLight: '#F5F0E0',
      textOnPrimary: '$parchment100', textOnGold: '$woodBrown950', textLink: '$goblinGreen700',

      // --- Functional Colors ---
      // Define base colors directly if they aren't simple shades
      errorBase: '#B91C1C', // Direct hex for errorBase
      errorBg: '#FEE2E2',
      error700: '#991B1B', // Ensure this exists if used elsewhere
      warningBase: '$goblinGold600', warningBg: '$goblinGold100',
      successBase: '#047857', successBg: '$goblinGreen100',
      infoBase: defaultConfig.tokens.colors.info500 || '#2563EB', // Fallback if needed
      infoBg: defaultConfig.tokens.colors.info100 || '#DBEAFE', // Fallback if needed

      // --- Component Specifics ---
      backgroundLight: '$parchment300', backgroundCard: '$parchment400', backgroundModal: '$parchment200',
      inputBackground: '$parchment100', inputBorder: '$woodBrown500', inputPlaceholder: '$textSecondary',
      tagBg: '$goblinGold500', tagText: '$textOnGold', iconColor: '$textPrimary',
      iconColorMuted: '$textSecondary', likedHeart: '$errorBase', // Can use errorBase hex directly
      modalOverlay: 'rgba(45, 56, 38, 0.75)', marketClosedOverlay: 'rgba(54, 48, 42, 0.9)',
      shadowColor: '$woodBrown950',
      textDisabled: '$textSecondary',
      borderLight: '$parchment500', // Ensure borderLight is defined
    },
    fonts: {
      ...defaultConfig.tokens.fonts,
      heading: 'MedievalSharp-Regular',
      body: 'Lato-Regular',
      mono: 'monospace',
    },
    space: {
      ...defaultConfig.tokens.space,
    },
    radii: { // Define radii as numbers if possible, otherwise parse later
      ...defaultConfig.tokens.radii,
      'none': 0, 'xs': 2, 'sm': 4, 'md': 6, 'lg': 8, 'xl': 12, '2xl': 16, '3xl': 24, 'full': 9999,
    },
    borderWidths: {
      ...defaultConfig.tokens.borderWidths,
    },
    fontSizes: {
      ...defaultConfig.tokens.fontSizes,
       'xs': 10, 'sm': 12, 'md': 14, 'lg': 16, 'xl': 18,
       '2xl': 20, '3xl': 24, '4xl': 30, '5xl': 36, '6xl': 48,
    },
    lineHeights: {
       ...defaultConfig.tokens.lineHeights,
       'xs': 14, 'sm': 16, 'md': 20, 'lg': 24, 'xl': 28,
       '2xl': 30, '3xl': 36, '4xl': 44, '5xl': 50, '6xl': 64,
    },
    fontWeights: {
       ...defaultConfig.tokens.fontWeights,
    },
    opacity: {
        ...defaultConfig.tokens.opacity,
    },
  },
  aliases: { // Aliases are shortcuts, ensure they use defined tokens
    ...defaultConfig.aliases,
    'card-base': 'bg-backgroundCard rounded-md borderWidth-1 borderColor-borderLight shadow-md p-3',
    'modal-content-base': 'bg-backgroundModal rounded-lg shadow-lg borderWidth-2 borderColor-woodBrown500 p-4',
    'h1': 'font-heading text-4xl font-bold text-textPrimary mb-4',
    'h2': 'font-heading text-3xl font-bold text-textPrimary mb-3',
    'h3': 'font-heading text-2xl font-semibold text-textPrimary mb-2',
    'body-text': 'font-body text-md text-textPrimary leading-lg',
    'small-text': 'font-body text-sm text-textSecondary',
    'error-text': 'font-body text-sm text-errorBase',
    'input-field-base': 'font-body text-md text-textPrimary',
  },
  components: {
    Button: {
      // Assuming Button theme is mostly correct from original
      theme: {
        borderRadius: '$sm',
        borderWidth: '$1',
        _text: {
          fontFamily: '$heading',
          fontWeight: '$semibold',
          fontSize: '$md',
        },
        variants: {
          variant: {
            solid: {
              bg: '$goblinGreen500', borderColor: '$goblinGreen700',
              _text: { color: '$textOnPrimary' },
              ':hover': { bg: '$goblinGreen600' }, ':active': { bg: '$goblinGreen700' },
              ':disabled': { opacity: 0.6, bg: '$goblinGreen500' },
            },
            outline: {
              borderWidth: '$1', borderColor: '$goblinGreen500', bg: 'transparent',
              _text: { color: '$goblinGreen700' },
              ':hover': { bg: '$goblinGreen100' }, ':active': { bg: '$goblinGreen200' },
              ':disabled': { opacity: 0.5, borderColor: '$goblinGreen300', _text: { color: '$goblinGreen300'} },
            },
            link: {
              borderWidth: 0, p: 0,
              _text: { color: '$textLink', textDecorationLine: 'underline', fontWeight: '$normal' },
              ':hover': { _text: { color: '$goblinGreen700'} }, ':active': { _text: { color: '$goblinGreen800'} },
            },
            ghost: {
                borderWidth: 0, bg: 'transparent', _text: { color: '$textSecondary' },
                ':hover': { bg: '$parchment200' }, ':active': { bg: '$parchment400' },
            }
          },
          action: {
            secondary: {
              bg: '$goblinGold500', borderColor: '$goblinGold700', _text: { color: '$textOnGold' },
              ':hover': { bg: '$goblinGold600' }, ':active': { bg: '$goblinGold700' },
              ':disabled': { opacity: 0.6, bg: '$goblinGold500' },
            },
            negative: { // Used by ConfirmationPrompt
              bg: '$errorBase', borderColor: '$error700', _text: { color: '$textLight' },
              ':hover': { bg: '$error700' }, ':active': { bg: '$error800' }, // Assuming error800 exists or define it
              ':disabled': { opacity: 0.6, bg: '$errorBase' },
            }
          },
          size: {
              sm: { px: '$3', py: '$1.5', _text: { fontSize: '$sm' } },
              md: { px: '$4', py: '$2', _text: { fontSize: '$md' } },
              lg: { px: '$6', py: '$3', _text: { fontSize: '$lg' } },
          },
        },
        defaultProps: { variant: 'solid', size: 'md' },
      },
    },
    Input: { // Assuming Input theme is correct
      theme: {
        variants: {
          variant: {
            outline: {
              bg: '$inputBackground', borderWidth: 1, borderColor: '$inputBorder', borderRadius: '$sm',
              _input: { color: '$textPrimary', fontFamily: '$body', placeholderTextColor: '$inputPlaceholder', fontSize: '$md', p: '$3' },
              ':hover': { borderColor: '$woodBrown600' },
              ':focus': { borderColor: '$goblinGreen500' },
              ':invalid': { borderColor: '$errorBase' },
              ':disabled': { opacity: 0.5, bg: '$parchment200' },
            },
          },
        },
        defaultProps: { variant: 'outline', size: 'md' },
      },
    },
    // --- ADDED/CORRECTED Textarea Theme ---
    Textarea: {
        theme: {
             variants: {
                variant: {
                    // Explicitly define the 'outline' variant for Textarea
                    outline: {
                        bg: '$inputBackground',
                        borderWidth: 1,
                        borderColor: '$inputBorder',
                        borderRadius: '$sm',
                        _input: {
                           color: '$textPrimary',
                           fontFamily: '$body',
                           placeholderTextColor: '$inputPlaceholder',
                           fontSize: '$md',
                           p: '$3',
                           textAlignVertical: 'top' // Good for text areas
                        },
                        ':hover': { borderColor: '$woodBrown600' },
                        ':focus': { borderColor: '$goblinGreen500' },
                        ':invalid': { borderColor: '$errorBase' },
                        ':disabled': { opacity: 0.5, bg: '$parchment200' },
                    },
                    // Add other variants like 'filled' if needed
                },
                // You might need size variants if Textarea uses them differently
                // size: { ... }
            },
            // Set the default variant you want Textarea to use
            defaultProps: {
                variant: 'outline',
                size: 'md' // Assuming 'md' size is defined or inherited
            },
        }
    },
    Text: {
      theme: { defaultProps: { fontFamily: '$body', color: '$textPrimary', fontSize: '$md', lineHeight: '$md' } },
    },
    Heading: {
      theme: { defaultProps: { fontFamily: '$heading', color: '$textPrimary', fontWeight: '$bold', lineHeight: '$xl'} },
    },
    Badge: { // Assuming Badge theme is correct
      theme: {
        defaultProps: {
          size: 'sm', variant: 'solid', action: 'info',
          borderRadius: '$xs', borderWidth: 1, borderColor: '$goblinGold700',
        },
        variants: {
          action: {
            info: {
              bg: '$tagBg',
              _text: { color: '$tagText', fontFamily: '$body', fontSize: '$xs', fontWeight: '$semibold', px: '$1.5', py: '$0.5' },
            },
             outline: {
                 bg: 'transparent', borderColor: '$tagBg', borderWidth: 1,
                 _text: { color: '$tagBg', fontFamily: '$body', fontSize: '$xs', fontWeight: '$semibold', px: '$1.5', py: '$0.5' },
             }
          },
        },
      },
    },
    Modal: { // Assuming Modal theme is correct
        theme: {
            defaultProps: { size: 'lg' },
            _backdrop: { bg: '$modalOverlay' },
            _content: {
                bg: '$backgroundModal', borderRadius: '$md', borderWidth: 2, borderColor: '$woodBrown500',
                p: '$5', shadowColor: '$shadowColor', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
            },
            _header: { borderBottomWidth: 1, borderColor: '$borderLight', pb: '$3', mb: '$4' },
            _body: { py: '$2' },
            _footer: { borderTopWidth: 1, borderColor: '$borderLight', pt: '$4', mt: '$4' },
            _closeButton: {
                p: '$1', borderRadius: '$full', bg: 'transparent',
                _icon: { color: '$iconColorMuted' },
                ':hover': { bg: '$parchment400' },
                ':active': { bg: '$parchment500' },
            },
        },
    },
    Checkbox: { // Assuming Checkbox theme is correct
        theme: {
            size: 'md',
            _indicator: {
                borderRadius: '$xs', borderWidth: 2, borderColor: '$woodBrown500', bg: '$parchment100',
                ':checked': { bg: '$goblinGreen500', borderColor: '$goblinGreen700' },
                ':hover': { borderColor: '$goblinGreen500', ':checked': { borderColor: '$goblinGreen700' } },
                ':disabled': { opacity: 0.5, borderColor: '$borderLight', bg: '$parchment200' },
            },
            _icon: { color: '$textOnPrimary' },
            _label: { color: '$textPrimary', fontFamily: '$body', fontSize: '$md', ml: '$2' },
        },
    },
    Avatar: { // Assuming Avatar theme is correct
        theme: {
            borderRadius: '$full', borderWidth: 2, borderColor: '$woodBrown500', bg: '$parchment400',
            _text: { fontFamily: '$heading', fontWeight: '$bold', color: '$textPrimary' },
        },
    },
    // Card component styles defined directly in Card.tsx or via alias 'card-base'
    // Select, Radio, Switch, Tooltip, Menu, etc. can be added here if needed
  },
});

// TypeScript augmentation
type Config = typeof config;
declare module '@gluestack-ui/themed' {
  interface UIConfig extends Config {}
}