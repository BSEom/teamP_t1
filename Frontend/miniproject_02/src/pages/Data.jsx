import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import styles from './Data.module.css'
import Chart from 'chart.js/auto'

const Data = () => {
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedRegionCode, setSelectedRegionCode] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false)
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [chartData, setChartData] = useState(null)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)

  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartData || !chartRef.current) return
  
    const labels = chartData.map(d => d.ITEM)
    const values = chartData.map(d => d.DIFF_RATIO)
    
    // 랜덤 색상 생성 함수
    const getRandomColor = () => {
      const r = Math.floor(Math.random() * 156 + 100); // 100~255
      const g = Math.floor(Math.random() * 156 + 100);
      const b = Math.floor(Math.random() * 156 + 100);
      return `rgba(${r}, ${g}, ${b}, 0.7)`; // 밝고 투명한 색
    };

    // labels/values와 동일한 길이의 색상 배열 생성
    const backgroundColors = values.map(() => getRandomColor());

    // 이전 차트 삭제 (중복 방지)
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
  
    // 새 차트 생성
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '가격차이 비율 (%)',
            data: values,
            backgroundColor: backgroundColors,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: '품목별 가격차이 비율 (%)'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const index = context.dataIndex
                const item = chartData[index].ITEM
                const diff_ratio = chartData[index].DIFF_RATIO
                const max = chartData[index].MAX_PRICE
                const min = chartData[index].MIN_PRICE
                const priceDiff = chartData[index].PRICE_DIFF
                
                return [
                  `최고가: ${max}원`,
                  `최소가: ${min}원`,
                  `가격차이: ${priceDiff}원`,
                  `비율: ${diff_ratio}%`
                ]
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              autoSkip: false, // ← 모든 x축 라벨을 표시하도록 설정
              maxRotation: 90, // 글자 회전으로 공간 확보
              minRotation: 45
            }
          }
        }
      }
    })
  }, [chartData])

  useEffect(() => {
  if (chartData && chartData.length > 0) {
    console.log('✅ chartData가 업데이트됨:', chartData)

    chartData.forEach((row, i) => {
      console.log(`[${i}] item =`, row.item, '| diff_ratio =', row.diff_ratio)
    })

    const labels = chartData.map(d => d.item)
    const values = chartData.map(d =>
      parseFloat((d.diff_ratio + '').replace('%', '').trim()) || 0
    )

    console.log('Labels:', labels)
    console.log('Values:', values)
  } else {
    console.log('⚠️ chartData는 있지만 배열이 비어 있음 또는 구조 문제')
  }
}, [chartData])



  const busanRegions = [
    { code: '5', name: '남구' },
    { code: '7', name: '동래구' },
    { code: '8', name: '부산진구' },
    { code: '10', name: '북구' },
    { code: '11', name: '사상구' },
    { code: '12', name: '사하구' },
    { code: '18', name: '해운대구' }
  ]

  const years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']
  const months = [
    { value: '01', label: '1월' },
    { value: '04', label: '4월' },
    { value: '07', label: '7월' },
    { value: '10', label: '10월' }
  ]

  const handleRegionSelect = (region) => {
    setSelectedRegion(region.name)
    setSelectedRegionCode(region.code)
    setIsRegionDropdownOpen(false)
  }

  const handleDateSelect = (year, month) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    setIsDateDropdownOpen(false)
  }

  const fetchStatisticsData = async () => {
    if (!selectedRegionCode || !selectedYear || !selectedMonth) {
      alert('지역과 날짜를 모두 선택해주세요.')
      return
    }

    setLoading(true)
    try {
      const response = await axios.get('http://localhost:8050/chart/select', {
        params: {
          area: selectedRegion,
          year: selectedYear,
          month: selectedMonth
        }
      })
      
      setChartData(response.data)
      // setTableData(response.data.tableData)
      console.log('통계 데이터 가져오기 성공:', response.data)

  

      // const labels = chartData.map(d => d.item)
      // const values = chartData.map(d => parseFloat(d.diff_ratio) || 0)

      // console.log('Labels:', labels)
      // console.log('Values:', values)

    } catch (error) {
      console.error('통계 데이터 가져오기 실패:', error)
      alert('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  

  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        <h2 className={styles.title}> 부산 지역별 통계 데이터</h2>
        
        <div className={styles.contentWrapper}>
          {/* 왼쪽: 드롭다운 영역 */}
          <div className={styles.controlPanel}>
            {/* 지역 선택 드롭다운 */}
            <div className={styles.dropdownSection}>
              <label className={styles.label}>지역 선택</label>
              <div className={styles.dropdown}>
                <div 
                  className={styles.dropdownToggle} 
                  onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                >
                  <span style={{ color: selectedRegion ? '#333' : '#999' }}>
                    {selectedRegion || '지역을 선택하세요'}
                  </span>
                  <span
                    className={styles.arrow}
                    style={{ transform: isRegionDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ▼
                  </span>
                </div>

                {isRegionDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {busanRegions.map((region) => (
                      <div
                        key={region.code}
                        className={styles.dropdownItem}
                        onClick={() => handleRegionSelect(region)}
                      >
                        <span style={{ fontWeight: 'bold', color: '#4c63af' }}>{region.code}</span>
                        <span style={{ marginLeft: '8px' }}>{region.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 날짜 선택 드롭다운 */}
            <div className={styles.dropdownSection}>
              <label className={styles.label}>날짜 선택</label>
              <div className={styles.dropdown}>
                <div 
                  className={styles.dropdownToggle} 
                  onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                >
                  <span style={{ color: (selectedYear && selectedMonth) ? '#333' : '#999' }}>
                    {(selectedYear && selectedMonth) ? 
                      `${selectedYear}년 ${months.find(m => m.value === selectedMonth)?.label}` : 
                      '날짜를 선택하세요'
                    }
                  </span>
                  <span
                    className={styles.arrow}
                    style={{ transform: isDateDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ▼
                  </span>
                </div>

                {isDateDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {years.map((year) => (
                      <div key={year} className={styles.yearGroup}>
                        <div className={styles.yearHeader}>{year}년</div>
                        {months.map((month) => (
                          <div
                            key={`${year}-${month.value}`}
                            className={styles.dropdownItem}
                            onClick={() => handleDateSelect(year, month.value)}
                          >
                            {month.label}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 선택된 정보 표시 */}
            {(selectedRegion || (selectedYear && selectedMonth)) && (
              <div className={styles.selectedInfo}>
                <div className={styles.infoTitle}>선택된 정보:</div>
                {selectedRegion && (
                  <div className={styles.infoItem}>
                    지역: <strong>{selectedRegion}</strong> (코드: {selectedRegionCode})
                  </div>
                )}
                {(selectedYear && selectedMonth) && (
                  <div className={styles.infoItem}>
                    날짜: <strong>{selectedYear}년 {months.find(m => m.value === selectedMonth)?.label}</strong>
                  </div>
                )}
              </div>
            )}

            {/* 데이터 조회 버튼 */}
            <button 
              className={styles.fetchButton}
              onClick={fetchStatisticsData}
              disabled={loading || !selectedRegionCode || !selectedYear || !selectedMonth}
            >
              {loading ? '데이터 조회 중...' : '통계 데이터 조회'}
            </button>
          </div>

          {/* 오른쪽: 표와 그래프 영역 */}
          <div className={styles.dataDisplayArea}>
            {/* 표 컨테이너 */}
            <div className={styles.tableContainer}>
              <h3 className={styles.containerTitle}> 데이터 표</h3>
              <div className={styles.tableContent}>
                {/* {tableData.length > 0 ? (
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        {Object.keys(tableData[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, idx) => (
                            <td key={idx}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className={styles.noData}>표시할 데이터가 없습니다.</div>
                )} */}
                <div className={styles.noData}>표시할 데이터가 없습니다.</div>
              </div>
            </div>

            {/* 그래프 컨테이너 */}
            <div className={styles.chartContainer}>
              <h3 className={styles.containerTitle}> 데이터 그래프</h3>
              <div className={styles.chartContent}>
                {chartData ? (
                  <div className={styles.chartPlaceholder}>
                    {/* 여기에 실제 차트 라이브러리 컴포넌트가 들어갈 예정 */}
                    {/* <p>차트 데이터가 로드되었습니다!</p>
                    <pre>{JSON.stringify(chartData, null, 2)}</pre> */}
                    <canvas ref={chartRef} className={styles.chartCanvas}></canvas>
                  </div>
                ) : (
                  <div className={styles.noData}>표시할 그래프가 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Data