import {
  CreateShapeProps,
  CustomToolTipType,
  HeatMapCustomTooltipParams,
  PieChartType,
  PlaceholderDataType,
} from '@/types/chart'
import { checkIfActiveArrray, findLargestValue, sortFunnelData } from '@/utils'
import {
  funnelChartPlaceholder,
  heatMapChartPlaceholder,
  monthlyChartPlaceholder,
  multiChartPlaceholder,
  pieChartPlaceholder,
  productChartPlaceholder,
  dayChartPlaceholder,
  weekChartPlaceholder,
  oneToFiveChartPlaceHolder,
  positiveAndNegativePlaceHolder,
  securityModuleCostPlaceHolder,
  averageLengthOfUserAndBotMessagesPlaceHolder,
  responseTimeFromAClientPlaceHolder,
  policyCounterPlaceHolder,
} from '@/utils/placeholder'
import { t } from 'i18next'

export const areaChartOptions = () => {
  return {
    chart: {
      zoom: {
        autoScaleYaxis: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: 'hollow',
    },
    xaxis: {
      type: 'datetime',
      min: new Date('05 Jan 2023').getTime(),
      tickAmount: 1,
      labels: {
        format: 'dd MMM yyyy',
      },
    },
    tooltip: {
      x: {
        format: 'MMM yyyy HH:mm',
      },
      fillSeriesColor: false,
      theme: 'light',
      style: {
        fontSize: '15px',
        fontFamily: 'Satoshi, sans-serif',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  }
}

export const heatMapOptions = () => {
  return {
    chart: {
      height: 350,
      toolbar: {
        show: false
      },
      background: 'transparent',
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fillSeriesColor: false,
      theme: 'light',
      style: {
        fontSize: '15px',
        fontFamily: 'Satoshi, sans-serif',
      },
      custom: ({ seriesIndex, dataPointIndex, w }: HeatMapCustomTooltipParams) => {
        const z = w.globals.initialSeries[seriesIndex].data[dataPointIndex].z
        const x = w.globals.initialSeries[seriesIndex].data[dataPointIndex].x
        return `<div class="px-2 py-1 mx-2 my-2">${x}: ${z}</div>`
      },
    },
    plotOptions: {
      heatmap: {
        enableShades: true,
        shadeIntensity: 0.5,
        cellSize: 45,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: heatMapRangeColors,
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    legend: {
      show: false,
    },
  }
}

export const conversationalsStatisticsHeatmap = () => {
  return {
    chart: {
      height: 350,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fillSeriesColor: false,
      theme: 'light',
      style: {
        fontSize: '15px',
        fontFamily: 'Satoshi, sans-serif',
      },
      custom: ({ seriesIndex, dataPointIndex, w }: any) => {
        const z = w.globals.initialSeries[seriesIndex].data[dataPointIndex].z;
        const x = w.globals.initialSeries[seriesIndex].data[dataPointIndex].x;
        return `<div class="px-2 py-1">${x}: ${z}</div>`;
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: conversationalsStatisticsheatMapRangeColors, 
        },
      },
    },
    legend: {
      show: false,
    },
  };
};

export const conversationalsStatisticsheatMapRangeColors = [
  { from: 1, to: 5, color: 'url(#gradientGreenLight)' },  
  { from: 6, to: 10, color: 'url(#gradientGreen)' },      
  { from: 11, to: 15, color: 'url(#gradientYellowGreen)' },
  { from: 16, to: 25, color: 'url(#gradientYellowLight)' },
  { from: 26, to: 35, color: 'url(#gradientYellow)' },    
  { from: 36, to: 45, color: 'url(#gradientYellowOrange)' }, 
  { from: 46, to: 55, color: 'url(#gradientOrangeLight)' }, 
  { from: 56, to: 65, color: 'url(#gradientOrange)' },    
  { from: 66, to: 75, color: 'url(#gradientRedOrange)' },  
  { from: 76, to: 85, color: 'url(#gradientRed)' },       
  { from: 86, to: 95, color: 'url(#gradientDarkRed)' },    
  { from: 96, to: 100, color: 'url(#gradientDeepRed)' } 
];


export const heatMapRangeColors = [
  { from: 0, to: 0, name: 'chart.heatmap.lowFrequency', color: '#ffffff' },
  { from: 1, to: 10, color: '#cfe2f3' },
  { from: 11, to: 20, color: '#9fc5e8' },
  { from: 21, to: 30, color: '#6faed6' },
  { from: 31, to: 40, color: '#4d85bd' },
  { from: 41, to: 50, color: '#2f62a5' },
  { from: 51, to: 65, color: '#1e4691' },
  { from: 66, to: 85, color: '#0c2c6d' },
  { from: 86, to: 100, name: 'chart.heatmap.highFrequency', color: '#000066' },
];



export const donutChartOptions = (
  fillColors: string[],
  labels: string[] | undefined,
  data: number[] | undefined,
  onClick?: (label: string) => void
) => {
  const indexOfLargest = findLargestValue(data)
  return {
    dataLabels: {
      enabled: false,
    },
    colors: fillColors,
    stroke: {
      width: 5,
    },
    noData: {
      text: 'No data available',
      style: {
        color: '#10b3e8',
        fontSize: '16px',
        fontFamily: 'Satoshi-Bold, sans-serif',
      },
    },
    responsive: [
      {
        breakpoint: 1200,
        options: {
          chart: {
            width: '100%',
          },
          legend: {
            position: 'bottom',
          },
          plotOptions: {
            pie: {
              offsetX: 0,
            },
          },
        },
      },
    ],
    legend: {
      fontSize: '15px',
      fontFamily: 'Satoshi, sans-serif',
      markers: {
        width: 14,
        height: 14,
        fillColors,
        radius: 2,
        offsetX: -5,
        offsetY: 2,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 10,
      },
      labels: {
        colors: [
          '#9298A4',
          '#9298A4',
          '#9298A4',
          '#9298A4',
          '#9298A4',
          '#9298A4',
          '#9298A4',
          '#9298A4',
          '#9298A4',
        ],
        useSeriesColors: false,
      },
    },
    plotOptions: {
      pie: {
        offsetX: -10,
        donut: {
          labels: {
            show: true,
            value: {
              show: true,
              formatter: function (val: string) {
                return Number(val).toFixed(0)
              },
            },
            total: {
              show: true,
              label: labels?.[indexOfLargest] || '0',
              color: fillColors[indexOfLargest] || '#000000',
              formatter: () => {
                return data?.[indexOfLargest]?.toFixed(0) || '0'
              },
            },
          },
        },
      },
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      }
    },
    labels,
    tooltip: {
      fillSeriesColor: false,
      theme: 'light',
      style: {
        fontSize: '15px',
        fontFamily: 'Satoshi, sans-serif',
      },
      y: {
        formatter: function (val: number) {
          return Number(val).toFixed(0)
        },
      },
    },
    chart: {
      events: {
        dataPointSelection: (
          _event: Event,
          _chartContext: any,
          config: any
        ) => {
          if (onClick) {
            const selectedLabel = config.w.config.labels[config.dataPointIndex]
            onClick(selectedLabel)
          }
        },
      },
    },
  }
}

export const CreateShape = ({ props, radius, id }: CreateShapeProps) => {
  const { x, y, width, height } = props
  return (
    <path
      d={`M${x},${y + radius} 
                     A${radius},${radius} 0 0 1 ${x + radius},${y} 
                     L${x + width - radius},${y} 
                     A${radius},${radius} 0 0 1 ${x + width},${y + radius} 
                     L${x + width},${y + height} 
                     L${x},${y + height} 
                     Z`}
      fill={`url(#${id})`}
    />
  )
}

export const CustomToolTip = ({
  payload,
  additionalText,
  numericFormat,
}: CustomToolTipType) => {
  let data = payload?.[0]?.payload
  const displayValue = numericFormat
    ? Number(data?.value).toFixed(0)
    : data?.value
  return (
    <p className='app-text-blue bg-white bold-text px-2 py-1 rounded-lg drop-shadow-md'>
      {`${displayValue} ${additionalText || ''}`}
    </p>
  )
}

export const axisTick = { fill: '#9298A4', fontSize: 14 }
export const toolTipConfig = { radius: 2, fill: '#b0cefc66', offset: 10 }

export const barchartMargin = {
  top: 5,
  right: 30,
  left: 50,
  bottom: 5,
}

export const getChartDataOrPlaceholder = (data: any, type: PlaceholderDataType) => {
  switch (type) {
    case 'pie':
      return checkIfActiveArrray(data?.label)
        ? formatPieData(data)
        : pieChartPlaceholder

    case 'product':
      return checkIfActiveArrray(data) ? data : productChartPlaceholder

    case 'month':
      return checkIfActiveArrray(data) ? data : monthlyChartPlaceholder

    case 'day':
      return checkIfActiveArrray(data) ? data : dayChartPlaceholder

    case 'weekly':
      return checkIfActiveArrray(data) ? data : weekChartPlaceholder

    case 'heatMap':
      return checkIfActiveArrray(data) ? data : heatMapChartPlaceholder

    case 'funnel':
      return checkIfActiveArrray(data)
        ? sortFunnelData(data)
        : funnelChartPlaceholder

    case 'multichart':
      return checkIfActiveArrray(data) ? data : multiChartPlaceholder

    case 'oneToFive':
      return checkIfActiveArrray(data) ? data : oneToFiveChartPlaceHolder

    case 'positive-negative':
      return checkIfActiveArrray(data) ? data : positiveAndNegativePlaceHolder

    case 'securityModuleCost':
      return checkIfActiveArrray(data) ? data : securityModuleCostPlaceHolder

    case 'averageLengthOfUserAndBotMessages':
      return checkIfActiveArrray(data) ? data : averageLengthOfUserAndBotMessagesPlaceHolder  

    case 'responseTimeFromAClient':
      return checkIfActiveArrray(data) ? data : responseTimeFromAClientPlaceHolder 
      
    case 'policyCounter':
      return checkIfActiveArrray(data) ? data : policyCounterPlaceHolder   

    default:
      return checkIfActiveArrray(data) ? data : []
  }
}

const formatPieData = (data: PieChartType): PieChartType => {
  const hasGreaterThanZero = data.data.some(value => value > 0)

  if (hasGreaterThanZero === false) {
    const newData: PieChartType = { label: [], data: [] }
    newData.label = data.label
    newData.data = data.data.map(item => item + 0.001)
    return newData
  }
  return data
}

export const funnelChartOptions = (categories: string[], integer: boolean | null) => {
  return {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opt: any) {
        return integer ? val : val + '%'
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 1,
        horizontal: true,
        barHeight: '70%',
        distributed: true,
        isFunnel: true,
        borderRadiusApplication: 'around',
      },
    },
    tooltip: {
      y: {
        title: {
          formatter: function() {
            return `${t('general.count')}:`
          }
        }
      }
    },
    xaxis: {   
      categories: categories,
    },
    legend: {
      show: true,
      // floating: true,
      position: 'right',
      horizontalAlign: 'center',
      
    },
    colors: ['#49DE61', '#1BA3F2', '#66D3FF', '#F8B11B', '#7262FD', '#000']

  }
};

export const exposureChartOptions = (categories: string[]) => {
  return {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        borderRadius: 1,
        horizontal: true,
        barHeight: '70%',
        distributed: true,
        isFunnel: true,
        borderRadiusApplication: 'around',
      },
    },
    xaxis: {   
      categories: categories,
    },
    legend: {
      show: true,
      position: 'right',
      horizontalAlign: 'center',
      
    },
    colors: ['#49DE61', '#1BA3F2', '#66D3FF', '#F8B11B', '#7262FD', '#000']

  }
}

export const barSizeAndRadius = {
  barSize: 20,
  radius: [4, 4, 0, 0]  as [number, number, number, number]
}