import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import ScrollReveal from "../../components/common/ScrollReveal";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="gap-4 md:gap-6 grid grid-cols-4 lg:grid-cols-4">
        <div className="col-span-12 space-y-6">
          <ScrollReveal>
          <p className="dark:text-white font-bold text-3xl ml-[15px]">Welcome Back, Admin!</p>
          </ScrollReveal>
          <ScrollReveal>
          <p className="dark:text-white  text-lg ml-[15px]">Here is your todays statistics</p>
          </ScrollReveal>
          <ScrollReveal delay={0.16}>
          <EcommerceMetrics />
          </ScrollReveal>
          {/* <MonthlySalesChart /> */}
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        <div className="col-span-12">
          <ScrollReveal delay={0.16} origin="top"> 
          <StatisticsChart />
          </ScrollReveal>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <ScrollReveal delay={0.24} origin="left">
          <DemographicCard />
          </ScrollReveal>
        </div>

        <div className="col-span-12 xl:col-span-7 lg:w-[730px]">
          <ScrollReveal delay={0.32} origin="right">
          <RecentOrders />
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
