export default interface SettingsDocument {
    settingId: number,
    settingValue: string
}

export interface SettingGetParamDocument {
    id?: number
}

export interface SettingUpdateParamDocument {
    settings: {
        id: number,
        value: string
    }[]
}