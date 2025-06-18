import { useState, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './Home.module.css'

// npm i leaflet react-leaflet 이걸 설치해야 지도가 보임 !!

// 지도 중심을 이동시키는 커스텀 컴포넌트
const ChangeMapCenter = ({ lat, lng }) => {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 12)
    }
  }, [lat, lng, map])
  return null
}

const Home = () => {
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedRegionCode, setSelectedRegionCode] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mapData, setMapData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 35.1796, lng: 129.0756 })

  const busanRegions = [
    { code: '5', name: '남구', lat: 35.1367, lng: 129.0844 },
    { code: '7', name: '동래구', lat: 35.2046, lng: 129.0837 },
    { code: '8', name: '부산진구', lat: 35.1618, lng: 129.0532 },
    { code: '10', name: '북구', lat: 35.1974, lng: 128.9906 },
    { code: '11', name: '사상구', lat: 35.1549, lng: 128.9916 },
    { code: '12', name: '사하구', lat: 35.104, lng: 128.9747 },
    { code: '18', name: '해운대구', lat: 35.1631, lng: 129.1639 }
  ]

  const handleRegionSelect = (region) => {
    setSelectedRegion(region.name)
    setSelectedRegionCode(region.code)
    setIsDropdownOpen(false)
    setMapCenter({ lat: region.lat, lng: region.lng })
    sendRegionCode(region.code)
  }

  const sendRegionCode = (regionCode) => {
    fetch('/api/region', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regionCode })
    })
      .then(res => res.json())
      .then(data => {
        console.log('지역코드 전송 성공:', data)
        setMapData(data)
      })
      .catch(err => console.error('지역코드 전송 실패:', err))
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🗺️ 부산 지역별 최저가 상품 찾기</h2>

        <div className={styles.flexRow}>
          <div className={styles.dropdown}>
            <div className={styles.dropdownToggle} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <span className={selectedRegion ? styles.activeText : styles.placeholder}>
                {selectedRegion || '지역을 선택하세요'}
              </span>
              <span
                className={styles.arrow}
                style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▼
              </span>
            </div>

            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                {busanRegions.map((region) => (
                  <div
                    key={region.code}
                    className={styles.dropdownItem}
                    onClick={() => handleRegionSelect(region)}
                  >
                    <span className={styles.regionCode}>{region.code}</span>
                    <span className={styles.regionName}>{region.name}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedRegion && (
              <div className={styles.selectedBox}>
                <div className={styles.selectedLabel}>선택된 지역:</div>
                <div className={styles.selectedValue}>
                  {selectedRegionCode} {selectedRegion}
                </div>
              </div>
            )}
          </div>

          <div className={styles.mapContainer}>
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={12}
              style={{ height: '400px', width: '100%', borderRadius: '10px' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ChangeMapCenter lat={mapCenter.lat} lng={mapCenter.lng} />
              {selectedRegion && (
                <Marker position={[mapCenter.lat, mapCenter.lng]}>
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                    {selectedRegion}
                  </Tooltip>
                </Marker>
              )}
              {mapData.map((item, idx) => {
                const { 위도: lat, 경도: lon, 타입: type, 이름: placeName } = item
                let color = "purple", fillColor = "skyblue"
                if (type === "Lowest") {
                  color = "lightgreen"; fillColor = "orange"
                } else if (type === "Highest") {
                  color = "pink"; fillColor = "yellow"
                }
                return (
                  <CircleMarker
                    key={idx}
                    center={[lat, lon]}
                    radius={15}
                    pathOptions={{ color, fillColor, fillOpacity: 0.6 }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.8}>
                      {placeName}
                    </Tooltip>
                  </CircleMarker>
                )
              })}
            </MapContainer>
          </div>
        </div>
      <div className={styles.guide}>
        <div className={styles.guideText}>
          💡 <strong>사용 방법:</strong> 지역을 선택하면 지도에 해당 위치가 표시되고, 지역별 최저가 상품이 표시됩니다 !
        </div>
        {selectedRegion && (
          <div className={styles.selectedText}>
            현재 선택: <strong>{selectedRegion}</strong> (코드: {selectedRegionCode})
          </div>
        )}
      </div>
      </div>

    </div>
  )
}

export default Home