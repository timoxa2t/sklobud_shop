
export const DARK_THEME = "dark-theme"
export const WHITE_THEME = "white-theme"

// const hourOfDay = new Date().getHours();

const defaultParams = {
  showModal: false,
  quickCall: false,
  loginErrorMessage: "",
  currentTheme: WHITE_THEME,
}



const SHOW_MODAL = "SHOW_MODAL"
const HIDE_MODAL = "HIDE_MODAL"
const LOGIN_ERROR = "LOGIN_ERROR"
const CHANGE_THEME = "CHANGE_THEME"
const SHOW_QUICK_CALL = "SHOW_QUICK_CALL"

export const setShowModal = (showModal) => ({type: showModal ? SHOW_MODAL: HIDE_MODAL})
export const setLoginErrorMessage = (errorMessage) => ({type: LOGIN_ERROR, message: errorMessage})
export const setCurrentTheme = (theme) => ({type: CHANGE_THEME, theme: theme})
export const setQuickCall = (showQuickCall) => ({type: SHOW_QUICK_CALL, showQuickCall: showQuickCall})

export function displayReducer(state=defaultParams, action){
  switch(action.type){
    case SHOW_MODAL:
      return getNewState(state, {showModal: true, loginErrorMessage: ""})
    case HIDE_MODAL:
      return getNewState(state, {showModal: false, loginErrorMessage: ""})
    case LOGIN_ERROR:
      return getNewState(state, {loginErrorMessage: action.message})
    case CHANGE_THEME:
      return getNewState(state, {currentTheme: action.theme})
    case SHOW_QUICK_CALL:
      return getNewState(state, {quickCall: action.showQuickCall})
    default:
      return state
  }
}

const getNewState = (state, change) => {
  const newState = {}
  Object.assign(newState, state)
  for(const [key, value] of Object.entries(change)){
    newState[key] = value
  }
  return newState
}
