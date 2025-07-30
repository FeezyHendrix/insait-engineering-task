import React from 'react'
import {
  Fade,
  InputAdornment,
  Slider,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface AbTestingSliderProps {
  value: number
  onChange: (value: number) => void
}

const AbTestingSlider: React.FC<AbTestingSliderProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation()
  const isZero = value === 0
  const inputColor = isZero ? '#ED6C03' : 'inherit'
  const sliderColor = isZero ? '#ED6C03' : '#10B2E8'

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const val = typeof newValue === 'number' ? newValue : newValue[0]
    onChange(Math.max(0, Math.min(100, val)))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    onChange(Math.max(0, Math.min(100, newValue)))
  }

  return (
    <div className='w-full'>
      <h3 className='text-base font-medium mb-2'>
        {t('configurations.ui.abTestingLabel')}
      </h3>

      <div
        className='grid grid-cols-1 
                lg:[grid-template-columns:4fr_auto] lg:gap-x-8 
                gap-y-4 
                items-center 
                w-full px-2'
      >
        <div>
          <Slider
            value={value}
            step={5}
            min={0}
            max={100}
            marks={[
              { value: 0, label: '0%' },
              { value: 25, label: '25%' },
              { value: 50, label: '50%' },
              { value: 75, label: '75%' },
              { value: 100, label: '100%' },
            ]}
            onChange={handleSliderChange}
            valueLabelDisplay='auto'
            sx={{ color: sliderColor, width: '100%' }}
          />
        </div>

        <div className='flex justify-end'>
          <TextField
            type='number'
            variant='outlined'
            size='small'
            value={value}
            onChange={handleInputChange}
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position='end'>%</InputAdornment>,
              },
              htmlInput: {
                min: 0,
                max: 100,
                step: 1,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-input': {
                color: inputColor,
                minWidth: '2rem',
              },
              '& .MuiOutlinedInput-root': {
                width: '100% !important',
              },
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              '& input[type=number]': {
                MozAppearance: 'textfield',
                appearance: 'none',
              },
            }}
          />
        </div>
      </div>

      <Fade in={isZero} timeout={200}>
        <Typography
          variant='body2'
          color='#ED6C03'
          sx={{ mt: 0.5, fontStyle: 'italic' }}
        >
          {t('configurations.ui.abTestingZeroWarning')}
        </Typography>
      </Fade>

      <p className='text-sm text-muted-foreground mt-1'>
        {t('configurations.ui.abTestingDesc1')}
      </p>
      <p className='text-xs text-muted-foreground mt-1'>
        {t('configurations.ui.abTestingDesc2')}
      </p>
    </div>
  )
}

export default AbTestingSlider
