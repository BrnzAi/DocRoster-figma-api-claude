export interface Bot {    
    bot_id: string
    portal_id: string
    name: string
    active: boolean
    username: string
    description?: string
    image?: string
    cover_image?: string
    in_catalog: boolean
    settings: any
    connections: []
    blockchain: any
    is_template: boolean
    screenshots: []
    alerts: number
    warnings: []
    url?: string
}