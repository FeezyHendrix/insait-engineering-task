import { useEffect, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { updateGlobalFilters } from '@/redux/slices/analytics';
import { RootState } from '@/redux/store';
import { dayHours } from '@/utils/data';
import { useTranslation } from 'react-i18next';
import { CiCalendar } from 'react-icons/ci';

export default function DateDropdown({startOrEnd}: {startOrEnd: 'start' | 'end'}) {
  const dispatch = useDispatch();
  const { t } = useTranslation()
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateTimeParam = (date: Dayjs | null) => {
    const updatedDate = date?.toDate();
    if (!updatedDate) return;
    const hours = dayHours[startOrEnd];
    updatedDate.setHours(hours[0], hours[1], hours[2], hours[3]);
    dispatch(updateGlobalFilters({ [`${startOrEnd}Date`]: updatedDate.toISOString() }));
  };
  const globalDates = useSelector((state: RootState) => state.analytics.globalFilters);
  const selectedDate = startOrEnd === 'start' ? globalDates.startDate : globalDates.endDate;

  useEffect(() => {
    if (startOrEnd === 'start' && globalDates.startDate && globalDates.endDate && globalDates.startDate > globalDates.endDate) {
      const updatedStartDate = dayjs(globalDates.endDate).startOf('day').toDate();
      dispatch(updateGlobalFilters({ startDate: updatedStartDate.toISOString() }));
    }
  }
  ,[globalDates.endDate]);

  useEffect(() => {
    if (startOrEnd === 'end' && globalDates.startDate && globalDates.endDate && globalDates.startDate > globalDates.endDate) {
      const updatedEndDate = dayjs(globalDates.startDate).endOf('day').toDate();
      dispatch(updateGlobalFilters({ endDate: updatedEndDate.toISOString() }));
    }
  }
  ,[globalDates.startDate]);

  const openCalender = () => setOpen(true)
  const closeCalender = () => setOpen(false)

  const formattedDate = selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : '';

  return (
    <div className='pl-1' ref={containerRef}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
      <DatePicker
        open={open}
        onOpen={openCalender}
        onClose={closeCalender}
        value={dayjs(selectedDate)}
        onChange={(newValue) => {
          updateTimeParam(newValue);
          closeCalender();
        }}
        format="DD/MM/YYYY"
        slots={{
          textField: ({ inputRef, error }) => {
            return (
              <div 
                className='flex border py-1.5 px-2 rounded-xl items-center gap-1 cursor-pointer w-40 md:w-auto overflow-hidden max-w-[250px] md:max-w-[22vw]'
                onClick={openCalender}
              >
                <p className='text-xs text-gray-400'>{t(`chart.${startOrEnd}Date`)}</p>
                <input
                  ref={inputRef}
                  className='w-36 outline-none border-none text-sm cursor-pointer'
                  readOnly
                  value={formattedDate}
                  onClick={openCalender}
                  aria-invalid={error ? 'true' : 'false'}
                />
                <div className='cursor-pointer' onClick={openCalender}>
                  <CiCalendar className='text-md text-gray-600' />
                </div>
              </div>
            );
          }
        }}
        slotProps={{
          popper: {
            anchorEl: containerRef.current,
            placement: 'bottom-start',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ],
          },
        }}
      />
      </DemoContainer>
      </LocalizationProvider>
    </div>
  );
}