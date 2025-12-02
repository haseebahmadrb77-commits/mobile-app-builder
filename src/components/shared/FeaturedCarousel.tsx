import { BookCard } from "./BookCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Book {
  id: string;
  title: string;
  author: string;
  rating?: number;
  category?: string;
  coverUrl?: string;
}

interface FeaturedCarouselProps {
  books: Book[];
  title?: string;
}

export function FeaturedCarousel({ books }: FeaturedCarouselProps) {
  if (books.length === 0) return null;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {books.map((book) => (
          <CarouselItem
            key={book.id}
            className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5"
          >
            <BookCard
              id={book.id}
              title={book.title}
              author={book.author}
              rating={book.rating}
              category={book.category}
              coverUrl={book.coverUrl}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-2 hidden border-border bg-background/80 backdrop-blur-sm md:-left-4 md:flex" />
      <CarouselNext className="-right-2 hidden border-border bg-background/80 backdrop-blur-sm md:-right-4 md:flex" />
    </Carousel>
  );
}
