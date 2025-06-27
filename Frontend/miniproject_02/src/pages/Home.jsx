import { useState, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker, useMap, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './Home.module.css'
import RegionLayer from './RegionLayer'
import { useAuth } from '../contexts/AuthContext'

// npm i leaflet react-leaflet 이걸 설치해야 지도가 보임 !!

// 지도 중심을 이동시키는 커스텀 컴포넌트
const ChangeMapCenter = ({ lat, lng }) => {
  const map = useMap()

  useEffect(() => {
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      map.whenReady(() => {
        console.log("📍 setView 실행:", lat, lng);
        map.setView([lat, lng], 10);
      });
    }
  }, [lat, lng, map]);

  return null
}


const GetRegion = async () => {

  const res = await fetch("/api/user/info", {
      method: "GET",
      credentials: "include",
    });

  const result = await res.json();

  const address = result.message.address;
  console.log("로그인 사용자 지역 로드 : "+address);

  return address;
};

const Home = () => {
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedRegionCode, setSelectedRegionCode] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  // const [mapData, setMapData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 35.1796, lng: 129.0756 })

  const { isLoggedIn, username } = useAuth();

  const [busanRegions, setBusanRegions] = useState([])
  const [geoData, setGeoData] = useState(null);
  
  useEffect(() => {
    console.log("✅ mapData 확인", geoData);
  }, [geoData]);


  useEffect(() => {
    const init = async () => {
      const geojsonRes = await fetch("/map.geojson");
      const data = await geojsonRes.json();

      console.log("📦 geoJSON 전체:", data);
      setGeoData(data);

      const extractedRegions = data.features.map((f) => {
        const name = f.properties.SGG_NM;
        const code = f.properties.SGG_OID;

        try {
          const layer = L.geoJSON(f);
          const center = layer.getBounds().getCenter();

          return {
            code,
            name,
            lat: center.lat,
            lng: center.lng
          };
        } catch (e) {
          console.warn(`❌ ${name} 중심 계산 실패:`, e.message);
          return null;
        }
      }).filter(Boolean);

      setBusanRegions(extractedRegions);

      // ✅ 사용자 주소 기반 지역 자동 설정
      // if (isLoggedIn) {
      //   const regionName = await GetRegion();           // 주소 이름 문자열
      //   const found = extractedRegions.find(r => r.name === regionName);  // 이름으로 찾기
      //   if (found) {
      //     setSelectedRegion(found.name);
      //     setSelectedRegionCode(found.code);
      //     setMapCenter({ lat: found.lat, lng: found.lng });
      //   } else {
      //     console.warn("❗ GeoJSON에서 해당 지역을 찾을 수 없습니다:", regionName);
      //   }
      // }
    };

    init();
  }, []);


  useEffect(() => {
    const loadUserRegion = async () => {
      const regionName = await GetRegion();
      console.log("✅ 사용자 지역:", regionName);

      const found = busanRegions.find(r => r.name === regionName);
      if (found) {
        setSelectedRegion(found.name);
        setSelectedRegionCode(found.code);
        setMapCenter({ lat: found.lat, lng: found.lng });
      } else {
        console.warn("❗ GeoJSON에서 해당 지역을 찾을 수 없습니다:", regionName);
      }
    };

    if (isLoggedIn && busanRegions.length > 0) {
      loadUserRegion();
    }
  }, [isLoggedIn, busanRegions]);


  useEffect(() => {
    if (!selectedRegion || busanRegions.length === 0) return;

    const found = busanRegions.find(region => region.name === selectedRegion);
    if (found) {
      setMapCenter({ lat: found.lat, lng: found.lng });
    }
  }, [selectedRegion, busanRegions]);


  const handleRegionSelect = (region) => {
    setSelectedRegion(region.name)
    setSelectedRegionCode(region.code)
    setIsDropdownOpen(false)
    setMapCenter({ lat: region.lat, lng: region.lng })
    // sendRegionCode(region.code)
  }


  const [showGuide, setShowGuide] = useState(false); // 이용방법 버튼 추가

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🗺️ 부산 지역별 최저가 상품 찾기</h2>


        <div className={styles.flexRow}>
          <div className={styles.dropdownFixed}>
            <button className={styles.guideBtn} onClick={() => setShowGuide(true)}>
              이용 방법 보기 💡
            </button>
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
              zoom={5}
              style={{ height: '600px', width: '1500px', borderRadius: '10px' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Geo JSON */}
              {geoData && (
                <>
                <RegionLayer geoData={geoData} selectedRegion={selectedRegion} />
                {/* <ChangeMapCenter geoData={geoData} selectedRegion={selectedRegion} /> */}
                </>
              )}


              <ChangeMapCenter lat={mapCenter.lat} lng={mapCenter.lng} />
            </MapContainer>
          </div>
        </div>
      <div className={styles.guide}>
        {showGuide && (
          <div className={styles.popupOverlay} onClick={() => setShowGuide(false)}>
            <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
              <div className={styles.popupContent}>
                💡 <strong>사용 방법:</strong><br />
                지역을 선택하면 지도에 해당 위치가 표시되고,<br />
                지역별 최저가 상품이 지도에 나타납니다! 📍🛒
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  )
}

export default Home