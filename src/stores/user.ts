import { defineStore } from 'pinia'

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

export const useAuthUserStore = defineStore('auth/user', {
  // convert to a function
  state: (): State => ({
    firstName: '',
    lastName: '',
    userId: null
  }),
  getters: {
    // firstName getter removed, no longer needed
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // must define return type because of using `this`
    fullUserDetails (state): any {
      // import from other stores
      return {
        ...state,
        // other getters now on `this`
        fullName: this.fullName,
      }

      // alternative if other modules are still in Vuex
      // return {
      //   ...state,
      //   fullName: this.fullName,
      //   ...vuexStore.state.auth.preferences,
      //   ...vuexStore.getters['auth/email'].details
      // }
    }
  },
  actions: {
    // no context as first argument, use `this` instead
    async loadUser (id: number) {
      if (this.userId !== null) throw new Error('Already logged in')
    //   const res = await api.user.load(id)
      this.updateUser({})
    },
    // mutations can now become actions, instead of `state` as first argument use `this`
    updateUser (payload:any) {
      this.firstName = payload.firstName
      this.lastName = payload.lastName
      this.userId = payload.userId
    },
    // easily reset state using `$reset`
    clearUser () {
      this.$reset()
    }
  }
})