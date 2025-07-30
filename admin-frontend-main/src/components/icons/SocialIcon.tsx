interface SocialIconType {
  image: string
  onClick: () => void
}

const SocialIcon = ({ image, onClick }: SocialIconType) => {
  return (
    <button
      onClick={onClick}
      className='bg-gray-outline social-icon flex justify-center items-center'
    >
      <img
        width={29}
        height={29}
        src={`src/assets/images/icons/${image}.svg`}
      />
    </button>
  )
}

export default SocialIcon
