import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Post } from './pages/post/Post.tsx'
import { MDXModule } from 'mdx/types'
const baseUrl = import.meta.env.BASE_URL || '/'

const postModules = import.meta.glob('./posts/**/*.mdx')

const postPaths = Object.keys(postModules)
console.log(postPaths)
console.log("asdassdads")

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    ...postPaths.map((path) => ({
      path: path.replace('./posts', '/posts').replace('.mdx', ''),
      element: <Post filePath={path} loader={postModules[path] as () => Promise<MDXModule>} />,
    })),
  ],
  {
    basename: baseUrl,
  }
)

function Root() {
  return (
    <RouterProvider router={router} />
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
