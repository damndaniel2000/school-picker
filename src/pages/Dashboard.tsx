import { useState } from "react";
import { Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

const CATEGORIES = [
    "Schools",
    "Kindertageseinrichtungen",
    "Schulsozialarbeit",
    "Jugendberufshilfe",
];

export default function Dashboard() {
    const [categories, setCategories] = useState<string[]>(["Schools"]);

    const handleCategoryClick = (item: string) => {
        if (categories.includes(item)) {
            setCategories((prev) => prev.filter((category) => category !== item));
        } else setCategories((prev) => [...prev, item]);
    };

    return (
        <>
            <nav className="w-full bg-blue-500 flex justify-center items-center px-8 py-4">
                <h1>Sexiest Project Ever</h1>
            </nav>
            <div>
                <div className="flex justify-center items-center space-x-6 py-5">
                    {CATEGORIES.map(item =>
                        <Button
                            onClick={() => handleCategoryClick(item)}
                            variant={categories.includes(item) ? "solid" : "surface"}
                        >
                            {item}
                        </Button>
                    )}
                </div>

                <div className="h-[calc(100vh-128px)] bg-blue-200">
                    Map will come here
                </div>
            </div>
        </>
    );
}
