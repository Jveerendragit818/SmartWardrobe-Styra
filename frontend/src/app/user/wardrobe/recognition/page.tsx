
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ImagePlus,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import { apiRequest } from "@/lib/api";

const categories = [
  { label: "T-Shirts", value: "tshirt" },
  { label: "Shirts", value: "shirt" },
  { label: "Trousers", value: "trousers" },
  { label: "Jeans", value: "jeans" },
  { label: "Skirts", value: "skirt" },
  { label: "Dresses", value: "dress" },
  { label: "Jackets", value: "jacket" },
  { label: "Footwear", value: "shoes" },
];

const seasons = [
  { label: "Summer", value: "summer" },
  { label: "Winter", value: "winter" },
  { label: "Rainy", value: "monsoon" },
  { label: "All Seasons", value: "all_season" },
];

const occasions = [
  "Casual",
  "College",
  "Office",
  "Party",
  "Festival",
  "Wedding",
  "Travel",
  "Sports",
];

type Candidate = {
  label?: string;
  value?: string;
  score?: number;
};

type PredictedAttribute = {
  value?: string | null;
  status?: string;
  confidence?: number | null;
  candidates?: Candidate[];
};

type RecognitionResponse = {
  data: {
    model?: string;
    predicted_attributes?: {
      category?: PredictedAttribute;
      color?: PredictedAttribute;
      pattern?: PredictedAttribute;
      season?: PredictedAttribute;
      occasion?: PredictedAttribute;
    };
  } | null;
  error: string | null;
};

type ClothingDetails = {
  category: string;
  color: string;
  pattern: string;
  season: string;
  occasion: string;
};

const initialDetails: ClothingDetails = {
  category: "",
  color: "",
  pattern: "",
  season: "all_season",
  occasion: "",
};

const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#8170C4] focus:ring-2 focus:ring-[#E9E2F5]";

