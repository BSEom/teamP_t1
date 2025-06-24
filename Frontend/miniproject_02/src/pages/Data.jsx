import { useState, useEffect, useRef, use } from 'react'
import axios from 'axios'
import styles from './Data.module.css'
import Chart from 'chart.js/auto'

const Data = () => {
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedRegionCode, setSelectedRegionCode] = useState('')
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false)
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [chartData, setChartData] = useState(null)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)

  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartData || !chartRef.current) return
  
    const labels = chartData.map(d => d.AREA)
    const minPrices = chartData.map(d => d.MIN_PRICE)
    const maxPrices = chartData.map(d => d.MAX_PRICE)

    // // 랜덤 색상 생성 함수
    // const getRandomColor = () => {
    //   const r = Math.floor(Math.random() * 156 + 100); // 100~255
    //   const g = Math.floor(Math.random() * 156 + 100);
    //   const b = Math.floor(Math.random() * 156 + 100);
    //   return `rgba(${r}, ${g}, ${b}, 0.7)`; // 밝고 투명한 색
    // };

    // // labels/values와 동일한 길이의 색상 배열 생성
    // const backgroundColors = values.map(() => getRandomColor());

    // 이전 차트 삭제 (중복 방지)
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
  
    // 새 차트 생성
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: chartData.map(d => d.AREA),
        datasets: [
          {
            label: '최저가',
            data: chartData.map(d => d.MIN_PRICE),
            backgroundColor: 'rgb(82, 122, 197)'
          },
          {
            label: '최고가',
            data: chartData.map(d => d.MAX_PRICE),
            backgroundColor: 'rgba(250, 100, 80, 0.88)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: '지역별 최저가 / 최고가 비교'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const index = context.dataIndex;
                const datasetLabel = context.dataset.label;
                const value = context.parsed.y;
                const unit = '원';
              
                return `${datasetLabel}: ${value.toLocaleString()}${unit}`;
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



  const busanItems = [
    { code: '1', name: '가루비누' },
    { code: '2', name: '간장' },
    { code: '3', name: '갈치' },
    { code: '4', name: '고등어' },
    { code: '5', name: '달걀' },
    { code: '6', name: '닭고기' },
    { code: '7', name: '대파' },
    { code: '8', name: '돼지고기' },
    { code: '9', name: '두부' },
    { code: '10', name: '라면' },
    { code: '11', name: '맥주' },
    { code: '12', name: '무' },
    { code: '13', name: '밀가루' },
    { code: '14', name: '밀감' },
    { code: '15', name: '배' },
    { code: '16', name: '배추' },
    { code: '17', name: '부엌용세제' },
    { code: '18', name: '분말커피' },
    { code: '19', name: '사과' },
    { code: '20', name: '사이다' },
    { code: '21', name: '설탕' },
    { code: '22', name: '소주' },
    { code: '23', name: '쇠고기' },
    { code: '24', name: '식용유' },
    { code: '25', name: '쌀' },
    { code: '26', name: '양파' },
    { code: '27', name: '오징어' },
    { code: '28', name: '우유' },
    { code: '29', name: '참기름' },
    { code: '30', name: '커피크림' },
    { code: '31', name: '콜라' },
    { code: '32', name: '화장지' }
  ]

  const years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']
  const months = [
    { value: '01', label: '1월' },
    { value: '04', label: '4월' },
    { value: '07', label: '7월' },
    { value: '10', label: '10월' }
  ]

  const columnHeaders = {
    AREA: "지역",
    MIN_PRICE: "최저가(원)",
    MAX_PRICE: "최고가(원)",
    PRICE_DIFF: "가격차이(원)",
    DIFF_RATIO: "차이 비율(%)"
  };


  const handleItemSelect = (item) => {
    setSelectedItem(item.name)
    setIsItemDropdownOpen(false)
  }

  const handleDateSelect = (year, month) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    setIsDateDropdownOpen(false)
  }

  const fetchStatisticsData = async () => {
    if (!selectedItem || !selectedYear || !selectedMonth) {
      alert('지역과 날짜를 모두 선택해주세요.')
      return
    }

    setLoading(true)
    try {
      const response = await axios.get('http://localhost:8050/chart/select', {
        params: {
          item: selectedItem,
          year: selectedYear,
          month: selectedMonth
        }
      })
      
      setChartData(response.data)
      setTableData(response.data)
      console.log('통계 데이터 가져오기 성공:', response.data)

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
          <div className={styles.filterRow}>
            {/* 지역 선택 드롭다운 */}
            <div className={styles.filterWrapper}>
            <div className={styles.filterLeft}>
            <div className={styles.dropdownSection}>
              <label className={styles.label}>지역 선택</label>
              <div className={styles.dropdown}>
                <div 
                  className={styles.dropdownToggle} 
                  onClick={() => setIsItemDropdownOpen(!isItemDropdownOpen)}
                >
                  <span style={{ color: selectedItem ? '#333' : '#999' }}>
                    {selectedItem || '품목을 선택하세요'}
                  </span>
                  <span
                    className={styles.arrow}
                    style={{ transform: isItemDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ▼
                  </span>
                </div>

                {isItemDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {busanItems.map((Item) => (
                      <div
                        key={Item.code}
                        className={styles.dropdownItem}
                        onClick={() => handleItemSelect(Item)}
                      >
                        <span style={{ fontWeight: 'bold', color: '#4c63af' }}>{Item.code}</span>
                        <span style={{ marginLeft: '8px' }}>{Item.name}</span>
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
            </div>
            {/* 선택된 정보 표시 */}
            <div className={styles.filterRight}>
            {(selectedItem || (selectedYear && selectedMonth)) && (
              <div className={styles.selectedInfo}>
                <div className={styles.infoTitle}>선택된 정보:</div>
                {selectedItem && (
                  <div className={styles.infoItem}>
                    지역: <strong>{selectedItem}</strong>
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
              disabled={loading || !selectedItem || !selectedYear || !selectedMonth}
            >
              {loading ? '데이터 조회 중...' : '통계 데이터 조회'}
            </button>
          </div>
            </div>
              </div>



          {/* 오른쪽: 표와 그래프 영역 */}
          <div className={styles.dataDisplayArea}>
            {/* 그래프 컨테이너 */}
            <div className={styles.section}>
            <h3 className={styles.containerTitle}> 데이터 그래프</h3>
            <div className={styles.chartContainer}>
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

            {/* 표 컨테이너 */}
            <div className={styles.section}>
              <h3 className={styles.containerTitle}> 데이터 표</h3>
            <div className={styles.tableContainer}>
              <div className={styles.tableContent}>
                {tableData.length > 0 ? (
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        {Object.keys(tableData[0]).map((key) => (
                          <th key={key}>{columnHeaders[key] || key}</th>
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
                )}
              </div>
            </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Data