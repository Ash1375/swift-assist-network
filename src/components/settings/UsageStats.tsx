
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const UsageStats = () => {
  const data = [
    { month: 'Jan', requests: 65 },
    { month: 'Feb', requests: 59 },
    { month: 'Mar', requests: 80 },
    { month: 'Apr', requests: 81 },
    { month: 'May', requests: 56 },
    { month: 'Jun', requests: 55 },
  ]

  const stats = [
    { label: "Total Requests", value: "396" },
    { label: "Completed", value: "358" },
    { label: "Average Response Time", value: "15min" },
    { label: "Customer Rating", value: "4.8/5" },
  ]

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Requests Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default UsageStats
