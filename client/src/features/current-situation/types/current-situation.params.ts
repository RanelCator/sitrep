export interface FetchCurrentSituationParams {
  page: number
  pageSize: number
  search?: string
  committee?: string
  areaOfConcern?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}