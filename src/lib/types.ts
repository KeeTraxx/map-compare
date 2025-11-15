export interface Layer {
  'ows:Title': string;
  'ows:Abstract': string;
  'ows:WGS84BoundingBox': OwsWgs84BoundingBox;
  'ows:Identifier': string;
  'ows:Metadata': OwsMetadata;
  Style: Style;
  Format: string;
  Dimension: Dimension;
  TileMatrixSetLink: TileMatrixSetLink;
  ResourceURL: ResourceUrl;
  visible: boolean;
}

export interface OwsWgs84BoundingBox {
  'ows:LowerCorner': string;
  'ows:UpperCorner': string;
}

export interface OwsMetadata {
  '@_xlink:href': string;
}

export interface Style {
  'ows:Title': string;
  'ows:Identifier': string;
  LegendURL: LegendUrl;
}

export interface LegendUrl {
  '@_format': string;
  '@_xlink:href': string;
}

export interface Dimension {
  'ows:Identifier': string;
  Default: string;
  Value: string;
}

export interface TileMatrixSetLink {
  TileMatrixSet: string;
}

export interface ResourceUrl {
  '@_format': string;
  '@_resourceType': string;
  '@_template': string;
}
