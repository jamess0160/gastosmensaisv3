import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataset, } from 'chart.js';
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ExpenseReportData } from '@/app/api/relatorios/controller/sections/POST/generateExpenseReports';
import { clientUtilsUseCases } from '@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export function ReportChart(props: ReportChartProps) {

    let maxValue = Math.max(...props.chartConfig.data.flatMap((item) => item.data))

    let qtdeLabels = props.chartConfig.data.length ? Math.max(props.chartConfig.labels.length, 1) : 4
    let qtdeSets = Math.max(props.chartConfig.data.length, 1.8)

    let minWidth = (qtdeSets / 1.8) * (qtdeLabels / 4) * 100

    if (minWidth < 100) {
        minWidth = 100
    }

    return (
        <div className="p-5 rounded w-1/2 overflow-x-auto m-auto aspect-video flex items-center border border-solid border-white max-md:w-full max-md:m-0 max-md:px-0" >
            <div
                style={{
                    minWidth: `${minWidth}%`,
                    height: "100%"
                }}
            >
                <Bar
                    options={{
                        aspectRatio: 0.5,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "left",
                                labels: {
                                    color: "white",
                                },
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
                                align: "start",
                                color: "white",
                                textStrokeWidth: 0.5,
                                textStrokeColor: "black",
                                font: {
                                    weight: 'bold',
                                    size: 15,
                                },
                                formatter(value: number) {
                                    return value ? `R$ ${value}` : ""
                                },
                            },
                        },
                        scales: {
                            y: {
                                grid: {
                                    color: "white",
                                },
                                ticks: {
                                    color: "white",
                                    callback(tickValue) {
                                        return `R$ ${tickValue}`
                                    },
                                },
                                max: Math.max(1, clientUtilsUseCases.roundTo(maxValue * 1.10, 10))
                            },
                            x: {
                                grid: {
                                    color: "white",
                                },
                                ticks: {
                                    color: "white",
                                },
                            }
                        }
                    }}
                    data={{
                        labels: props.chartConfig.labels,
                        datasets: props.chartConfig.data.map<ChartDataset<"bar", number[]>>((item) => {
                            return {
                                label: item.label,
                                data: item.data,
                                backgroundColor: item.color,
                                categoryPercentage: 0.9,
                            }
                        })
                    }}
                />
            </div>
        </div>
    )
}

interface ReportChartProps {
    chartConfig: ExpenseReportData['chartData']
}