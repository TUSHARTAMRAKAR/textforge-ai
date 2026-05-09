"use client";
import { useEffect, useState } from "react";
import { HistoryCard } from "@/components/HistoryCard";
import { api, Generation } from "@/lib/api";
import { Loader2, History, Inbox } from "lucide-react";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  const fetchHistory = async (p = 1) => {
    try {
      setLoading(true);
      const res = await api.getHistory(p);
      setGenerations(res.data);
      setTotalPages(res.pagination.pages);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(page); }, [page]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteGeneration(id);
      setGenerations((prev) => prev.filter((g) => g._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <History size={24} className="text-brand-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">History</h1>
          <p className="text-gray-400 text-sm">All your past generations</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-brand-400 animate-spin" />
        </div>
      ) : generations.length === 0 ? (
        <div className="card p-16 text-center">
          <Inbox size={40} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No generations yet</p>
          <p className="text-gray-600 text-sm mt-1">
            Head to the generator to create your first one.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {generations.map((gen) => (
              <HistoryCard key={gen._id} generation={gen} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-sm px-4 py-2"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-gray-400 text-sm">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary text-sm px-4 py-2"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
