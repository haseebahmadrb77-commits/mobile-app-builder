import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useCategories } from "@/hooks/useBooks";
import { 
  BookOpen, 
  Sparkles, 
  BookMarked, 
  ScrollText, 
  Feather, 
  History,
  GraduationCap,
  Heart,
  Globe,
  BookText
} from "lucide-react";

import { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "sparkles": Sparkles,
  "book-marked": BookMarked,
  "scroll-text": ScrollText,
  "feather": Feather,
  "history": History,
  "graduation-cap": GraduationCap,
  "heart": Heart,
  "globe": Globe,
  "book-text": BookText,
};

const getIconComponent = (iconName: string | null): LucideIcon => {
  if (!iconName) return BookOpen;
  return iconMap[iconName] || BookOpen;
};

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();

  // Separate parent categories and subcategories
  const parentCategories = categories.filter(c => !c.parent_id);
  const getSubcategories = (parentId: string) => 
    categories.filter(c => c.parent_id === parentId);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Browse Categories
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore our collection organized by topics and genres
          </p>
        </div>

        {/* Main Categories */}
        {parentCategories.length > 0 && (
          <div className="mb-10 grid gap-4 sm:grid-cols-2">
            {parentCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                id={category.slug}
                name={category.name}
                description={category.description || ""}
                bookCount={category.book_count || 0}
                icon={getIconComponent(category.icon)}
                variant="featured"
                className={`min-h-[160px] ${
                  index % 2 === 1 ? "bg-gradient-to-br from-secondary to-secondary/80" : ""
                }`}
              />
            ))}
          </div>
        )}

        {/* Subcategories for each parent */}
        {parentCategories.map((parent) => {
          const subcategories = getSubcategories(parent.id);
          if (subcategories.length === 0) return null;

          return (
            <section key={parent.id} className="mb-10">
              <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
                {parent.name}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subcategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    id={category.slug}
                    name={category.name}
                    description={category.description || ""}
                    bookCount={category.book_count || 0}
                    icon={getIconComponent(category.icon)}
                    href={`/books/${parent.slug}?subcategory=${category.slug}`}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Fallback if no categories */}
        {parentCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
