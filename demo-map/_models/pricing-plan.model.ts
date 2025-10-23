export interface PricingPlan { 
    id: string
    status: string
    mode: string
    bots: any
    products: any
    expires: string
    notified: boolean
    title: string
    stopped_bots: []
}