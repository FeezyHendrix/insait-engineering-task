import useFunnelHover from '@/hook/useFunnelHover'
import { FunnelChartType } from '@/types/chart'
import { Fragment } from 'react'

interface FunnelItemType {
  value?: string
  name?: string
  step?: string
  tooltipX: number
  tooltipY: number
}

const FunnelToolTip = ({ tooltipX, value, tooltipY }: FunnelItemType) => {
  return (
    <Fragment>
      <rect
        x={tooltipX - 60}
        y={tooltipY}
        width='100'
        height='30'
        rx='7'
        fill='white'
      />
      <text
        x={tooltipX - 10}
        y={tooltipY + 15}
        textAnchor='middle'
        fill='#067CC1'
      >
        <tspan dy='0.355em'>{value}</tspan>
      </text>
    </Fragment>
  )
}

const First = ({ value, name, step, tooltipX }: FunnelItemType) => {
  const { isOpen, show, hide } = useFunnelHover()
  return (
    <g onMouseEnter={show} onMouseLeave={hide}>
      <Fragment>
        <linearGradient
          id='paint4_linear_85_445'
          x1='48.5232'
          y1='1.61411'
          x2='65.4919'
          y2='90.3671'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#49DE61' />
          <stop offset='1' stopColor='#2ECA8C' />
        </linearGradient>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M346.465 45H35.4521L0 1.00018L381.917 1.00022L346.465 45Z'
          fill='url(#paint4_linear_85_445)'
        />
        <text
          width='307.009900990099'
          height='50'
          orientation='vertical'
          stroke='none'
          x='186.5'
          y='25'
          textAnchor='middle'
          fill='#FFFFFF'
        >
          <tspan x='186.5' dy='0.355em'>
            {name}
          </tspan>
        </text>

        <path
          d='M381.54 0H655L618.46 45H345L381.54 0Z'
          fill='url(#paint9_linear_85_445)'
        />
        <text
          offset='5'
          width='78.55813953488371'
          height='50'
          orientation='vertical'
          stroke='none'
          x='503.4418604651163'
          y='22'
          textAnchor='start'
          fill='#3A3A3A'
        >
          <tspan x='440' dy='0.355em'>
            {step}
          </tspan>
        </text>

        <linearGradient
          id='paint9_linear_85_445'
          x1='345'
          y1='42.4038'
          x2='476.899'
          y2='-93.9343'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#61DDAA' stopOpacity='0.4' />
          <stop offset='1' stopColor='#61DDAA' stopOpacity='0' />
        </linearGradient>

        {isOpen && (
          <FunnelToolTip tooltipX={tooltipX} tooltipY={5} value={value} />
        )}
      </Fragment>
    </g>
  )
}

const Second = ({ value, name, step, tooltipX }: FunnelItemType) => {
  const { isOpen, show, hide } = useFunnelHover()

  return (
    <g onMouseEnter={show} onMouseLeave={hide}>
      <linearGradient
        id='paint3_linear_85_445'
        x1='88.6664'
        y1='48.7562'
        x2='102.951'
        y2='151.446'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#1BA3F2' />
        <stop offset='1' stopColor='#067CC1' />
      </linearGradient>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M343.179 48L306.921 93H73.2582L37.0002 48L343.179 48Z'
        fill='url(#paint3_linear_85_445)'
      />
      <text y='70' textAnchor='middle' fill='#FFFFFF'>
        <tspan x='188' dy='0.355em'>
          {name}
        </tspan>
      </text>

      <path
        d='M343.658 48H618L581.342 93H307L343.658 48Z'
        fill='url(#paint8_linear_85_445)'
      />
      <text
        offset='5'
        width='156.45348837209303'
        height='50'
        orientation='vertical'
        stroke='none'
        x='425.54651162790697'
        y='73'
        textAnchor='start'
        fill='#3A3A3A'
      >
        <tspan x='400' dy='0.355em'>
          {step}
        </tspan>
      </text>

      <linearGradient
        id='paint8_linear_85_445'
        x1='307'
        y1='90.4038'
        x2='438.884'
        y2='-46.3588'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#19A0EF' stopOpacity='0.26' />
        <stop offset='1' stopColor='#0E8BD4' stopOpacity='0' />
      </linearGradient>

      {isOpen && (
        <FunnelToolTip tooltipX={tooltipX} tooltipY={55} value={value} />
      )}
    </g>
  )
}

const Third = ({ value, name, step, tooltipX }: FunnelItemType) => {
  const { isOpen, show, hide } = useFunnelHover()

  return (
    <g onMouseEnter={show} onMouseLeave={hide}>
      <linearGradient
        id='paint2_linear_85_445'
        x1='235.088'
        y1='95.9998'
        x2='235.088'
        y2='141.19'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#66D3FF' />
        <stop offset='1' stopColor='#4FBEEC' />
      </linearGradient>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M304.828 95.9998L268.57 141H112.258L75.9998 95.9998L304.828 95.9998Z'
        fill='url(#paint2_linear_85_445)'
      />
      <text
        offset='5'
        width='204.3488372093023'
        height='50'
        orientation='vertical'
        stroke='none'
        x='286'
        y='120'
        textAnchor='middle'
        fill='#FFFFFF'
      >
        <tspan x='190' dy='0.355em'>
          {name}
        </tspan>
      </text>

      <path
        d='M304.54 96H578L541.46 141H268L304.54 96Z'
        fill='url(#paint7_linear_85_445)'
      />
      <linearGradient
        id='paint7_linear_85_445'
        x1='268'
        y1='138.404'
        x2='399.899'
        y2='2.06572'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#78D3F8' stopOpacity='0.4' />
        <stop offset='1' stopColor='#78D3F8' stopOpacity='0' />
      </linearGradient>
      <text
        offset='5'
        width='188.82558139534888'
        height='50'
        orientation='vertical'
        stroke='none'
        x='393.1744186046511'
        y='120'
        textAnchor='start'
        fill='#3A3A3A'
      >
        <tspan x='350' dy='0.355em'>
          {step}
        </tspan>
      </text>
      {isOpen && (
        <FunnelToolTip tooltipX={tooltipX} tooltipY={105} value={value} />
      )}
    </g>
  )
}

