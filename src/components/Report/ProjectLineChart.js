import { Paper, useTheme } from "@material-ui/core";
import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { loadBugReportFromProjectId } from "../../store/reports";

// const data = {
//   labels: ["1", "2", "3", "4", "5", "6"],
//   datasets: [
//     {
//       label: "# of Votes",
//       data: [12, 19, 3, 5, 2, 3],
//       fill: false,
//       backgroundColor: "rgb(255, 99, 132)",
//       borderColor: "rgba(255, 99, 132, 0.2)",
//     },
//   ],
// };

const options = {
  scales: {
    // yAxes: [
    //   {
    //     ticks: {
    //       beginAtZero: true,
    //     },
    //   },
    // ],
    y: {
      ticks: {
        stepSize: 1,
      },
    },
  },
};

const ProjectLineChart = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );
  const userId = useSelector((state) => state.entities.auth.userId);
  const data = useSelector((state) => state.entities.report.bugReport);
  useEffect(() => {
    if (userId != null && projectId !== -1) {
      dispatch(loadBugReportFromProjectId(projectId, userId));

    }
  }, [projectId, userId, dispatch]);

  return (
    <Paper style={{ padding: theme.spacing(1) }}>
      <Line data={data} options={options} />
    </Paper>
  );
};

export default ProjectLineChart;
