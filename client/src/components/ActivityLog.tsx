import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Snowflake,
  Play,
  Trash2,
  Settings,
  AlertTriangle,
  CreditCard,
  Activity,
} from "lucide-react";
import type { ActivityLog as ActivityLogType } from "@shared/schema";

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

const ACTION_CONFIG: Record<
  string,
  { icon: typeof Plus; color: string; bgColor: string }
> = {
  created: { icon: Plus, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  frozen: { icon: Snowflake, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  unfrozen: { icon: Play, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  deleted: { icon: Trash2, color: "text-red-500", bgColor: "bg-red-500/10" },
  limit_updated: { icon: Settings, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  fraud_detected: { icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-500/10" },
  transaction: { icon: CreditCard, color: "text-primary", bgColor: "bg-primary/10" },
  deposit: { icon: Plus, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
};

const DEFAULT_CONFIG = { icon: Activity, color: "text-muted-foreground", bgColor: "bg-muted" };

function ActivityItem({ activity }: { activity: ActivityLogType }) {
  const config = ACTION_CONFIG[activity.action] || DEFAULT_CONFIG;
  const Icon = config.icon;

  return (
    <div
      className="flex items-start gap-2 py-2 border-b border-border last:border-0"
      data-testid={`activity-item-${activity.id}`}
    >
      <div className={`flex-shrink-0 w-6 h-6 rounded-md ${config.bgColor} flex items-center justify-center`}>
        <Icon className={`w-3 h-3 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs leading-tight" data-testid={`text-activity-description-${activity.id}`}>
          {activity.description}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {formatTimeAgo(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}

export function ActivityLog() {
  const { activityLog } = useAppStore();

  if (activityLog.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm sm:text-base flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Activity className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <p className="text-xs text-muted-foreground">No activity yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm sm:text-base flex items-center gap-1.5">
          <Activity className="w-4 h-4" />
          Activity
        </CardTitle>
        <Badge variant="secondary" className="font-mono text-[10px]">
          {activityLog.length}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] sm:h-[250px] px-4">
          {activityLog.slice(0, 20).map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
