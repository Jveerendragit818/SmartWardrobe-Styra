
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";

const categories = [
  "Tops",
  "Shirts",
  "T-Shirts",
  "Denims",
  "Bottoms",
  "Dresses",
  "Ethnic Wear",
  "Active Wear",
  "Footwear",
  "Accessories",
];

type Prediction = {
  category: string;
  color: string;
  season: string;
};

export default function RecognitionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMessage("Please upload a JPG or PNG image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setPrediction(null);
    setMessage("");
    event.target.value = "";
  }

  function handleAnalyze() {
    if (!image || analyzing) {
      setMessage("Please upload an image first.");
      return;
    }

    setAnalyzing(true);
    setPrediction(null);
    setMessage("");

    // UI demonstration only.
    // Replace this with an AI API call during integration.
    setTimeout(() => {
      setPrediction({
        category: "Tops",
        color: "Blue",
        season: "All Seasons",
      });
      setAnalyzing(false);
      setMessage(
        "Demo prediction generated. Review and edit the details."
      );
    }, 1500);
  }

  function updatePrediction(
    field: keyof Prediction,
    value: string
  ) {
    setPrediction((previous) =>
      previous ? { ...previous, [field]: value } : null
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-5 py-10 text-[#17233F] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/user/wardrobe"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Wardrobe
        </Link>

        <h1 className="text-3xl font-bold">
          AI Clothing Recognition
        </h1>
        <p className="mb-8 mt-3 text-gray-600">
          Upload a clothing photo and review suggested details.
        </p>

        <Card shadow="small">
          <h2 className="mb-4 text-xl font-semibold">
            Upload Clothing Image
          </h2>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#C9B9E8] bg-[#F8F5FC] p-8 text-center">
            {image ? (
              <img
                src={image}
                alt="Clothing preview"
                className="max-h-64 rounded-lg object-contain"
              />
            ) : (
              <>
                <ImagePlus
                  size={48}
                  className="mb-4 text-[#8872B3]"
                />
                <span className="font-medium">
                  Click to upload a clothing image
                </span>
                <span className="mt-2 text-sm text-gray-500">
                  JPG or PNG, maximum 5 MB
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImage}
              className="sr-only"
              aria-label="Upload clothing image"
            />
          </label>

          <div className="mt-6">
            <Button
              type="button"
              size="medium"
              onClick={handleAnalyze}
              disabled={!image || analyzing}
            >
              <span className="inline-flex items-center gap-2">
                {analyzing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Sparkles size={18} />
                )}
                {analyzing ? "Analyzing..." : "Analyze Image"}
              </span>
            </Button>
          </div>

          {message && (
            <p
              role="status"
              className="mt-5 rounded-lg bg-[#E9E2F5] px-4 py-3 text-sm"
            >
              {message}
            </p>
          )}
        </Card>

        {prediction && (
          <div className="mt-8">
            <Card shadow="small">
              <div className="mb-5 flex items-center gap-2">
                <CheckCircle2
                  size={24}
                  className="text-[#77649B]"
                />
                <h2 className="text-xl font-semibold">
                  Editable AI Predictions
                </h2>
              </div>

              <p className="mb-6 text-sm text-gray-600">
                These are demonstration values, not real AI
                predictions. Edit them as needed.
              </p>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Clothing Category
                  </label>
                  <select
                    id="category"
                    value={prediction.category}
                    onChange={(event) =>
                      updatePrediction(
                        "category",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="color"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Detected Color
                  </label>
                  <input
                    id="color"
                    type="text"
                    value={prediction.color}
                    onChange={(event) =>
                      updatePrediction(
                        "color",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="season"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Suggested Season
                  </label>
                  <select
                    id="season"
                    value={prediction.season}
                    onChange={(event) =>
                      updatePrediction(
                        "season",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                  >
                    {[
                      "Summer",
                      "Winter",
                      "Rainy",
                      "All Seasons",
                    ].map((season) => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Saving recognized items to your wardrobe
                will be connected during backend integration.
              </p>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
