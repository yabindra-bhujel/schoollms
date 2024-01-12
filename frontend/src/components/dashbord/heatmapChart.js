import React from "react";
import Heatmap from 'react-heatmap-grid';

const HeatmapChart = () => {
    // Sample data: array of arrays with values
    const heatmapData = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12]
        
    ];

    const xLabels = ['Label 1', 'Label 2', 'Label 3']; // X-axis labels
    const yLabels = ['Row 1', 'Row 2', 'Row 3']; // Y-axis labels

    return (
        <div>
            <Heatmap
                xLabels={xLabels}
                yLabels={yLabels}
                data={heatmapData}
                // height={300}
                cellRender={(value, x, y) => value} // Customize cell rendering
            />
        </div>
    );
};

export default HeatmapChart;
