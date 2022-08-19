export default interface ViewDocument {
    viewId: number
    viewUrl: string
    viewIp: string
    viewCountry: string
    viewCity: string
    viewRegion: string
    viewDate: string
}

export interface ViewNumberDocument {
    liveTotal: number,
    averageTotal: number,
    weeklyTotal: number
}

export interface ViewStatisticsDocument {
    day: {total: number, viewDate: string}[]
    country: {total: number, viewCountry: string}[]
}

export interface ViewAddParamDocument {
    url: string
    lang: string
}

export interface ViewGetParamDocument {
    ip?: string
    url?: string
    lang?: string
    country?: string
    city?: string
    region?: string
    date?: string
    dateStart?: string
}
