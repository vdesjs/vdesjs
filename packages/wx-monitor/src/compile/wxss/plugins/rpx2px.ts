export function rpx2px(options = {}) {
  const rpxReg = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)rpx/g;
  // @ts-ignore
  const baseUnit = options.baseUnit ? options.baseUnit : 1;
  return {
    postcssPlugin: 'postcss-rpxtopx',
    Declaration(decl) {
      if (!decl.value.includes('rpx')) return;
      decl.value = decl.value.replace(rpxReg, (m, $1) => {
        if (!$1) return m;
        let preValue = parseFloat($1);
        if (preValue) {
          preValue = preValue * baseUnit;
          return `${preValue}px`;
        } else {
          return '0';
        }
      });
    }
  };
}
