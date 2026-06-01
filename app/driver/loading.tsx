import { RouteLoadingScreen } from "@/components/shared/route-loading-screen";

export default function Loading() {
  return <RouteLoadingScreen message="Loading assigned route, vehicle, cargo, and map data." title="Opening driver view" />;
}
