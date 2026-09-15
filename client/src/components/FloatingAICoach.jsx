import React, { useState, useEffect, useRef } from 'react'
import {
  FiX,
  FiSend,
  FiTrash2,
  FiMinimize2,
  FiMaximize2,
  FiCopy,
  FiCheck,
  FiUser
} from 'react-icons/fi'
import { sendAICoachMessage } from '../utils/aiCoachService'
import { useProfile } from '../utils/userProfile'

const INITIAL_WELCOME = {
  role: 'assistant',
  content: `Hey! Coach Alex here. What are we hitting today?

Whether you need your session programmed, a quick check on your lifting mechanics, or a smart exercise substitution, just drop a message and let's get after it.`,
  time: 'Just now'
}

const QUICK_PROMPTS = [
  "Plan today's workout",
  "Form check on squats",
  "20-minute dumbbell burn",
  "Knee hurts on lunges — substitute?",
  "How much should I rest between sets?"
]

function FormattedMessage({ content }) {
  const renderContent = (raw) => {
    const lines = raw.split('\n')
    const elements = []
    let inTable = false
    let tableRows = []

    const parseInline = (text) => {
      const parts = text.split(/(\*\*.*?\*\*)/g)
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="coach-bold">{part.slice(2, -2)}</strong>
        }
        const subParts = part.split(/(\*.*?\*)/g)
        return subParts.map((sub, j) => {
          if (sub.startsWith('*') && sub.endsWith('*')) {
            return <em key={j}>{sub.slice(1, -1)}</em>
          }
          return sub
        })
      })
    }

    const flushTable = () => {
      if (tableRows.length === 0) return
      const headerRow = tableRows[0]
      const bodyRows = tableRows.slice(1).filter(r => !r.every(c => /^[-:\s]+$/.test(c)))

      elements.push(
        <div className="coach-table-wrapper" key={`tbl-${elements.length}`}>
          <table className="coach-workout-table">
            <thead>
              <tr>
                {headerRow.map((cell, idx) => (
                  <th key={idx}>{parseInline(cell.trim())}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{parseInline(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      tableRows = []
      inTable = false
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line.startsWith('|') && line.endsWith('|')) {
        inTable = true
        const cells = line
          .slice(1, -1)
          .split('|')
          .map(c => c.trim())
        tableRows.push(cells)
        continue
      } else if (inTable) {
        flushTable()
      }

      if (line.startsWith('### ')) {
        elements.push(<h4 key={i} className="coach-h4">{parseInline(line.slice(4))}</h4>)
      } else if (line.startsWith('## ')) {
        elements.push(<h3 key={i} className="coach-h3">{parseInline(line.slice(3))}</h3>)
      } else if (line.startsWith('# ')) {
        elements.push(<h2 key={i} className="coach-h2">{parseInline(line.slice(2))}</h2>)
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        elements.push(
          <li key={i} className="coach-bullet">
            {parseInline(line.slice(2))}
          </li>
        )
      } else if (/^\d+\.\s/.test(line)) {
        const text = line.replace(/^\d+\.\s/, '')
        elements.push(
          <div key={i} className="coach-num-item">
            <span className="coach-num-badge">{line.match(/^\d+/)[0]}.</span>
            <span>{parseInline(text)}</span>
          </div>
        )
      } else if (line === '---' || line === '***') {
        elements.push(<hr key={i} className="coach-divider" />)
      } else if (line.length > 0) {
        elements.push(
          <p key={i} className="coach-paragraph">
            {parseInline(line)}
          </p>
        )
      }
    }

    if (inTable) {
      flushTable()
    }

    return elements
  }

  return <div className="coach-formatted-body">{renderContent(content)}</div>
}

export default function FloatingAICoach() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('fitmates_trainer_chat')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return [INITIAL_WELCOME]
  })

  const { profile } = useProfile()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading])

  useEffect(() => {
    try {
      localStorage.setItem('fitmates_trainer_chat', JSON.stringify(messages))
    } catch (e) {
      console.warn('Unable to persist trainer chat:', e)
    }
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  const formatCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim()
    if (!query || isLoading) return

    const timeString = formatCurrentTime()
    const userMsg = { role: 'user', content: query, time: timeString }
    const newMessages = [...messages, userMsg]

    setMessages(newMessages)
    setInputMessage('')
    setIsLoading(true)

    try {
      const res = await sendAICoachMessage(newMessages)
      const botReply = {
        role: 'assistant',
        content: res.reply,
        time: formatCurrentTime()
      }
      setMessages(prev => [...prev, botReply])
    } catch (error) {
      const errMsg = {
        role: 'assistant',
        content: `Sorry about that — connection hiccup. Give it another shot in a moment!`,
        time: formatCurrentTime()
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    if (window.confirm('Reset this training chat session?')) {
      setMessages([INITIAL_WELCOME])
      localStorage.removeItem('fitmates_trainer_chat')
    }
  }

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    })
  }

  return (
    <div className="trainer-chat-root">
      {/* Floating Trainer Button */}
      {!isOpen && (
        <button
          className="trainer-trigger-pill"
          onClick={() => setIsOpen(true)}
          aria-label="Open Personal Trainer Chat"
          title="Chat with Coach Alex"
        >
          <div className="trainer-avatar-mini">
            <span className="trainer-initials">CA</span>
            <span className="trainer-dot-online" />
          </div>
          <div className="trainer-pill-text">
            <span className="trainer-pill-name">Coach Alex</span>
            <span className="trainer-pill-hint">Ask your coach</span>
          </div>
        </button>
      )}

      {/* Floating Trainer Chat Window */}
      {isOpen && (
        <div className={`trainer-window ${isExpanded ? 'expanded' : ''}`}>
          {/* Header */}
          <div className="trainer-window-header">
            <div className="trainer-header-profile">
              <div className="trainer-avatar-ring">
                <span className="trainer-header-avatar">CA</span>
                <span className="trainer-status-dot" />
              </div>
              <div className="trainer-header-details">
                <div className="trainer-name-row">
                  <span className="trainer-header-name">Coach Alex</span>
                  <span className="trainer-role-badge">Head Coach</span>
                </div>
                <p className="trainer-header-sub">
                  Active now • FitMates Training Zone
                </p>
              </div>
            </div>

            <div className="trainer-header-actions">
              <button
                className="trainer-icon-btn"
                onClick={clearChat}
                title="Restart conversation"
              >
                <FiTrash2 size={15} />
              </button>

              <button
                className="trainer-icon-btn desktop-only"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore size' : 'Expand window'}
              >
                {isExpanded ? <FiMinimize2 size={15} /> : <FiMaximize2 size={15} />}
              </button>

              <button
                className="trainer-icon-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div className="trainer-chips-bar">
            <div className="trainer-chips-track">
              {QUICK_PROMPTS.map((promptText, i) => (
                <button
                  key={i}
                  className="trainer-chip"
                  onClick={() => handleSendMessage(promptText)}
                  disabled={isLoading}
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="trainer-messages-stream">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user'
              return (
                <div
                  key={index}
                  className={`trainer-message-row ${isUser ? 'client-row' : 'coach-row'}`}
                >
                  {!isUser && (
                    <div className="trainer-bubble-avatar">CA</div>
                  )}

                  <div className={`trainer-bubble ${isUser ? 'client-bubble' : 'coach-bubble'}`}>
                    {isUser ? (
                      <p className="client-text">{msg.content}</p>
                    ) : (
                      <>
                        <FormattedMessage content={msg.content} />
                        <div className="coach-bubble-footer">
                          {msg.time && <span className="bubble-time">{msg.time}</span>}
                          <button
                            className="coach-copy-btn"
                            onClick={() => copyToClipboard(msg.content, index)}
                            title="Copy workout details"
                          >
                            {copiedIdx === index ? <FiCheck size={12} color="#10b981" /> : <FiCopy size={12} />}
                            <span>{copiedIdx === index ? 'Saved' : 'Copy'}</span>
                          </button>
                        </div>
                      </>
                    )}
                    {isUser && msg.time && (
                      <span className="client-bubble-time">{msg.time}</span>
                    )}
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="trainer-message-row coach-row">
                <div className="trainer-bubble-avatar">CA</div>
                <div className="trainer-bubble coach-bubble typing-bubble">
                  <div className="coach-typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="coach-typing-label">Alex is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="trainer-window-footer">
            <div className="trainer-input-wrapper">
              <textarea
                ref={inputRef}
                className="trainer-chat-input"
                rows={1}
                placeholder="Message Coach Alex..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                className={`trainer-send-btn ${inputMessage.trim() && !isLoading ? 'ready' : ''}`}
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Send message"
              >
                <FiSend size={15} />
              </button>
            </div>
            <div className="trainer-footer-note">
              <span>Personalized for {profile?.name || 'Athlete'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
