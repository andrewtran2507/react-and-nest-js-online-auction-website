const tinycolor = require("tinycolor2");

const pxMapping = {};
for (let i = 0; i <= 200; i++) {
  pxMapping[i] = `${i}px`;
}

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#3D7368",
      secondary: "#000000",
      white: "#FFFFFF",
      blue: "#2F80ED",
      transparent: "transparent",
      placeholder: tinycolor("#000000").setAlpha(0.3).toRgbString(),
      skeleton: "#e2e8f0",
      background: "#EDEDED",
      red: '#E46239',
      "v-input-one": "#ecf1f0",
      "v-dot-slider": "#D9D9D9",
      "v-dot-slider-active": "#ffcc00",
      danger: "#ff3519",

    },
    fontFamily: {
      primaryBold: ["Muli Bold", "sans-serif"],
      primaryRegular: ["Muli Regular", "sans-serif"],
      primaryLight: ["Muli Light", "sans-serif"],
    },
    minHeight: {},
    minWidth: {},
    maxHeight: {},
    screens: {
      xs: { max: "576px" },

      sm: "576px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 1024px) { ... }

      xl: "1200px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
    },
    extend: {
      spacing: {
        "v-m-3": "-3px",
        15: "60px",
        78: "78px",
        82: "82px",
        100: "100px",
        114: "114px",
        200: "200px",
        242: "242px",
        320: "320px",
        340: "340px",
        507: "507px",
        587: "587px",
        full: "100%",
        screen: "100vh"
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0px",
        0.5: "0.5px",
        1: "1px",
        2: "2px",
        3: "3px",
        4: "4px",
        5: "5px",
        6: "6px",
        7: "7px",
        8: "8px",
      },
      fontSize: {
        10: ["0.625rem", { lineHeight: "0.875rem" }],
        12: ["0.75rem", { lineHeight: "1.25rem" }],
        14: ["0.875rem", { lineHeight: "1.125rem" }],
        15: ["0.875rem", { lineHeight: "1.375rem" }],
        16: ["1rem", { lineHeight: "1.625rem" }],
        18: ["1.125rem", { lineHeight: "1.5rem" }],
        20: ["1.25rem", { lineHeight: "1.875rem" }],
        24: ["1.5rem", { lineHeight: "2rem" }],
        30: ["1.875rem", { lineHeight: "2.625rem" }],
        32: ["2rem", { lineHeight: "2.625rem" }],
        36: ["2.25rem", { lineHeight: "3rem" }],
        "v-input-one": ["16px", { lineHeight: "20px", fontWeight: 400, }],
        "v-button": ["24px", { lineHeight: "30px", fontWeight: 700, }],
      },
      fontWeight: {
        thin: "100",
        extraLight: "200",
        light: "300",
        normal: "400",
        regular: "400",
        medium: "500",
        semiBold: "600",
        bold: "700",
        extraBold: "800",
        black: "900",
      },
      borderRadius: {
        "v-button": "38px",
      },
      borderColor: (theme) => ({
        ...theme("colors"),
      }),
      boxShadow: {
        sm: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      },
      zIndex: {
        '1': '1',
      },
      animation: {
        "spin-fast": "spin 700ms linear infinite",
      },
      width: {
        "v-input-one": "100%",
        "v-button": "239px",
        "v-fit-content": "fit-content",
      },
      maxWidth: {
        "507": "507px",
        "280px": "280px",
        "427px": "427px",
        "v-left-sign-in": "587px",
      },
      height: {
        "v-input-one": "56px",
        "v-button": "64px",
        "v-hyperlink-button": "30px",
        "280px": "280px",
      },
      gridTemplateColumns: {
        media: "repeat(auto-fit, minmax(250px, 1fr))",
      },
      translate: {},
      padding: {
        "v-input-one": ["18px 48px 18px 24px"],
        "v-badge": ["6px 20px"],
      },
      margin: {
        "v-input-icon": ["18px 26px 18px 0"]
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/line-clamp"),
  ],
};
