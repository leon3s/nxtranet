export const themeDefault = {
  primaryBackground: 'white',
  backgroundGradient: 'linear-gradient(rgba(242, 242, 242, 1), rgba(230, 230, 230, 1))',
  backgroundGradientInverted: 'linear-gradient(rgba(230, 230, 230, 1), rgba(242, 242, 242, 1))',
  borderColorDefault: 'rgba(0, 0, 0, 0.2)',
  borderColorPrimary: 'rgba(253, 77, 43, 0.6)',
  boxShadowDefault: '0 2px 4px rgb(0 0 0 / 10%)',
  boxShadowSmooth: 'inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)',
  boxShadowSmoothRight: '1px 0px 0px 0px rgba(0, 0, 0, 0.1)',
  boxShadowAdvenced: '0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 2px 1px -1px rgb(0 0 0 / 12%), 0px 1px 3px 0px rgb(0 0 0 / 20%)',
  padding: {
    default: 16,
    light: 8,
  },
  borderRadius: 4,
  button: {
    primaryColor: 'rgba(255, 78, 43, 0.8)',
    primaryBorder: 'rgba(255, 78, 43, 0.8)',
    primaryBackground: 'white',
  },
  header: {
    backdrop: 'saturate(180%) blur(5px)',
    backgroundColor: 'hsla(0, 0%, 100%, 0.8)',
  },
  text: {
    primary: '#111',
    secondary: '#696969',
  },
  link: {
    colorPrimary: 'rgba(253, 77, 43, 0.8)',
    colorPrimaryHover: 'rgba(253, 77, 43, 0.6)',
  },
};

export type Theme = typeof themeDefault;
