"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { components as LocationComponents } from "@/lib/location-api";
import ClientLayout from "@/components/ui/client-layout";

type Store = LocationComponents["schemas"]["locations.location"];

type SearchParams = {
  zipCode?: string;
  city?: string;
  chain?: string;
  page?: number;
};

export default function SelectStorePage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<SearchParams>({ page: 1 });
  const [total, setTotal] = useState<number | null>(null);
  const [limit] = useState(5);
  const [searchValue, setSearchValue] = useState("");

  // Fetch stores from API
  async function fetchStores() {
    setLoading(true);
    setError(null);
    const query = [];
    if (searchValue) {
      if (/^\d{5}$/.test(searchValue.trim())) {
        // Looks like a zip code
        query.push(`filter.zipCode.near=${encodeURIComponent(searchValue.trim())}`);
      } else {
        // Otherwise, treat as city and chain
        query.push(`filter.city=${encodeURIComponent(searchValue.trim())}`);
        query.push(`filter.chain=${encodeURIComponent(searchValue.trim())}`);
      }
    }
    query.push(`filter.limit=${limit}`);
    if (search.page && search.page > 1) query.push(`filter.start=${(search.page - 1) * limit}`);
    const url = `/api/proxy/locations?${query.join("&")}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setStores(data.data || []);
      setTotal(data.meta?.pagination?.total || null);
    } catch (e) {
      setError("Failed to fetch stores");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Handle search form submit
  function handleSearch() {
    fetchStores();
  }

  // Handle pagination
  function handlePageChange(newPage: number) {
    setSearch(s => ({ ...s, page: newPage }));
    fetchStores();
  }

  // Save store and redirect
  function selectStore(store: Store) {
    localStorage.setItem("selectedStore", JSON.stringify(store));
    router.push("/shopping-list");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClientLayout>
        <div className="flex-1 relative">
          {/* Black background strip, extends halfway down */}
          <div className="absolute top-0 left-0 w-full h-40 bg-black z-0" />
          <div className="relative z-10 max-w-2xl mx-auto pt-20 pb-10 gap-8">
            <Card className="-mt-8 shadow-lg">
              <CardHeader>
                <CardTitle>Select a Store</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-4">
                  <Input
                    placeholder="Zip code, city, or chain"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    className="mb-2"
                  />
                  <Button type="submit" disabled={loading}>Search</Button>
                </form>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {stores.map(store => (
                      <Card key={store.locationId} className="border p-2 cursor-pointer hover:bg-muted" onClick={() => selectStore(store)}>
                        <CardContent>
                          <div className="font-medium">{store.name}</div>
                          <div className="text-sm text-muted-foreground">{store.address?.addressLine1}, {store.address?.city}, {store.address?.state} {store.address?.zipCode}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {/* Pagination */}
                {total && total > limit && (
                  <div className="flex gap-2 mt-4 justify-center">
                    <Button size="sm" variant="outline" disabled={search.page === 1} onClick={() => handlePageChange((search.page || 1) - 1)}>
                      Previous
                    </Button>
                    <span>Page {search.page}</span>
                    <Button size="sm" variant="outline" disabled={stores.length < limit} onClick={() => handlePageChange((search.page || 1) + 1)}>
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </ClientLayout>
      <footer className="w-full bg-black text-primary-foreground py-6 mt-10 text-center">
        <span className="opacity-70">&copy; 2025 Shopping List App</span>
      </footer>
    </div>
  );
} 