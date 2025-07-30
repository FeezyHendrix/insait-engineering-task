import { KnowledgeListHeaderType } from '@/types/knowledge'
import arrowDown from '@image/icons/arrowDown.svg'
import { useTranslation } from 'react-i18next';


const KnowledgeListHeader = (props: KnowledgeListHeaderType) => {
    const { t } = useTranslation()
    const toggleList = () => {        
        props.setListVisible(!props.listVisible)
    };

    return (
        <div className='pt-5 sticky top-0 mr-5 z-10 bg-white' >
        <p className='font-bold p-5 border rounded-lg bg-gray-outline' style={{ cursor: 'pointer' }} onClick={() => toggleList()}>
          {
            t('knowledge.knowledgebaseItemsCount', {
              count: props.displayData.filter(knowledge => 
                props.list === "active" ? knowledge.active : !knowledge.active
              ).length,
              status: props.list === "active" ? t('knowledge.active') : t('knowledge.inactive')
            })
          }
          <img
            className='cursor-pointer absolute top-10 end-5'
            src={arrowDown}
            alt='arrow-down'
            style={props.listVisible ? {transform: "rotate(180deg)"} : {}}
          />
        </p>
      </div>
    )
}

export default KnowledgeListHeader