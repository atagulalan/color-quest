import React, { useState, useEffect } from 'react'
import './DocumentViewer.css'

export interface DocumentContent {
  title: string
  lastUpdated?: string
  introduction?: string
  sections: DocumentSection[]
}

export interface DocumentSection {
  heading: string
  content: string
}

interface DocumentViewerProps {
  documentUrl: string
  title: string
  onClose: () => void
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentUrl,
  title,
  onClose
}) => {
  const [document, setDocument] = useState<DocumentContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(documentUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load document: ${res.statusText}`)
        }
        return res.json()
      })
      .then((data: DocumentContent) => {
        setDocument(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading document:', err)
        setError(err.message || 'Failed to load document')
        setLoading(false)
      })
  }, [documentUrl])

  return (
    <div className="document-viewer-page">
      <div className="document-viewer-header">
        <button className="document-viewer-back-button" onClick={onClose}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="document-viewer-title">{title}</h1>
        <div className="document-viewer-header-spacer"></div>
      </div>

      <div className="document-viewer-content">
        {loading && (
          <div className="document-viewer-loading">Loading document...</div>
        )}

        {error && (
          <div className="document-viewer-error">
            <p>Error: {error}</p>
            <button onClick={onClose} className="document-viewer-error-button">
              Go Back
            </button>
          </div>
        )}

        {document && !loading && !error && (
          <>
            <div className="document-viewer-main-title">
              {document.title}
            </div>
            {document.lastUpdated && (
              <div className="document-viewer-last-updated">
                Son güncelleme: {document.lastUpdated}
              </div>
            )}

            {document.introduction && (
              <div className="document-viewer-introduction">
                {document.introduction}
              </div>
            )}

            {document.sections.map((section, index) => (
              <div key={index} className="document-viewer-section">
                <h2 className="document-viewer-section-heading">
                  {section.heading}
                </h2>
                <div className="document-viewer-section-content">
                  {section.content.split('\n').map((paragraph, pIndex) => {
                    // Check if paragraph contains email or links
                    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g
                    const parts = paragraph.split(emailRegex)
                    
                    if (parts.length > 1) {
                      return (
                        <p key={pIndex}>
                          {parts.map((part, partIndex) => {
                            if (emailRegex.test(part)) {
                              return (
                                <a
                                  key={partIndex}
                                  href={`mailto:${part}`}
                                  className="document-viewer-link"
                                >
                                  {part}
                                </a>
                              )
                            }
                            return <span key={partIndex}>{part}</span>
                          })}
                        </p>
                      )
                    }
                    
                    return paragraph.trim() ? (
                      <p key={pIndex}>{paragraph}</p>
                    ) : null
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

