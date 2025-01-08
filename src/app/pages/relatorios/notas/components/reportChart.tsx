import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ExpenseReportData } from '@/app/api/relatorios/controller/sections/POST/generateExpenseReports';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export function ReportChart(props: ReportChartProps) {
    return (
        <div className="p-5 rounded w-1/2 m-auto aspect-video flex items-center border border-solid border-white max-md:w-full max-md:m-0 max-md:px-0" >
            <Bar
                className="h-1/2"
                options={{
                    plugins: {
                        legend: {
                            labels: {
                                color: "white"
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label(tooltipItem) {
                                    tooltipItem.formattedValue = `R$ ${(tooltipItem.raw as number).toFixed(2)}`
                                },
                            }
                        },
                        datalabels: {
                            anchor: "end",
                            align: "top",
                            color: "white",
                            font: {
                                weight: 'bold',
                                size: 15,
                            },
                            formatter(value: number) {
                                return value ? `R$ ${value}` : ""
                            },
                        }
                    },
                    scales: {
                        y: {
                            grid: {
                                color: "white"
                            },
                            ticks: {
                                color: "white",
                                callback(tickValue) {
                                    return `R$ ${tickValue}`
                                },
                            }
                        },
                        x: {
                            grid: {
                                color: "white"
                            },
                            ticks: {
                                color: "white"
                            }
                        }
                    }
                }}
                data={{
                    labels: props.chartConfig.labels,
                    datasets: [
                        {
                            label: "Notas",
                            data: props.chartConfig.data,
                            backgroundColor: "rgb(46, 90, 119)"
                        }
                    ]
                }}
            />
        </div>
    )
}

interface ReportChartProps {
    chartConfig: ExpenseReportData['chartData']
}