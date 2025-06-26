import { GeoJSON, useMap } from "react-leaflet";
import React, { useRef, useEffect } from "react";
import * as L from "leaflet";

const RegionLayer = ({ geoData, selectedRegion }) => {

  const map = useMap();
  const layerMap = useRef({}); // 지역명: layer 객체


  useEffect(() => {
    if (!selectedRegion || !geoData) return;

    const layer = layerMap.current[selectedRegion];
    if (layer) {
      layer.fire("click"); // 마치 클릭한 것처럼 작동
      // map.fitBounds(layer.getBounds());
    }
  }, [selectedRegion, geoData, map]);

  const defaultStyle = {
    color: "#2c3e50",
    weight: 1,
    fillColor: "#a29bfe",
    fillOpacity: 0.3,
  };

  const highlightStyle = {
    color: "#0984e3",
    weight: 2,
    fillColor: "#ffeaa7",
    fillOpacity: 0.6,
  };

  const selectedRef = useRef(null);

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.SGG_NM || "지역명 없음";

    // Tooltip
    layer.bindTooltip(name, {
      direction: "top",
      sticky: true,
    });

    layerMap.current[name] = layer;

    // Hover 효과
    layer.on("mouseover", function () {
      layer.setStyle(highlightStyle);
    });

    layer.on("mouseout", function () {
      // 선택된 지역은 유지, 그 외는 원복
      if (selectedRef.current !== layer) {
        layer.setStyle(defaultStyle);
      }
    });

    // Click 이벤트
    layer.on("click", function () {
      console.log("✅ 클릭한 지역:", name);

      // 이전 선택 스타일 되돌리기
      if (selectedRef.current) {
        selectedRef.current.setStyle(defaultStyle);
      }

      // 새 선택 스타일 적용
      layer.setStyle({
        ...highlightStyle,
        fillColor: "#fab1a0",
      });
   
      fetch(`/api/chart/map?area=${encodeURIComponent(name)}`)
        .then(res => res.json())
        .then(data => {
          console.log("📦 가져온 데이터:", data);
        
          const itemList = data.length > 0 ? data.map(item => `<li>${item}</li>`).join("")
          : "<li>준비중...</li>";
      
          layer.bindPopup(`
            <h6><b>${name}</b>의 최저가 품목:</h6><br/>
            <ul>${itemList}</ul>
          `).openPopup();
        })
        .catch(err => {
          console.error("❌ 데이터 불러오기 실패:", err);
          layer.bindPopup(`<b>${name}</b> 구 정보를 불러올 수 없습니다.`).openPopup();
        });

      // layer.bindPopup(`<b>${name}</b> 구가 선택되었습니다.`).openPopup();
      selectedRef.current = layer;
    });

    // // 우클릭 이벤트
    // layer.on("contextmenu", function () {
    //   console.log("우클릭한 지역:", name);
    //   // 여기에 팝업 열기, 메뉴 표시 등 추가 가능
    // });
  };

  return (
    geoData && (
      <GeoJSON
        data={geoData}
         style={(feature) =>
          feature.properties.SGG_NM === selectedRegion ? highlightStyle : defaultStyle
        }
        onEachFeature={onEachFeature}
      />
    )
  );
};

export default RegionLayer;
