import { DataTable } from "@/app/(private)/components/data-table";
import { SiteHeader } from "@/app/(private)/components/site-header";
import { SectionCards } from "@/app/(private)/components/section-cards";
import { ChartAreaInteractive } from "@/app/(private)/components/chart-area-interactive";

import data from "@/app/(private)/dashboard/data.json";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
