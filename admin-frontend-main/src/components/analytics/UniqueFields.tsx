import { useAppDispatch } from "@/hook/useReduxHooks";
import { getChartDataWithDates, getUserInteractionChartData } from "@/redux/slices/analytics/request";
import { UniqueChartData, UniqueChartItem } from "@/types/chart";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MAX_PIE_CHART_ITEMS } from "@/utils/constants";
import ChartLoader from "../layout/ChartLoader";
import ChartFavoriteStar from "../elements/ChartFavoriteStar";

const UniqueFields = () => {
    const dispatch = useAppDispatch();
    const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
    const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
    const [charts, setCharts] = useState<UniqueChartData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchChartData = async () => {
        try {
            const { payload: response } = await dispatch(getChartDataWithDates({ startDate: globalDate.startDate, endDate: globalDate.endDate, chartType: "fetchUniqueEnumObjects", flowId: selectedFlow }));

            if (!response || !response.data) {
                throw new Error("Invalid response format");
            }

            const formattedCharts: UniqueChartData[] = response.data.map((item: {field:string; values: UniqueChartItem[]}) => {
                const totalCount = item.values.reduce((sum, v) => sum + v.count, 0);
                const sortedValues = [...item.values].sort((a, b) => b.count - a.count);
                const topCategories = sortedValues.slice(0, MAX_PIE_CHART_ITEMS);
                const otherCount = sortedValues.slice(MAX_PIE_CHART_ITEMS).reduce((sum, v) => sum + v.count, 0);

                const finalCategories = otherCount
                    ? [...topCategories, { key: "Other", count: otherCount }]
                    : topCategories;

                return {
                    label: item.field,
                    data: finalCategories.map((v: { key: string; count: number }) => ({
                        key: v.key,
                        count: ((v.count / totalCount) * 100).toFixed(2),
                    })),
                };
            });

            setCharts(formattedCharts);
        } catch (error) {
            toast.error("Error fetching unique fields data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [globalDate]);

    return (
        <>
            {charts.map((chart, index) => (
                <div key={index} className="col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[450px] md:h-[390px] pb-4 mb-8 md:mb-0">
                    <div className="col-span-1 h-full p-4 w-full rounded-xl bg-white">
                        <div>
                        <h4 className='text-xl capitalize bolder-text pt-4'>{chart.label} Distribution</h4>
                    </div>
                    {loading ? (
                        <p className="text-center text-gray-500 text-lg">Loading...</p>
                    ) : chart.data.length === 0 ? (
                        <p className="text-center text-gray-400 text-lg">No data available</p>
                    ) : (
                        <div className="flex-grow flex flex-col">
                        <ChartLoader type="analytics" hasData={chart.data.length > 0}>
                            <div className="flex-grow" style={{ maxHeight: "220px" }}>
                            <Chart
                                options={{
                                    labels: chart.data.map((d) => d.key),
                                    colors: ['#1BA3F2', '#49DE61', '#F8B11B', '#FF4560', '#775DD0', '#FF66A1', '#00E396', '#FF9800', '#0B8494'],
                                    tooltip: {
                                        enabled: true,
                                        theme: "light",
                                        y: {
                                            formatter: (val) => `${val}%`,
                                        },
                                    },
                                    dataLabels: { enabled: false },
                                    legend: {
                                        show: true,
                                        position: "bottom",
                                        fontSize: "11px",
                                        offsetY: -5,
                                        horizontalAlign: "center",
                                        markers: {
                                            width: 8,
                                            height: 8,
                                            radius: 0,
                                        },
                                        itemMargin: {
                                            horizontal: 8,
                                             vertical: 3,
                                             },
                                    },
                                    plotOptions: {
                                        pie: {
                                            expandOnClick: false,
                                            donut: {
                                                size: '70%',
                                            },
                                        },
                                    },
                                }}
                                series={chart.data.map((d) => Number(d.count) || 0)}
                                type="donut"
                                width="100%"
                                height="300px"
                            />
                            </div>
                        </ChartLoader>
                        </div>
                    )}
                </div>
                    </div>
            ))}
        </>
    );
};

export default UniqueFields;
