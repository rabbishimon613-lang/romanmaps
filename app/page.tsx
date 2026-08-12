import Map from "./Map";
import Chrome from "./Chrome";
import LeftRail from "./LeftRail";
import CategoryChips from "./CategoryChips";
import PoiMarkers from "./PoiMarkers";
import PeopleMarkers from "./PeopleMarkers";
import MapAttribution from "./MapAttribution";
import Ruler from "./Ruler";
import ZoomControl from "./ZoomControl";
import PlaceDetails from "./PlaceDetails";
import Legend from "./Legend";
import ContextMenu from "./ContextMenu";

export default function Page() {
  return (
    <main style={{ position: "fixed", inset: 0 }}>
      <Map />
      <PoiMarkers />
      <PeopleMarkers />
      <LeftRail />
      <Chrome />
      <CategoryChips />
      <Ruler />
      <Legend />
      <ZoomControl />
      <PlaceDetails />
      <ContextMenu />
      <MapAttribution />
    </main>
  );
}
