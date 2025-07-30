import MainContainerChart from '../MainContainerChart';
import { useAppSelector } from '@/hook/useReduxHooks';
const MainContainer = () => {       
    const metrics = useAppSelector(state => state.companyConfig.metrics);
    return (
        <section className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ${metrics?.length > 3 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
            {
                metrics.map((chart, index) => (
                    <MainContainerChart
                        key={index}
                        chartName={chart}
                        chartText={`dashboard.${chart}`}
                    />
                ))
            }
        </section>
    )
}    

export default MainContainer
