import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const TwoStack = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 80,
          height: 80,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <svg
          width="85"
          height="85"
          viewBox="0 0 51 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_40_269)">
            <path
              d="M38.6014 17.1579C41.7034 19.5441 40.9853 24.4081 37.3261 25.796L26.8501 29.7697C25.2282 30.3849 23.4033 30.1155 22.0283 29.0578L12.0998 21.4205C8.99772 19.0343 9.71581 14.1703 13.375 12.7824L23.851 8.80871C25.473 8.19349 27.2979 8.46291 28.6728 9.52057L38.6014 17.1579Z"
              fill="url(#paint0_linear_40_269)"
            />
            <path
              d="M38.6014 21.2766C41.7034 23.6628 40.9853 28.5268 37.3261 29.9148L26.8501 33.8884C25.2282 34.5036 23.4033 34.2342 22.0283 33.1765L12.0998 25.5392C8.99772 23.153 9.71581 18.289 13.375 16.9011L23.851 12.9274C25.473 12.3122 27.2979 12.5816 28.6728 13.6393L38.6014 21.2766Z"
              fill="url(#paint1_linear_40_269)"
              fillOpacity="0.75"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_40_269"
              x="0.147186"
              y="2.48364"
              width="50.4068"
              height="45.7298"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_40_269" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_40_269"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_40_269"
              x1="14.236"
              y1="3.67945"
              x2="43.6515"
              y2="36.5371"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3E87C9" />
              <stop offset="1" stopColor="#538CC1" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_40_269"
              x1="14.236"
              y1="7.79816"
              x2="43.6515"
              y2="40.6558"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0E355A" />
              <stop offset="1" stopColor="#538CC1" />
            </linearGradient>
          </defs>
        </svg>
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default TwoStack;
