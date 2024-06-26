import L, { LatLngBounds, LatLngTuple } from 'leaflet'

/**
 * Transform the string polygon description retrieved by FHIR (POLYGON((lat lng, lat lng, ...))) into an array of LatLngTuple
 */
export const parseShape = (polygons?: string): LatLngTuple[] | null => {
  if (!polygons) return null
  const shapes: LatLngTuple[][] = polygons
    .split('|')
    .map((polygon) => {
      const m = polygon.match(/POLYGON\(\((.*)\)\)/)
      if (m) {
        return m[1].split(',').map((latlng) => {
          const [lng, lat] = latlng.trim().split(' ')
          return [parseFloat(lat), parseFloat(lng)]
        })
      }
      return null
    })
    .filter((polygon) => polygon !== null)
    .map((polygon) => polygon as LatLngTuple[])
  if (shapes.length === 0) {
    return null
  } else {
    return shapes[0]
  }
}

/**
 * Compute the near Location param (https://www.hl7.org/fhir/R4/location.html#search) from the map viewbox bounds
 */
export const computeNearFilter = (map: L.Map, bounds: LatLngBounds): string => {
  const center = bounds.getCenter()
  const r1 = map.distance(center, bounds.getNorthEast())
  const r2 = map.distance(center, bounds.getSouthEast())
  return `${center.lat}|${center.lng}|${Math.round(Math.max(r1, r2) / 1000)}`
}

/**
 * Explode the map viewbox bounds into a mesh of smaller bounds
 */
export const explodeBoundsIntoMesh = (map: L.Map, bounds: LatLngBounds, meshUnitSize: number): LatLngBounds[] => {
  const ne = map.project(bounds.getNorthEast())
  const sw = map.project(bounds.getSouthWest())
  const width = ne.x - sw.x
  const height = sw.y - ne.y
  const widthDistance = map.distance(bounds.getNorthEast(), bounds.getNorthWest())
  const pixelToDistanceRatio = widthDistance / width
  const heightDistance = height * pixelToDistanceRatio
  const xSteps = Math.min(Math.floor(widthDistance / meshUnitSize), 100)
  const ySteps = Math.min(Math.floor(heightDistance / meshUnitSize), 100)
  const xStepSize = width / xSteps
  const yStepSize = height / ySteps
  const mesh: LatLngBounds[] = []
  for (let i = 1; i < xSteps - 1; i++) {
    for (let j = 1; j < ySteps - 1; j++) {
      const bsw = map.unproject([sw.x + i * xStepSize, sw.y - j * yStepSize])
      const bne = map.unproject([sw.x + (i + 1) * xStepSize, sw.y - (j + 1) * yStepSize])
      mesh.push(new LatLngBounds(bsw, bne))
    }
  }
  return mesh
}

export const isBoundCovered = (map: L.Map, bounds: LatLngBounds, loadedBounds: LatLngBounds[]): boolean => {
  // Explode the current viewbox bounds into a mesh of smaller bounds
  const boundMesh = explodeBoundsIntoMesh(map, bounds, 1000)
  // Search for a mesh unit that is not covered by the already loaded bounds
  const meshUnitNotCovered = boundMesh.find((b) => {
    if (loadedBounds.some((lb) => lb.contains(b))) {
      return false
    }
    return true
  })
  return !meshUnitNotCovered
}

/**
 * Colorize a count based on a color palette
 */
export const colorize = (colorPalette: string[], count: number, maxCount: number): string => {
  const step = maxCount / colorPalette.length
  const colorIndex = Math.floor(count / step)
  if (colorIndex > colorPalette.length) {
    return colorPalette[colorPalette.length - 1]
  }
  return colorPalette[colorIndex]
}
