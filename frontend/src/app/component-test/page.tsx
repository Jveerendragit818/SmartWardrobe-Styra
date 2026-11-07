
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";

export default function ComponentTestPage() {
  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-[#17233F]">
          SmartWardrobe
        </h1>

        <p className="mb-8 text-gray-600">
          Shared Component Testing
        </p>

        <Card>
          <h2 className="mb-5 text-xl font-semibold text-[#17233F]">
            Button Components
          </h2>

          <div className="flex flex-wrap gap-4">
            <Button variant="primary">
              Add to Wardrobe
            </Button>

            <Button variant="secondary">
              Plan Outfit
            </Button>

            <Button variant="outline">
              Cancel
            </Button>
          </div>
        </Card>

        <div className="mt-6">
          <Card>
            <h2 className="mb-5 text-xl font-semibold text-[#17233F]">
              Input Component
            </h2>

            <Input
              label="Your Name"
              placeholder="Enter your name"
              name="name"
            />
          </Card>
        </div>
      </div>
    </main>
  );
}
