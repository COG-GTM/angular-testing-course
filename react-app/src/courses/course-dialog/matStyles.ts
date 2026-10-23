/** Angular Material 19 (M2) `mat-raised-button`: 36px high, 14px/500, text not upper-cased. */
export const raisedButtonSx = {
  textTransform: 'none',
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: '0.0892857143em',
  lineHeight: '36px',
  height: 36,
  minWidth: 64,
  padding: '0 16px',
} as const;

/** Default-coloured M2 `mat-raised-button` (no `color`): white container, black label. */
export const defaultRaisedButtonSx = {
  ...raisedButtonSx,
  backgroundColor: '#fff',
  color: '#000',
  '&:hover': { backgroundColor: '#f5f5f5' },
} as const;

/** Angular Material 19 (M2) fill `mat-form-field` without a label: whitesmoke container, 16px padding, 22px subscript gap. */
export const matFormFieldSx = {
  display: 'block',
  width: '100%',
  mb: '22px',
  '& .MuiFilledInput-root': {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    fontSize: 16,
    lineHeight: '24px',
    letterSpacing: '0.5px',
    '&:hover, &.Mui-focused': { backgroundColor: '#ececec' },
  },
  // mat-form-field infix: 216px intrinsic content width (field = 248px), still shrinking/growing with the container.
  '& .MuiFilledInput-input': {
    height: 24,
    padding: '16px',
    width: 216,
    minWidth: 0,
    flex: '1 1 auto',
  },
  '& .MuiSelect-select.MuiFilledInput-input': {
    width: 200,
  },
  '& .MuiFilledInput-root.MuiInputBase-multiline': {
    padding: '16px',
  },
  '& .MuiFilledInput-root.MuiInputBase-multiline .MuiFilledInput-input': {
    padding: 0,
    height: 'auto',
    resize: 'vertical',
  },
  '& .MuiFilledInput-root.MuiInputBase-adornedEnd': {
    paddingRight: 0,
  },
  '& .MuiFilledInput-root.MuiInputBase-adornedEnd .MuiFilledInput-input': {
    paddingRight: 0,
    width: 176,
  },
  '& .MuiInputAdornment-root .MuiIconButton-root': {
    width: 48,
    height: 48,
    padding: '12px',
    margin: 0,
  },
} as const;
