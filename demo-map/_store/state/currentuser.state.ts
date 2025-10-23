import { Realtor } from '../../_models/realtor.model'
import { Bot } from '../../_models/bot.model'

export interface CurrentUserState {
    user: Realtor
    token: string
    category: string
    bot: string
}

export const initialCurrentUserState: CurrentUserState = {
    user: null,
    token: localStorage.getItem('access_token'),
    category: null,
    bot: null
};