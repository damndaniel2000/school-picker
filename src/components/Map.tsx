import React, { useEffect, useRef, useState } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Institute } from "../utils/types";
import kgMarker from "../assets/kgMarker.png";
import schoolMarker from "../assets/schoolMarker.png";
import collegeProjectMarker from "../assets/collegeProjectMarker.png";
import childProjectMarker from "../assets/childProjectMarker.png";
import { Button } from "@radix-ui/themes";
import { saveFavorite } from "../utils/api";

type MapProps = {
  markers: Institute[];
};

// Define a color map for categories
const CATEGORY_COLORS: { [key: string]: string } = {
  Schools: schoolMarker,
  Kindertageseinrichtungen: kgMarker,
  Schulsozialarbeit: childProjectMarker,
  Jugendberufshilfe: collegeProjectMarker,
};

const MarkerComponent = (props: Institute) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const infowindowRef = useRef<HTMLDivElement>(null);

  const mark = CATEGORY_COLORS[props.category];

  const handleFavClick = async (id: string) => {
    try {
      const res = await saveFavorite(id);
      console.log("FAV SET", res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        infowindowRef.current &&
        !infowindowRef.current.contains(event.target as Node)
      ) {
        setInfowindowOpen(false);
      }
    };

    if (infowindowOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [infowindowOpen]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={{ lat: props.Y, lng: props.X }}
      >
        <img
          src={mark}
          width={32}
          height={32}
        />
        {infowindowOpen && (
          <InfoWindow
            anchor={marker}
            maxWidth={300}
            onCloseClick={() => setInfowindowOpen(false)}
          >
            <div
              ref={infowindowRef}
              className="w-full"
            >
              <h2 className="text-lg font-semibold">{props.BEZEICHNUNG}</h2>
              <p className="text-sm text-gray-600">{props.ORT}</p>
              <p className="mt-2">{props.STRASSE}</p>
              <p>{props.TELEFON}</p>
              <p>{props.EMAIL}</p>
              <div className="mt-4">
                <Button
                  className="cursor-pointer"
                  variant="solid"
                  onClick={() => handleFavClick(props.ID.toString())}
                >
                  Set As Favorite
                </Button>
              </div>
            </div>
          </InfoWindow>
        )}
      </AdvancedMarker>
    </>
  );
};

const MapComponent: React.FC<MapProps> = ({ markers }) => {
  return (
    <Map
      style={{ width: "100%", height: "100%" }}
      defaultCenter={{ lat: markers[0].Y, lng: markers[0].X }}
      defaultZoom={16}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      mapId={"hello"}
    >
      {markers.map((item) => (
        <MarkerComponent {...item} />
      ))}
    </Map>
  );
};

export default MapComponent;
