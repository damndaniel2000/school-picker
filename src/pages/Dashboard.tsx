import { useEffect, useState } from "react";
import { Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import MapComponent from "../components/Map";
import {
  getKgFacilities,
  getSchoolFacilities,
  getSocialChildProjectFacilities,
  getSocialTeenageProjectFacilities,
} from "../utils/api";
import { Institute } from "../utils/types";

const CATEGORIES = [
  "Schools",
  "Kindertageseinrichtungen",
  "Schulsozialarbeit",
  "Jugendberufshilfe",
];

export default function Dashboard() {
  const [categories, setCategories] = useState<string[]>(["Schools"]);
  const [markers, setMarkers] = useState<Institute[]>([]);

  // Function to fetch data based on selected categories
  const fetchData = async () => {
    try {
      const kgFacilitiesResponse = await getKgFacilities();
      const schoolFacilitiesResponse = await getSchoolFacilities();
      const socialChildProjectResponse =
        await getSocialChildProjectFacilities();
      const socialTeenageProjectResponse =
        await getSocialTeenageProjectFacilities();

      const kgFacilities = kgFacilitiesResponse.data.map((item: Institute) => ({
        ...item,
        category: CATEGORIES[0],
      }));

      const schoolFacilities = schoolFacilitiesResponse.data.map(
        (item: Institute) => ({
          ...item,
          category: CATEGORIES[1],
        })
      );

      const socialChildProjectFacilities = socialChildProjectResponse.data.map(
        (item: Institute) => ({
          ...item,
          category: CATEGORIES[2],
        })
      );

      const socialTeenageProjectFacilities =
        socialTeenageProjectResponse.data.map((item: Institute) => ({
          ...item,
          category: CATEGORIES[3],
        }));

      const allMarkers = [
        ...kgFacilities,
        ...schoolFacilities,
        ...socialChildProjectFacilities,
        ...socialTeenageProjectFacilities,
      ];
      setMarkers(allMarkers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect to fetch data initially and whenever categories change
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures it runs once on mount

  // useEffect to ensure at least one filter is selected
  useEffect(() => {
    if (categories.length === 0) {
      setCategories(["Schools"]); // Default to Schools if none selected
    }
  }, [categories]);

  // Handle category click
  const handleCategoryClick = (item: string) => {
    if (categories.includes(item)) {
      if (categories.length > 1) {
        setCategories((prev) => prev.filter((category) => category !== item));
      }
    } else {
      setCategories((prev) => [...prev, item]);
    }
  };

  // Filter markers based on selected categories
  const filteredMarkers = markers.filter((marker) =>
    categories.includes(marker.category)
  );

  return (
    <>
      <nav className="w-full bg-blue-500 flex justify-center items-center px-8 py-4">
        <h1>Sexiest Project Ever</h1>
      </nav>
      <div>
        <div className="flex justify-center items-center space-x-6 py-5">
          {CATEGORIES.map((item) => (
            <Button
              key={item}
              onClick={() => handleCategoryClick(item)}
              variant={categories.includes(item) ? "solid" : "surface"}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="h-[calc(100vh-128px)] bg-blue-200">
          {filteredMarkers.length > 0 && (
            <MapComponent markers={filteredMarkers} />
          )}
        </div>
      </div>
    </>
  );
}
