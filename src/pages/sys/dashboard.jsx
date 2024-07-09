import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ArrowDown, ArrowUp, MailIcon, TextCursor, User2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export const description = "An interactive bar chart";

const chartData = [
  { month: "January", "Check-In": 186, "Check-Out": 80 },
  { month: "February", "Check-In": 305, "Check-Out": 200 },
  { month: "March", "Check-In": 237, "Check-Out": 120 },
  { month: "April", "Check-In": 73, "Check-Out": 190 },
  { month: "May", "Check-In": 209, "Check-Out": 130 },
  { month: "June", "Check-In": 214, "Check-Out": 140 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

const stats = [
  {
    id: 1,
    name: "Total Guests",
    stat: "71,897",
    icon: User2,
    change: "122",
    changeType: "increase",
  },
  {
    id: 2,
    name: "Vacancies",
    stat: "58.16%",
    icon: MailIcon,
    change: "5.4%",
    changeType: "increase",
  },
  {
    id: 3,
    name: "Total Present",
    stat: "24.57%",
    icon: TextCursor,
    change: "3.2%",
    changeType: "decrease",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashbaord() {
  return (
    <div>
      <div className=" w-full">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Dashboard
        </h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-primary p-3">
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {item.stat}
                </p>
                <p
                  className={classNames(
                    item.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600",
                    "ml-2 flex items-baseline text-sm font-semibold"
                  )}
                >
                  {item.changeType === "increase" ? (
                    <ArrowUp
                      className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowDown
                      className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                      aria-hidden="true"
                    />
                  )}

                  <span className="sr-only">
                    {" "}
                    {item.changeType === "increase"
                      ? "Increased"
                      : "Decreased"}{" "}
                    by{" "}
                  </span>
                  {item.change}
                </p>
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View all
                      <span className="sr-only"> {item.name} stats</span>
                    </a>
                  </div>
                </div>
              </dd>
            </div>
          ))}
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 lg:col-span-2">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Recent Activity
            </h3>
            <br />
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="Check-In"
                  fill="var(--color-desktop)"
                  radius={4}
                />
                <Bar
                  dataKey="Check-Out"
                  fill="var(--color-mobile)"
                  radius={2}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </dl>
      </div>
    </div>
  );
}
