import { useState, useEffect } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { useParams } from 'react-router-dom'

// Define types for MDX module
interface MDXModule {
  default: React.ComponentType
  frontmatter?: {
    title?: string
    date?: string
    [key: string]: any
  }
}

interface PostProps {
  filePath: string
  loader: () => Promise<MDXModule>
}

// Custom components for MDX content
const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold my-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold my-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold my-2" {...props} />,
  p: (props: any) => <p className="my-2" {...props} />,
  a: (props: any) => <a className="text-blue-600 hover:underline" {...props} />,
  // Add more component customizations as needed
}

export function Post({ filePath, loader }: PostProps) {
  const [Content, setContent] = useState<React.ComponentType | null>(null)
  const [frontmatter, setFrontmatter] = useState<MDXModule['frontmatter']>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get URL params to potentially use for dynamic behavior
  const params = useParams()

  useEffect(() => {
    async function loadContent() {
      try {
        const module = await loader()
        console.log('Loaded MDX module:', module)
        
        // Store the component and frontmatter
        setContent(() => module.default)
        setFrontmatter(module.frontmatter || {})
      } catch (err) {
        console.error(`Failed to load post: ${filePath}`, err)
        setError(`Failed to load post: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [filePath, loader])

  if (loading) {
    return <div className="p-4">Loading post...</div>
  }

  if (error || !Content) {
    return <div className="p-4 text-red-500">Error: {error || 'Failed to load post content'}</div>
  }

  return (
    <article className="post-container max-w-3xl mx-auto p-6">
      {/* Display frontmatter data if available */}
      {frontmatter.title && (
        <header className="mb-8">
          <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
          {frontmatter.date && (
            <time dateTime={frontmatter.date} className="text-gray-500">
              {new Date(frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </time>
          )}
        </header>
      )}
      
      {/* Render MDX content with customized components */}
      <div className="prose prose-lg">
        <MDXProvider components={components}>
          <Content />
        </MDXProvider>
      </div>
    </article>
  )
}