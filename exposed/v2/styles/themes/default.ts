const COLOR_RED = 'red';
const COLOR_TEXT_DEFAULT = '#696969';
const COLOR_ORANGE = 'rgba(255, 78, 43, 0.8)';
const COLOR_LIGHTBLUE = 'rgba(224, 255, 255, 0.6)';

export const themeDefault = {
  pageSpacing: '8px',
  spacing: '8px',
  borderRadius: '4px',
  spacingLight: 4,
  linearGradient: `linear-gradient(${COLOR_LIGHTBLUE}, white, ${COLOR_LIGHTBLUE})`,
  boxShadowSmooth: 'inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)',
  boxShadowAdvenced: '0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 2px 1px -1px rgb(0 0 0 / 12%), 0px 1px 3px 0px rgb(0 0 0 / 20%)',
  border: {
    color: {
      default: 'rgba(0, 0, 0, 0.2)',
      selected: COLOR_ORANGE,
    }
  },
  view: {
    backdrop: {
      primary: 'saturate(180%) blur(5px)',
    },
    background: {
      primary: 'white',
      secondary: 'white',
      hover: COLOR_LIGHTBLUE,
      loading: COLOR_LIGHTBLUE,
    }
  },
  text: {
    fontSize: {
      title: '16px',
      subtitle: '14px',
      label: '12px',
      description: '10px',
    },
    color: {
      primary: COLOR_TEXT_DEFAULT,
      colored: COLOR_ORANGE,
      secondary: '#000',
    }
  },
  button: {
    default: {
      border: {
        color: COLOR_ORANGE,
      },
      color: {
        default: COLOR_ORANGE,
        hoverDefault: 'white',
      },
      background: {
        default: 'white',
        hoverDefault: COLOR_ORANGE,
      },
    },
    danger: {
      border: {
        color: COLOR_RED,
      },
      color: {
        default: 'white',
        hoverDefault: COLOR_RED,
      },
      background: {
        default: COLOR_RED,
        hoverDefault: 'white',
      },
    }
  }
};

export type Theme = typeof themeDefault;
