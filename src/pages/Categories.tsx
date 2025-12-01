import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/shared/CategoryCard";
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

const generalCategories = [
  { id: "fiction", name: "Fiction", description: "Novels, short stories, and literary fiction", bookCount: 450, icon: Feather },
  { id: "non-fiction", name: "Non-Fiction", description: "Biography, history, and educational books", bookCount: 380, icon: BookText },
  { id: "poetry", name: "Poetry", description: "Classical and contemporary poetry collections", bookCount: 120, icon: ScrollText },
  { id: "history", name: "History", description: "Historical accounts and civilizations", bookCount: 290, icon: History },
  { id: "education", name: "Education", description: "Learning materials and academic resources", bookCount: 560, icon: GraduationCap },
  { id: "self-help", name: "Self Help", description: "Personal development and motivation", bookCount: 180, icon: Heart },
];

const islamicCategories = [
  { id: "quran", name: "Quran & Tafsir", description: "Quranic text and interpretations", bookCount: 320, icon: BookMarked },
  { id: "hadith", name: "Hadith", description: "Prophetic traditions and collections", bookCount: 280, icon: ScrollText },
  { id: "fiqh", name: "Fiqh & Islamic Law", description: "Jurisprudence and legal rulings", bookCount: 240, icon: BookText },
  { id: "seerah", name: "Seerah", description: "Life of Prophet Muhammad (PBUH)", bookCount: 150, icon: History },
  { id: "aqeedah", name: "Aqeedah", description: "Islamic creed and theology", bookCount: 180, icon: Sparkles },
  { id: "spirituality", name: "Spirituality", description: "Sufism and spiritual development", bookCount: 220, icon: Heart },
];

export default function Categories() {
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
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <CategoryCard
            id="general"
            name="General Books"
            description="Fiction, non-fiction, poetry, and educational materials"
            bookCount={2500}
            icon={BookOpen}
            variant="featured"
            className="min-h-[160px]"
          />
          <CategoryCard
            id="islamic"
            name="Islamic Books"
            description="Quran, Hadith, Fiqh, Tafsir, and Islamic sciences"
            bookCount={2500}
            icon={Globe}
            variant="featured"
            className="min-h-[160px] bg-gradient-to-br from-secondary to-secondary/80"
          />
        </div>

        {/* General Books Subcategories */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            General Literature
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {generalCategories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                description={category.description}
                bookCount={category.bookCount}
                icon={category.icon}
                href={`/books/general?subcategory=${category.id}`}
              />
            ))}
          </div>
        </section>

        {/* Islamic Books Subcategories */}
        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Islamic Literature
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {islamicCategories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                description={category.description}
                bookCount={category.bookCount}
                icon={category.icon}
                href={`/books/islamic?subcategory=${category.id}`}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
