import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface TechnicianReviewsProps {
  technicianId: string;
}

const TechnicianReviews: React.FC<TechnicianReviewsProps> = ({ technicianId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("id, rating, comment, created_at")
          .eq("technician_id", technicianId)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [technicianId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-4">
        No reviews yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <Card key={review.id} className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(new Date(review.created_at), "MMM d, yyyy")}
              </span>
            </div>
            {review.comment && (
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TechnicianReviews;
