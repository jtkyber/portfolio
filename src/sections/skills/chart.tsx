import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import type { SkillsByCategory } from '../../types/skills.types';

interface CustomizedAxisTickProps {
    x?: number;
    y?: number;
    payload?: {
        value: string | number;
        [key: string]: any;
    };
}

export default function SkillChart({ data }: { data: SkillsByCategory }) {
    const labelSpace = 80;
    const chartHeight = 250 + labelSpace;
    const barBorderRadius = 10;
    const strokeOpacity = 0.6;
    const strokeColor = 'var(--text)';

    const CustomizedAxisTick = ({ x, y, payload }: CustomizedAxisTickProps) => {
        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={10}
                    textAnchor='end'
                    fill={strokeColor}
                    transform='rotate(-45)'
                    opacity={strokeOpacity}
                >
                    {payload?.value}
                </text>
            </g>
        );
    };

    return (
        <div
            data-name='skill-chart'
            className='flex flex-col gap-4 no-outline-chart'
        >
            <h3 className='w-full text-center text-primary font-bold'>
                {data.category}
            </h3>

            <BarChart
                style={{
                    height: chartHeight,
                }}
                responsive
                layout='horizontal'
                margin={{ top: 0, right: 0, left: 0, bottom: labelSpace }}
                data={data.list}
            >
                <XAxis
                    type='category'
                    dataKey='name'
                    tick={<CustomizedAxisTick />}
                    interval={0}
                    stroke={strokeColor}
                    opacity={0}
                />
                <YAxis
                    type='number'
                    width='auto'
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    stroke={strokeColor}
                    tick={{ fill: strokeColor, opacity: strokeOpacity }}
                    opacity={0}
                />
                <Tooltip
                    cursor={false}
                    contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '2px solid var(--surface)',
                        borderRadius: '0.5rem',
                    }}
                    labelStyle={{
                        color: strokeColor,
                        opacity: 0.7,
                        fontSize: '0.9rem',
                    }}
                    itemStyle={{
                        color: strokeColor,
                        textTransform: 'capitalize',
                    }}
                />
                <Bar
                    dataKey='rating'
                    fill='var(--surface)'
                    stroke={strokeColor}
                    strokeOpacity={strokeOpacity}
                    radius={[barBorderRadius, barBorderRadius, 0, 0]}
                    activeBar={{ fill: 'var(--primary)', strokeOpacity: '0%' }}
                />
            </BarChart>
        </div>
    );
}