export default function RecognitionPage() {
  const [file, setFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(
    null
  );

  const [analyzing, setAnalyzing] = useState(false);

  const [prediction, setPrediction] =
    useState<RecognitionResponse["data"]>(null);

  const [details, setDetails] =
    useState<ClothingDetails>(initialDetails);

  const [confirmed, setConfirmed] = useState(false);

  const [error, setError] = useState("");

  const [suggestion, setSuggestion] = useState("");

  const [confidence, setConfidence] =
    useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    event.target.value = "";

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(selectedFile.type)
    ) {
      setError(
        "Please upload a JPEG, PNG, or WEBP image."
      );
      return;
    }

    if (selectedFile.size === 0) {
      setError("The selected image is empty.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    setFile(selectedFile);

    setPreview(URL.createObjectURL(selectedFile));

    setPrediction(null);
    setDetails({ ...initialDetails });
    setConfirmed(false);
    setSuggestion("");
    setConfidence(null);
    setError("");
  }

  async function handleAnalyze() {
    if (!file || analyzing) return;

    setAnalyzing(true);
    setError("");
    setPrediction(null);
    setConfirmed(false);
    setSuggestion("");
    setConfidence(null);
    setDetails({ ...initialDetails });

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response =
        await apiRequest<RecognitionResponse>(
          "/recognition/predict",
          {
            method: "POST",
            body: formData,
          }
        );

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error(
          "No recognition result was returned."
        );
      }

      const result = response.data;

      const categoryPrediction =
        result.predicted_attributes?.category;

      const topCandidate =
        categoryPrediction?.candidates?.[0];

      let predictedCategory = "";

      const normalizedCategory =
        categoryPrediction?.value
          ?.trim()
          .toLowerCase() || "";

      // Accept supported normalized categories.
      if (
        categories.some(
          (item) =>
            item.value === normalizedCategory
        )
      ) {
        predictedCategory = normalizedCategory;
      }

      // Verified model mapping:
      // LABEL_6 represents Jeans.
      // This is only a suggestion, not confirmation.
      else if (
        result.model ===
          "wargoninnovation/wargon-clothing-classifier" &&
        topCandidate?.label === "LABEL_6"
      ) {
        predictedCategory = "jeans";
      }

      const categoryLabel =
        categories.find(
          (item) =>
            item.value === predictedCategory
        )?.label || "";

      setSuggestion(categoryLabel);

      const score =
        categoryPrediction?.confidence ??
        topCandidate?.score;

      setConfidence(
        typeof score === "number" &&
          Number.isFinite(score) &&
          score >= 0 &&
          score <= 1
          ? score
          : null
      );

      setDetails({
        category: predictedCategory,
        color:
          result.predicted_attributes?.color
            ?.value || "",
        pattern:
          result.predicted_attributes?.pattern
            ?.value || "",
        season: "all_season",
        occasion: "",
      });

      setPrediction(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze the image."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  function updateDetails(
    field: keyof ClothingDetails,
    value: string
  ) {
    setDetails((previous) => ({
      ...previous,
      [field]: value,
    }));

    setConfirmed(false);
    setError("");
  }

  function handleConfirm() {
    if (
      !details.category ||
      !details.color.trim() ||
      !details.pattern.trim() ||
      !details.season ||
      !details.occasion
    ) {
      setError(
        "Please complete all clothing details before confirming."
      );
      return;
    }

    setConfirmed(true);
    setError("");
  }

  function handleReset() {
    setFile(null);
    setPreview(null);
    setPrediction(null);
    setDetails({ ...initialDetails });
    setConfirmed(false);
    setSuggestion("");
    setConfidence(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 text-[#172A4B] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">

        {/* Back navigation */}
        <Link
          href="/user/wardrobe"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Wardrobe
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
            <Sparkles
              size={28}
              className="shrink-0 text-[#8170C4]"
            />
            AI Clothing Recognition
          </h1>

          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Upload a clothing photo, analyze it with AI,
            and review the suggested details.
          </p>
        </div>

        {/* Image upload */}
        <Card shadow="small">
          <h2 className="mb-4 text-xl font-semibold">
            Upload Clothing Image
          </h2>

          <label
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#C9B9E8] bg-[#F8F5FC] p-5 text-center sm:p-8 ${
              analyzing
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer"
            }`}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Uploaded clothing preview"
                  className="max-h-72 w-full rounded-lg object-contain"
                />

                <p className="mt-4 max-w-full break-all text-sm text-gray-600">
                  {file?.name}
                </p>

                <span className="mt-2 text-sm font-medium text-[#8170C4]">
                  Click to change image
                </span>
              </>
            ) : (
              <>
                <ImagePlus
                  size={48}
                  className="mb-4 text-[#8170C4]"
                />

                <span className="font-medium">
                  Click to upload a clothing image
                </span>

                <span className="mt-2 text-sm text-gray-500">
                  JPEG, PNG or WEBP — maximum 5 MB
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImage}
              disabled={analyzing}
              className="sr-only"
              aria-label="Upload clothing image"
            />
          </label>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              size="medium"
              onClick={handleAnalyze}
              disabled={!file || analyzing}
            >
              <span className="inline-flex items-center gap-2">
                {analyzing ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Sparkles size={18} />
                )}

                {analyzing
                  ? "Analyzing..."
                  : "Analyze Image"}
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="medium"
              onClick={handleReset}
              disabled={analyzing}
            >
              Reset
            </Button>
          </div>
        </Card>

        {/* Loading state */}
        {analyzing && (
          <div
            role="status"
            className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm"
          >
            <Loader2
              size={36}
              className="mx-auto mb-4 animate-spin text-[#8170C4]"
            />

            <h3 className="font-semibold">
              Analyzing your clothing image...
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Please wait while AI processes your photo.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle
              size={20}
              className="shrink-0"
            />

            <p>{error}</p>
          </div>
        )}

        {/* Recognition results */}
        {prediction && !analyzing && (
          <div className="mt-8">
            <Card shadow="small">

              <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
                <Sparkles
                  size={22}
                  className="text-[#8170C4]"
                />
                AI Recognition Results
              </h2>

              {/* AI category suggestion */}
              <div className="mb-6 rounded-xl bg-[#F3F0FA] p-4">
                <p className="text-sm font-semibold">
                  AI Suggested Category
                </p>

                <p className="mt-2 text-lg font-bold">
                  {suggestion ||
                    "Category needs manual review"}
                </p>

                {confidence !== null && suggestion && (
                  <p className="mt-1 text-sm text-gray-600">
                    Model confidence:{" "}
                    {(confidence * 100).toFixed(1)}%
                  </p>
                )}

                <p className="mt-3 text-sm text-gray-600">
                  AI suggestions may be incorrect.
                  Review and confirm the clothing details
                  before adding the item to your wardrobe.
                </p>
              </div>

              <h3 className="mb-4 text-lg font-semibold">
                Review Clothing Details
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium"
                  >
                    Clothing Category
                  </label>

                  <select
                    id="category"
                    value={details.category}
                    onChange={(event) =>
                      updateDetails(
                        "category",
                        event.target.value
                      )
                    }
                    className={fieldClass}
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label
                    htmlFor="color"
                    className="mb-2 block text-sm font-medium"
                  >
                    Color
                  </label>

                  <input
                    id="color"
                    type="text"
                    placeholder="e.g. Blue"
                    value={details.color}
                    onChange={(event) =>
                      updateDetails(
                        "color",
                        event.target.value
                      )
                    }
                    className={fieldClass}
                  />
                </div>

                {/* Pattern */}
                <div>
                  <label
                    htmlFor="pattern"
                    className="mb-2 block text-sm font-medium"
                  >
                    Pattern
                  </label>

                  <input
                    id="pattern"
                    type="text"
                    placeholder="e.g. Solid, Striped"
                    value={details.pattern}
                    onChange={(event) =>
                      updateDetails(
                        "pattern",
                        event.target.value
                      )
                    }
                    className={fieldClass}
                  />
                </div>

                {/* Season */}
                <div>
                  <label
                    htmlFor="season"
                    className="mb-2 block text-sm font-medium"
                  >
                    Season
                  </label>

                  <select
                    id="season"
                    value={details.season}
                    onChange={(event) =>
                      updateDetails(
                        "season",
                        event.target.value
                      )
                    }
                    className={fieldClass}
                  >
                    {seasons.map((item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Occasion */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="occasion"
                    className="mb-2 block text-sm font-medium"
                  >
                    Occasion
                  </label>

                  <select
                    id="occasion"
                    value={details.occasion}
                    onChange={(event) =>
                      updateDetails(
                        "occasion",
                        event.target.value
                      )
                    }
                    className={fieldClass}
                  >
                    <option value="">
                      Select occasion
                    </option>

                    {occasions.map((item) => (
                      <option
                        key={item}
                        value={item.toLowerCase()}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Color, pattern, season and occasion
                should be reviewed manually.
              </p>

              <div className="mt-6">
                <Button
                  type="button"
                  size="medium"
                  onClick={handleConfirm}
                >
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Confirm Clothing Details
                  </span>
                </Button>
              </div>

              {/* Confirmation */}
              {confirmed && (
                <div
                  role="status"
                  className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5"
                >
                  <h3 className="flex items-center gap-2 font-semibold text-green-700">
                    <CheckCircle2
                      size={22}
                      className="shrink-0"
                    />
                    Clothing Details Confirmed
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Category:</strong>{" "}
                      {details.category}
                    </p>

                    <p>
                      <strong>Color:</strong>{" "}
                      {details.color}
                    </p>

                    <p>
                      <strong>Pattern:</strong>{" "}
                      {details.pattern}
                    </p>

                    <p>
                      <strong>Season:</strong>{" "}
                      {
                        seasons.find(
                          (item) =>
                            item.value ===
                            details.season
                        )?.label
                      }
                    </p>

                    <p className="capitalize">
                      <strong>Occasion:</strong>{" "}
                      {details.occasion}
                    </p>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">
                    These details have been confirmed in
                    the frontend. They have not yet been
                    saved to your wardrobe.
                  </p>

                  <Link
                    href="/user/wardrobe/add"
                    className="mt-5 inline-flex rounded-lg bg-[#172A4B] px-5 py-3 text-sm font-medium text-white hover:bg-[#283F65]"
                  >
                    Open Add Clothing Form
                  </Link>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
