"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { products, categories, teams } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-border">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="p-4 flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-28 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Quick chips de seleções (visual destacado no topo) */
function TeamChips({ selected, onSelect }: { selected: string; onSelect: (t: string) => void }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 mb-6 scrollbar-thin">
      <div className="flex gap-2 px-4 sm:px-0 min-w-max pb-1">
        {teams.map((team) => {
          const active = selected === team;
          return (
            <button
              key={team}
              onClick={() => onSelect(team)}
              aria-pressed={active}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105"
                  : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
              )}
            >
              {team}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProdutosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("categoria") || "Todos");
  const [selectedTeam, setSelectedTeam]         = useState(searchParams.get("selecao")   || "Todos");
  const [selectedBadge, setSelectedBadge]       = useState(searchParams.get("badge")     || "Todos");
  const [query, setQuery]                       = useState(searchParams.get("q")         || "");
  const [sortBy, setSortBy]                     = useState("relevancia");
  const [filtersOpen, setFiltersOpen]           = useState(false);
  const [page, setPage]                         = useState(1);

  // Sync query state com URL quando muda externalmente (ex: header)
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setSelectedTeam(searchParams.get("selecao") || "Todos");
    setSelectedBadge(searchParams.get("badge") || "Todos");
    setSelectedCategory(searchParams.get("categoria") || "Todos");
    setPage(1);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = products;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "Todos") result = result.filter((p) => p.category === selectedCategory);
    if (selectedTeam     !== "Todos") result = result.filter((p) => p.team     === selectedTeam);
    if (selectedBadge    !== "Todos") result = result.filter((p) => p.badge    === selectedBadge);

    if (sortBy === "menor-preco")  return [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "maior-preco")  return [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "avaliacao")    return [...result].sort((a, b) => b.rating - a.rating);
    if (sortBy === "mais-vendidos") return [...result].sort((a, b) => b.soldCount - a.soldCount);
    return result;
  }, [query, selectedCategory, selectedTeam, selectedBadge, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [query, selectedCategory, selectedTeam, selectedBadge, sortBy]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("q", query.trim());
    else              params.delete("q");
    router.push(`/produtos?${params.toString()}`);
  }

  function clearAll() {
    setSelectedCategory("Todos");
    setSelectedTeam("Todos");
    setSelectedBadge("Todos");
    setQuery("");
    router.push("/produtos");
  }

  const activeFilters = [
    ...(query.trim()              ? [{ label: `"${query}"`,    clear: () => { setQuery(""); router.push("/produtos"); } }] : []),
    ...(selectedCategory !== "Todos" ? [{ label: selectedCategory, clear: () => setSelectedCategory("Todos") }] : []),
    ...(selectedTeam     !== "Todos" ? [{ label: selectedTeam,     clear: () => setSelectedTeam("Todos") }] : []),
    ...(selectedBadge    !== "Todos" ? [{ label: selectedBadge,    clear: () => setSelectedBadge("Todos") }] : []),
  ];

  const badges = ["Todos", "Lançamento", "Promoção", "Retrô", "Edição Limitada", "Goleiro"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2">Catálogo</p>
        <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-foreground mb-2">
          {selectedTeam !== "Todos" ? selectedTeam.toUpperCase() : "PRODUTOS"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2 max-w-2xl">
        <div className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Busque por seleção, modelo ou ano…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl"
            aria-label="Buscar produtos"
          />
        </div>
        <Button type="submit" className="h-11 px-6 font-bold rounded-xl">
          Buscar
        </Button>
      </form>

      {/* Quick chips de seleções */}
      <TeamChips selected={selectedTeam} onSelect={setSelectedTeam} />

      <div className="flex gap-8">
        {/* Sidebar desktop */}
        <aside aria-label="Filtros" className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24 flex flex-col gap-6">
            <div>
              <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Categoria</h2>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={selectedCategory === cat}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Tipo</h2>
              <div className="flex flex-col gap-1">
                {badges.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBadge(b)}
                    aria-pressed={selectedBadge === b}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedBadge === b
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Seleção</h2>
              <div className="flex flex-col gap-1 max-h-80 overflow-y-auto pr-1">
                {teams.map((team) => (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    aria-pressed={selectedTeam === team}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedTeam === team
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {activeFilters.map((f) => (
                <Badge
                  key={f.label}
                  className="bg-secondary text-foreground border border-border gap-2 pl-3 pr-2 py-1 text-xs font-semibold"
                >
                  {f.label}
                  <button onClick={f.clear} aria-label={`Remover filtro ${f.label}`} className="hover:text-destructive transition-colors">
                    <X aria-hidden="true" className="size-3" />
                  </button>
                </Badge>
              ))}
              {activeFilters.length > 1 && (
                <button onClick={clearAll} className="text-xs text-primary hover:underline font-semibold">
                  Limpar tudo
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setFiltersOpen(!filtersOpen)}
                aria-expanded={filtersOpen}
                aria-controls="mobile-filters"
              >
                <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
                Filtros
              </Button>

              <label htmlFor="sort-select" className="sr-only">Ordenar por</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-2 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="relevancia">Relevância</option>
                <option value="mais-vendidos">Mais vendidos</option>
                <option value="menor-preco">Menor preço</option>
                <option value="maior-preco">Maior preço</option>
                <option value="avaliacao">Melhor avaliação</option>
              </select>
            </div>
          </div>

          {/* Mobile filters */}
          {filtersOpen && (
            <div id="mobile-filters" className="lg:hidden mb-6 p-4 bg-secondary rounded-2xl border border-border flex flex-col gap-4">
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Tipo</h2>
                <div className="flex flex-wrap gap-1.5">
                  {badges.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBadge(b)}
                      aria-pressed={selectedBadge === b}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                        selectedBadge === b ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground border border-border"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Categoria</h2>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      aria-pressed={selectedCategory === cat}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                        selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground border border-border"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          {paged.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {paged.map((product, i) => (
                  <div key={product.id} className="animate-card" style={{ animationDelay: `${i * 30}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Paginação" className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={page === 1}
                    aria-label="Página anterior"
                    className="rounded-full"
                  >
                    <ChevronLeft aria-hidden="true" className="size-4" />
                  </Button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    // Show first, last, current, and neighbors
                    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) {
                      return (
                        <button
                          key={n}
                          onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          aria-current={page === n ? "page" : undefined}
                          className={cn(
                            "size-9 rounded-full text-sm font-bold transition-colors",
                            page === n
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-secondary"
                          )}
                        >
                          {n}
                        </button>
                      );
                    }
                    if (Math.abs(n - page) === 2) return <span key={n} className="text-muted-foreground">…</span>;
                    return null;
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={page === totalPages}
                    aria-label="Próxima página"
                    className="rounded-full"
                  >
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </Button>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-24 flex flex-col items-center gap-4">
              <span className="font-display text-6xl text-muted-foreground/20" aria-hidden="true">0</span>
              <p className="text-lg font-semibold text-foreground">Nenhum produto encontrado</p>
              <p className="text-sm text-muted-foreground">Tente outros termos de busca ou remova os filtros</p>
              <Button onClick={clearAll} className="mt-2 rounded-full">
                Limpar tudo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10"><ProductsSkeleton /></div>}>
      <ProdutosContent />
    </Suspense>
  );
}
