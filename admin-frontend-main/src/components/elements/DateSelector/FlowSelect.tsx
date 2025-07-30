import { RootState } from '@/redux/store'
import { FlowOption } from '@/types/chart'
import { useDispatch, useSelector } from 'react-redux'
import SelectInput from '../SelectInput'
import { updateFlowSelection } from '@/redux/slices/analytics'
import { getFlows } from '@/redux/slices/analytics/request'
import { useEffect, useState } from 'react'

const FlowSelect = () => {
  const dispatch = useDispatch();
  const allFlowsOption: FlowOption = {
    label: "All Flows",
    value: "allFlows"
  }
  const [flowOptions, setFlowOptions] = useState<FlowOption[]>([allFlowsOption]);

  const selectedFlowId = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
  const fetchFlows = async () => {
    const flows: ({id: string, name: string} | null)[] = await getFlows();
    const formattedFlows = flows.map((flow: { id: string, name: string } | null) => ({
      label: flow?.name || "No Flow",
      value: flow?.id || "noFlow"
    }));
    setFlowOptions([allFlowsOption, ...formattedFlows]);
  };

  const updateSelectedFlow = (flowId: string) => {
   dispatch(updateFlowSelection({flowId}));
  };

  useEffect(() => {
    fetchFlows();
  }, []);
  
  return (
    <>
    {
      flowOptions.length > 1 && 
        <SelectInput 
        placeholder={""}
        value={selectedFlowId || "allFlows"}
        data={flowOptions}
        onValueChange={(value) => {
          updateSelectedFlow(value)
        }}
        extraClass={'px-4 py-1.5 min-w-[150px]'}
        textClass={'text-sm'}
      />
    }
    </>
  )
}

export default FlowSelect
