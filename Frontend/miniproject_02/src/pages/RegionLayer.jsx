import { GeoJSON } from "react-leaflet";
import React, { useRef } from "react";

const RegionLayer = ({ geoData }) => {
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
      direction: "center",
      sticky: true,
    });

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
    //   const el = layer.getElement?.();
    //   if (el) el.style.outline = "none";
      layer.bindPopup(`<b>${name}</b> 구가 선택되었습니다.`).openPopup();
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
        style={() => defaultStyle}
        onEachFeature={onEachFeature}
      />
    )
  );
};

export default RegionLayer;
