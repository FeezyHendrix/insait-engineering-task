import DateDropdown from '../elements/DateSelector/DateDropdown';
import DateButton from '../elements/DateSelector/DateButton';
import { timeButtonSelectionType } from '@/types/chart';
import FlowSelect from '../elements/DateSelector/FlowSelect';

interface DateSelectPaneProps {
  className?: string;
}
const DateSelectPane = ({className = ''}: DateSelectPaneProps) => {
  const dropDownOptions: Array<'start' | 'end'> = ['start', 'end'];
  const timeFrameOptions: timeButtonSelectionType[] = ['today', 'lastWeek', 'lastMonth', 'lastYear', 'allTime', 'custom'];
  
  return (
    <section className={`sticky top-0 z-50 bg-white py-3 mb-2 px-2.5 me-3 w-full border-b ${className}`}>
      <div className="flex flex-col md:flex-row gap-2 items-baseline">
        <div className="flex gap-2">
          {dropDownOptions.map((option) => (
            <DateDropdown startOrEnd={option} key={option} />
          ))}
        </div>
        <DateButton timeFrameOptions={timeFrameOptions} />
        <FlowSelect />
      </div>
    </section>
  );
};

export default DateSelectPane;
