
import { cn } from "@/lib/utils";
import { VehicleCategory } from "./types";

type CategoryFiltersProps = {
  categories: VehicleCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
};

const CategoryFilters = ({ categories, selectedCategory, onSelectCategory }: CategoryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-10 justify-center">
      {categories.map((category) => (
        <button
          key={category.id}
          className={cn(
            "px-6 py-3 rounded-full text-sm font-medium transition-colors border flex items-center gap-2",
            selectedCategory === category.id
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-gray-700 border-gray-200 hover:bg-red-50 hover:border-red-100"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.icon && <category.icon className="h-4 w-4" />}
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;
