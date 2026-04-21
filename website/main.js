import { registerRoutes, navigate } from '../framework/router/index.js'

const pages = import.meta.glob('./app/**/page.{jsx,tsx}', { eager: true })
const layouts = import.meta.glob('./app/**/layout.{jsx,tsx}', { eager: true })
const notFound = import.meta.glob('./app/**/404.{jsx,tsx}', { eager: true })

registerRoutes({ ...pages, ...layouts, ...notFound })

document.addEventListener('DOMContentLoaded', () => {
  navigate(window.location.pathname + window.location.search)
})
