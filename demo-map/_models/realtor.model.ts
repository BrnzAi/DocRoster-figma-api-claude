import { RoleEnum } from './role.model'
import { Meta } from './meta.model'
import { PricingPlan } from './pricing-plan.model'

export interface Realtor {    
    id: string,
    name: string,
    email?: string,
    bot_id?: string,
    widgetToken?: string,
    avatar?: string,
    nickname?: string,
    role: RoleEnum,
    portal: string,
    plan: PricingPlan,
    meta: Meta
}