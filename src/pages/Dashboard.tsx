import { useEffect, useState } from "react";
import { Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import MapComponent from "../components/Map";
import {
  getSchoolFacilities,
  getKgFacilities,
  getSocialChildProjectFacilities,
  getSocialTeenageProjectFacilities,
} from "../utils/api";
import { Institute } from "../utils/types";
import ProfileDropdown from "../components/ProfileDropdown";
import logo from "../assets/logo.png";
import SideDrawer from "../components/SideDrawer";

const CATEGORIES = [
  "Kindertageseinrichtungen",
  "Schools",
  "Schulsozialarbeit",
  "Jugendberufshilfe",
];

const getButtonColor = (category: string) => {
  switch (category) {
    case CATEGORIES[0]:
      return "grass";
    case CATEGORIES[1]:
      return "orange";
    case CATEGORIES[2]:
      return "purple";
    case CATEGORIES[3]:
      return "gold";
    default:
      return "blue";
  }
};

export default function Dashboard() {
  const [categories, setCategories] = useState<string[]>([CATEGORIES[0]]);
  const [markers, setMarkers] = useState<Institute[]>([]);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoriesDisabled, setIsCategoriesDisabled] = useState(true);

  const fetchData = async () => {
    try {
      // Load schools data first
      const kgFacilitiesResponse = await getKgFacilities();
      const kgFacilities = kgFacilitiesResponse.data.map((item: Institute) => ({
        ...item,
        category: CATEGORIES[0],
      }));

      // Set markers for schools and update loading state
      setMarkers(kgFacilities);
      setIsLoading(false);

      // Load other data in the background
      Promise.all([
        getSchoolFacilities(),
        getSocialChildProjectFacilities(),
        getSocialTeenageProjectFacilities(),
      ]).then(
        ([
          schoolFacilitiesResponse,
          socialChildProjectResponse,
          socialTeenageProjectResponse,
        ]) => {
          const schoolFacilities = schoolFacilitiesResponse.data.map(
            (item: Institute) => ({
              ...item,
              category: CATEGORIES[1],
            })
          );

          const socialChildProjectFacilities =
            socialChildProjectResponse.data.map((item: Institute) => ({
              ...item,
              category: CATEGORIES[2],
            }));

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
          setIsCategoriesDisabled(false);
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false); // Update loading state in case of error
    }
  };

  useEffect(() => {
    console.log("HERE MOUNT");
    fetchData();
  }, []);

  useEffect(() => {
    if (categories.length === 0) {
      setCategories([CATEGORIES[0]]);
    }
  }, [categories]);

  const handleCategoryClick = (item: string) => {
    if (categories.includes(item)) {
      if (categories.length > 1) {
        setCategories((prev) => prev.filter((category) => category !== item));
      }
    } else {
      setCategories((prev) => [...prev, item]);
    }
  };

  const filteredMarkers = markers.filter((marker) =>
    categories.includes(marker.category)
  );

  return (
    <>
      <nav className="w-full bg-blue-500 flex justify-between items-center px-8 py-2">
        <div className="flex items-center space-x-2">
          <img
            className="w-16 h-10"
            src={logo}
            alt="Logo"
          />
        </div>
        <ProfileDropdown openProfileSection={() => setIsDrawerOpen(true)} />
      </nav>
      <div>
        <div className="flex justify-center items-center space-x-6 py-5">
          {CATEGORIES.map((item) => (
            <Button
              key={item}
              onClick={() => handleCategoryClick(item)}
              variant={categories.includes(item) ? "solid" : "surface"}
              color={getButtonColor(item)}
              disabled={CATEGORIES[0] !== item && isCategoriesDisabled}
            >
              {item}
            </Button>
          ))}
        </div>

        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {isLoading ? ( // Conditional rendering based on loading state
          <div className="flex justify-center items-center h-[calc(100vh-128px)]">
            <p>Loading...</p> {/* Placeholder for loader */}
          </div>
        ) : (
          <div className="h-[calc(100vh-128px)] ">
            {filteredMarkers.length > 0 && (
              <MapComponent markers={filteredMarkers} />
            )}
          </div>
        )}
      </div>
    </>
  );
}
