import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

const graphColor = (data: any) => {
    if (data[data.length - 1]?.price >= data[0]?.price){
      return "#228B22"
    } else {
      return '#C70039'
    }
  }

interface StockGraphProps {
    type: string
    data: any
}

function StockGraph({ type, data }: StockGraphProps) {
    return (
        <div >
        <LineChart width={500} height={400} data={data}>
          <Line dot={false} type={"step"} dataKey={type} stroke={graphColor(data)} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
    </div>
    );
}

export default StockGraph;