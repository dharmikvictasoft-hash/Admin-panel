import { useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import ChartTab from "../common/ChartTab";
import { CalenderIcon } from "../../icons";

export default function StatisticsChart() {
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [sevenDaysAgo, today],
      clickOpens: true,

      appendTo: document.body,
      position: "auto",

      prevArrow:
        '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
      nextArrow:
        '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    });

    return () => fp.destroy();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 80);

    return () => clearTimeout(t);
  }, []);

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { format: "dd MMM yyyy" },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
    },
  };

  const series = [
    { name: "Sales", data: [180,190,170,160,175,165,170,205,230,210,240,235] },
    { name: "Revenue", data: [40,30,50,40,55,40,70,100,110,120,150,140] },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Target you've set for each month
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ChartTab />
          <div className="relative inline-flex items-center">
            <CalenderIcon className="absolute lg:left-3 left-1/2 top-1/2 -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 size-5 text-gray-500 pointer-events-none z-10" />
            <input
              ref={datePickerRef}
              readOnly
              className="h-10 w-10 lg:w-40 lg:pl-10 lg:pr-3 lg:py-2 rounded-lg border-gray-200 bg-white text-transparent lg:text-gray-500 dark:bg-gray-800 cursor-pointer"
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
