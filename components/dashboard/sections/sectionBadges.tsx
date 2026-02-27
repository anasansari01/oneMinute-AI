import { Badge } from "@/components/ui/badge";

export const getToneBadge = (tone: Tone) => {
  switch (tone) {
    case "strict":
      return (
        <Badge
          variant="outline"
          className="border-red-500/40 text-red-400 bg-red-500/5"
        >
          Strict
        </Badge>
      );

    case "neutral":
      return (
        <Badge
          variant="outline"
          className="border-blue-500/40 text-blue-400 bg-blue-500/5"
        >
          Neutral
        </Badge>
      );

    case "friendly":
      return (
        <Badge
          variant="outline"
          className="border-indigo-500/40 text-indigo-400 bg-indigo-500/5"
        >
          Friendly
        </Badge>
      );

    case "empathetic":
      return (
        <Badge
          variant="outline"
          className="border-purple-500/40 text-purple-400 bg-purple-500/5"
        >
          Empathetic
        </Badge>
      );

    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const getSectionStatusBadge = (status: SectionsStatus) => {
  switch (status) {
    case "active":
      return (
        <Badge
          variant="success"
          className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 shadow-none"
        >
          Active
        </Badge>
      );
    case "draft":
      return (
        <Badge
          variant="secondary"
          className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 shadow-none"
        >
          Draft
        </Badge>
      );
    case "disabled":
      return (
        <Badge
          variant="outline"
          className="bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20 border-zinc-500/20 shadow-none"
        >
          Disabled
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};