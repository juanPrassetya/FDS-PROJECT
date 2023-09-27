import {EChartsOption} from "echarts";

export function TRANS_ACTIVITY_CHART_OPT(dateData: string[], successData: number[], declineData: number[]): EChartsOption {
  return {
    title: {
      text: 'Transaction Activity',
      subtext: 'Showing transaction activity from now - 6 days ago'
    },
    grid: {
      top: 90,
      bottom: 20,
      left: 70,
      right: 40
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#283b56'
        }
      }
    },
    legend: {
      data: ['Success', 'Declined'],
    },
    xAxis: [
      {
        type: 'category',
        data: dateData
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Success',
        type: 'bar',
        data: successData,
      },
      {
        name: 'Declined',
        type: 'bar',
        data: declineData,
      }
    ]
  }
}

export function ALERT_CASE_ACTIVITY_CHART_OPT(notClassified: number, positive: number, suspicious: number, negative: number): EChartsOption {
  return {
    title: {
      text: 'Alert Case Analytic',
      subtext: 'Showing summary of Alert Case by classification',
      left: 'center'
    },
    // tooltip: {
    //   trigger: 'item'
    // },
    // legend: {
    //   orient: 'horizontal',
    //   bottom: 'bottom'
    // },
    series: {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      top: '20%',
      data: [
        {
          value: 0,
          name: 'Not Cls',
          label: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {a|{b}：}' + notClassified + '  ',
            backgroundColor: '#F6F8FC',
            borderColor: '#8C8D8E',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#6E7079',
                lineHeight: 22,
                fontSize: 10,
                align: 'center'
              },
              hr: {
                borderColor: '#8C8D8E',
                width: '100%',
                borderWidth: 1,
                height: 0
              },
              b: {
                color: '#4C5058',
                fontSize: 12,
                fontWeight: 'bold',
                lineHeight: 33
              }
            }
          },
        },
        {
          value: 0,
          name: 'Positive',
          label: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {a|{b}：}' + positive + '  ',
            backgroundColor: '#F6F8FC',
            borderColor: '#8C8D8E',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#6E7079',
                lineHeight: 22,
                fontSize: 10,
                align: 'center'
              },
              hr: {
                borderColor: '#8C8D8E',
                width: '100%',
                borderWidth: 1,
                height: 0
              },
              b: {
                color: '#4C5058',
                fontSize: 12,
                fontWeight: 'bold',
                lineHeight: 33
              }
            }
          },
        },
        {
          value: 0,
          name: 'Suspicious',
          label: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {a|{b}：}' + suspicious + '  ',
            backgroundColor: '#F6F8FC',
            borderColor: '#8C8D8E',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#6E7079',
                lineHeight: 22,
                fontSize: 10,
                align: 'center'
              },
              hr: {
                borderColor: '#8C8D8E',
                width: '100%',
                borderWidth: 1,
                height: 0
              },
              b: {
                color: '#4C5058',
                fontSize: 12,
                fontWeight: 'bold',
                lineHeight: 33
              }
            }
          },
        },
        {
          value: 0,
          name: 'Negative',
          label: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {a|{b}：}' + negative + '  ',
            backgroundColor: '#F6F8FC',
            borderColor: '#8C8D8E',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#6E7079',
                lineHeight: 22,
                fontSize: 10,
                align: 'center'
              },
              hr: {
                borderColor: '#8C8D8E',
                width: '100%',
                borderWidth: 1,
                height: 0
              },
              b: {
                color: '#4C5058',
                fontSize: 12,
                fontWeight: 'bold',
                lineHeight: 33
              }
            }
          },
        },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  };
}
