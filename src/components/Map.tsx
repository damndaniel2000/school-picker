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
import favMarker from "../assets/fav.png";
import { Button } from "@radix-ui/themes";
import { saveUserFavorite, updateUserFavorite } from "../utils/api";
import { toast } from "react-toastify";
import mapStyle from "../utils/mapStyle";

type MapProps = {
  favoriteId?: string | null;
  markers: Institute[];
  refreshFav: (id: string) => void;
};

// Define a color map for categories
const CATEGORY_COLORS: { [key: string]: string } = {
  Schools: schoolMarker,
  Kindertageseinrichtungen: kgMarker,
  Schulsozialarbeit: childProjectMarker,
  Jugendberufshilfe: collegeProjectMarker,
};

type MarkerComponentProps = {
  item: Institute;
  favoriteId?: string | null;
  refreshFav: (id: string) => void;
};

const MarkerComponent = (props: MarkerComponentProps) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const infowindowRef = useRef<HTMLDivElement>(null);

  const item = props.item;

  const mark = CATEGORY_COLORS[item.category];

  const handleFavClick = async (id: string) => {
    setLoading(true);
    try {
      props.favoriteId
        ? await updateUserFavorite(id)
        : await saveUserFavorite(id);
      toast.success("Favorite updated");
      props.refreshFav(id);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
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
        position={{ lat: item.Y, lng: item.X }}
      >
        <img
          src={props.favoriteId === item.id ? favMarker : mark}
          width={44}
          height={44}
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
              <h2 className="text-lg font-semibold">{item.BEZEICHNUNG}</h2>
              <p className="text-sm text-gray-600">{item.ORT}</p>
              <p className="mt-2">{item.STRASSE}</p>
              <p>{item.TELEFON}</p>
              <p>{item.EMAIL}</p>
              <p>{item.TRAEGER}</p>
              <p>{item.KURZBEZEICHNUNG}</p>
              {item.STRSCHL && <p>Street Code: {item.STRSCHL}</p>}
              {item.PLZ && <p>Postal Code: {item.PLZ}</p>}
              {item.HAUSBEZ && <p>House Number: {item.HAUSBEZ}</p>}
              {item.BARRIEREFREI && <p>Barrier-Free: {item.BARRIEREFREI}</p>}
              {item.INTEGRATIV && <p>Integrative: {item.INTEGRATIV}</p>}

              {props.favoriteId !== item.id && (
                <div className="mt-4">
                  <Button
                    loading={loading}
                    className="cursor-pointer"
                    variant="solid"
                    onClick={() => handleFavClick(item.id.toString())}
                  >
                    Set As Favorite
                  </Button>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </AdvancedMarker>
    </>
  );
};

const MapComponent: React.FC<MapProps> = ({
  markers,
  favoriteId,
  refreshFav,
}) => {
  return (
    <Map
      style={{ width: "100%", height: "100%" }}
      defaultCenter={{ lat: markers[0].Y, lng: markers[0].X }}
      defaultZoom={16}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      mapId="map1"
      styles={mapStyle}
    >
      {markers.map((item) => (
        <MarkerComponent
          favoriteId={favoriteId}
          item={item}
          refreshFav={refreshFav}
        />
      ))}
    </Map>
  );
};

export default MapComponent;
