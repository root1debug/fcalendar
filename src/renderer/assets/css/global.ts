import { css } from '@emotion/react';

export const bodyRoot = css`
  user-select: none;
  img {
    max-width: 100%;
    height: auto;
  }
`;

export const jumbo = css`
  padding: 5% 10%;
  z-index: 2;
  position: relative;
  h1 {
    font-size: 2rem;
  }
  p {
    font-size: 1.2rem;
  }
  strong {
    color: green;
  }
`;

export const mainLayout = css`
  height: 100vh;
  width: 100vw;
  display: grid;
  transition-duration: 0.2s;
  box-sizing: border-box;
  ul {
    
  }
`;

export default {
  bodyRoot,
  jumbo,
};