const Fourth = ({ value, name, step, tooltipX }: FunnelItemType) => {
  const { isOpen, show, hide } = useFunnelHover()

  return (
    <g onMouseEnter={show} onMouseLeave={hide}>
      <linearGradient
        id='paint1_linear_85_445'
        x1='159.653'
        y1='146.614'
        x2='197.826'
        y2='240.327'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#F8B11B' />
        <stop offset='1' stopColor='#FF6A37' />
      </linearGradient>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M265.866 145L229.609 190H152.258L116 145H265.866Z'
        fill='url(#paint1_linear_85_445)'
      />
      <text
        offset='5'
        width='192.2093023255814'
        height='50'
        orientation='vertical'
        stroke='none'
        x='2860'
        y='170'
        textAnchor='middle'
        fill='#FFFFFF'
      >
        <tspan x='190' dy='0.355em'>
          {name}
        </tspan>
      </text>

      <text
        offset='5'
        width='194.89534883720933'
        height='50'
        orientation='vertical'
        stroke='none'
        x='387.1046511627907'
        y='170'
        textAnchor='start'
        fill='#3A3A3A'
      >
        <tspan x='300' dy='0.355em'>
          {step}
        </tspan>
      </text>
      <path
        d='M265.54 145H539L502.46 190H229L265.54 145Z'
        fill='url(#paint6_linear_85_445)'
      />
      <linearGradient
        id='paint6_linear_85_445'
        x1='229.143'
        y1='187.404'
        x2='361.043'
        y2='51.1264'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#FFBF85' stopOpacity='0.4' />
        <stop offset='1' stopColor='#EBAF78' stopOpacity='0' />
      </linearGradient>
      {isOpen && (
        <FunnelToolTip tooltipX={tooltipX} tooltipY={155} value={value} />
      )}
    </g>
  )
}

const Fifth = ({ value, name, step, tooltipX }: FunnelItemType) => {
  const { isOpen, show, hide } = useFunnelHover()

  return (
    <g onMouseEnter={show} onMouseLeave={hide}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M154 193L190.258 238L226.516 193H154Z'
        fill='url(#paint0_linear_85_445)'
      />

      <text
        offset='5'
        width='65.55940594059406'
        height='50'
        orientation='vertical'
        stroke='none'
        x='200'
        y='212'
        textAnchor='middle'
        fill='#FFFFFF'
      >
        <tspan x='190' dy='0.355em'>
          {name}
        </tspan>
      </text>
      <text
        offset='5'
        width='244.46511627906978'
        height='50'
        orientation='vertical'
        stroke='none'
        x='337.5348837209302'
        y='218'
        textAnchor='start'
        fill='#3A3A3A'
      >
        <tspan x='250' dy='0.355em'>
          {step}
        </tspan>
      </text>

      <path
        d='M226.54 193H500L463.46 238H190L226.54 193Z'
        fill='url(#paint5_linear_85_445)'
      />
      <defs>
        <linearGradient
          id='paint0_linear_85_445'
          x1='234.932'
          y1='193'
          x2='234.932'
          y2='238.19'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#7262FD' />
          <stop offset='1' stopColor='#5745F3' />
        </linearGradient>

        <linearGradient
          id='paint5_linear_85_445'
          x1='190'
          y1='235.404'
          x2='321.899'
          y2='99.0657'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#7262FD' stopOpacity='0.4' />
          <stop offset='1' stopColor='#7262FD' stopOpacity='0' />
        </linearGradient>
      </defs>
      {isOpen && (
        <FunnelToolTip tooltipX={tooltipX} tooltipY={203} value={value} />
      )}
    </g>
  )
}

const Funnel = ({ data }: { data: FunnelChartType[] }) => {
  const viewBoxWidth = 555
  const viewBoxHeight = 238

  const calculateTooltipPosition = () => {
    const tooltipX = viewBoxWidth / 2
    const tooltipY = viewBoxHeight / 2

    return { tooltipX, tooltipY }
  }

  return (
    <div className='w-full mx-auto'>
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        {data.map((item, index) => {
          const { tooltipX, tooltipY } = calculateTooltipPosition()
          const Component = [First, Second, Third, Fourth, Fifth][index]

          return (
            <Component
              key={index}
              value={`${item.name}- ${item.value.toFixed(0)}`}
              name={item.value.toFixed(0)}
              step={item.step}
              tooltipX={tooltipX}
              tooltipY={tooltipY}
            />
          )
        })}
      </svg>
    </div>
  )
}

export default Funnel
