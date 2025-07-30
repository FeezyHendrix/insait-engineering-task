export const multipleBargradientDefinition = (
  firstID: string,
  secondID: string,
  thirdID: string
) => (
  <>
    <defs>
      <linearGradient
        id={firstID}
        x1='26.3'
        y1='3.39717'
        x2='107.194'
        y2='17.7517'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#1BA3F2' />
        <stop offset='1' stopColor='#067CC1' />
      </linearGradient>
    </defs>
    <defs>
      <linearGradient
        id={secondID}
        x1='-3.61607'
        y1='70.8929'
        x2='48.8654'
        y2='81.1452'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#49DE61' />
        <stop offset='1' stopColor='#2ECA8C' />
      </linearGradient>
    </defs>
    <defs>
      <linearGradient
        id={thirdID}
        x1='-3.61607'
        y1='70.8929'
        x2='48.8654'
        y2='81.1452'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#9132DC' />
        <stop offset='1' stopColor='#9132DC' />
      </linearGradient>
    </defs>
  </>
)

export const barChartGradientDefinition = (id: string) => (
  <>
    <defs>
      <linearGradient id={id} x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stopColor='#1BA3F2' />
        <stop offset='100%' stopColor='#067CC1' />
      </linearGradient>
    </defs>
  </>
)

export const createGradient = (
  id: string,
  startColor: string,
  stopColor: string
) => {
  return (
    <defs>
      <linearGradient id={id} x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stopColor={startColor} />
        <stop offset='100%' stopColor={stopColor} />
      </linearGradient>
    </defs>
  )
}
export const createGradientWithOpacity = (
  id: string,
  startColor: string,
  stopColor: string,
  startOpacity: number,
  stopOpacity: number
) => {
  return (
    <defs>
      <linearGradient id={id} x1='0' y1='0' x2='0' y2='1'>
        <stop
          offset='0%'
          stopColor={startColor}
          stopOpacity={`${startOpacity}`}
        />
        <stop
          offset='100%'
          stopColor={stopColor}
          stopOpacity={`${stopOpacity}`}
        />
      </linearGradient>
    </defs>
  )
}
