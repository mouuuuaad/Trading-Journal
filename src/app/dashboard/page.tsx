import { Header } from "@/components/dashboard/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { WinLossChart } from "@/components/dashboard/win-loss-chart";
import { TradeTable } from "@/components/dashboard/trade-table";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <PerformanceChart />
          </div>
          <div className="lg:col-span-3">
            <WinLossChart />
          </div>
        </div>
        <TradeTable />
      </main>
    </>
  );
}
