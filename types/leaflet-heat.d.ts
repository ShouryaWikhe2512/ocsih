// src/types/leaflet-heat.d.ts
import * as L from "leaflet";

declare module "leaflet.heat" {
  // Basic typing: exports a factory function that returns an L.Layer
  // You can expand 'HeatLayerOptions' if you want more accurate types later.
  export interface HeatLayerOptions {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    max?: number;
    // ...other options as any
    [key: string]: any;
  }

  export function heatLayer(
    points: Array<[number, number, number] | [number, number]>,
    options?: HeatLayerOptions
  ): L.Layer;

  // default export for some builds
  const heat: {
    (points: Array<[number, number, number] | [number, number]>, options?: HeatLayerOptions): L.Layer;
  };

  export default heat;
}
