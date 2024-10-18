import { PropsWithChildren } from "react"
import { ReactMarkdown, ReactMarkdownOptions } from "react-markdown/lib/react-markdown"

const LazyLoadableReactMarkdown: React.FC<PropsWithChildren<ReactMarkdownOptions>> = (props) => {
  return <ReactMarkdown {...props}></ReactMarkdown>
}

export default LazyLoadableReactMarkdown;

