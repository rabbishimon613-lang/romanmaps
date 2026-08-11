import Map from "./Map";
import Chrome from "./Chrome";

export default function Page() {
  return (
    <main style={{ position: "fixed", inset: 0 }}>
      <Map />
      <Chrome />
    </main>
  );
}
