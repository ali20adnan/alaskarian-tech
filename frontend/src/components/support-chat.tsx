"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Send, Headphones, Smile, Paperclip } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import { useLanguage } from "@/src/contexts/language-context"
import { useSiteConfig } from "@/src/contexts/site-config-context"
import { EmojiPopup } from "@/src/components/admin/POPUPS/EmojiPopup"
import { SUPPORT_STICKERS } from "@/src/lib/support-stickers"

interface Message {
  id: string
  text: string
  sender: "user" | "support"
  timestamp: Date
  imageUrl?: string
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPopup, setShowEmojiPopup] = useState(false)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isRTL } = useLanguage()
  const { config } = useSiteConfig()

  if (!config.appearance.showSupportButton) return null

  const t = {
    title: isRTL ? "الدعم الفني" : "Technical Support",
    subtitle: isRTL ? "نحن هنا لمساعدتك" : "We're here to help",
    placeholder: isRTL ? "اكتب رسالتك هنا..." : "Type your message here...",
    welcomeMessage: isRTL 
      ? "مرحباً! كيف يمكنني مساعدتك اليوم؟" 
      : "Hello! How can I help you today?",
    typing: isRTL ? "جاري الكتابة..." : "Typing...",
    online: isRTL ? "متصل الآن" : "Online now",
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            text: t.welcomeMessage,
            sender: "support",
            timestamp: new Date(),
          },
        ])
      }, 500)
    }
  }, [isOpen, messages.length, t.welcomeMessage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim() && !mediaPreview) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim() || (isRTL ? "مرفق صورة" : "Image attachment"),
      sender: "user",
      timestamp: new Date(),
      imageUrl: mediaPreview || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setMediaPreview(null)
    setShowEmojiPopup(false)
    setIsTyping(true)

    // Simulate support response
    setTimeout(() => {
      setIsTyping(false)
      const responses = isRTL
        ? [
            "شكراً لتواصلك معنا! سيقوم فريق الدعم بالرد عليك قريباً.",
            "نقدر تواصلك! هل يمكنني مساعدتك في شيء آخر؟",
            "تم استلام رسالتك. سنتواصل معك في أقرب وقت.",
          ]
        : [
            "Thank you for reaching out! Our support team will respond shortly.",
            "We appreciate your message! Is there anything else I can help with?",
            "Message received. We'll get back to you soon.",
          ]

      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "support",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, supportMessage])
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 z-50 group",
          isRTL ? "left-6" : "right-6",
          isOpen && "hidden"
        )}
        aria-label="Open support chat"
      >
        <div className="relative">
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-ping opacity-25" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-110">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          {/* Online Indicator */}
          <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white animate-pulse" />
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 z-50 w-[320px] sm:w-[380px] max-w-[calc(100vw-32px)] transition-all duration-500 transform",
          isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        )}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="bg-background dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-black/50 border border-border dark:border-slate-700/50 overflow-hidden shadow-cyan-500/10">
          {/* Header with Wave */}
          <div className="relative overflow-hidden">
            <div 
              className="px-6 py-5"
              style={{
                background: "linear-gradient(135deg, #0055AA 0%, #0088AA 50%, #00AAAA 100%)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={cn("font-bold text-white text-lg", isRTL && "font-cairo")}>
                      {t.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className={cn("text-white/90 text-sm", isRTL && "font-cairo")}>
                        {t.online}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            {/* Wave SVG */}
            <svg
              className="absolute bottom-0 left-0 right-0 w-full"
              viewBox="0 0 1440 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ height: "20px", marginBottom: "-1px" }}
            >
              <path
                d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
                className="fill-background dark:fill-slate-900"
              />
            </svg>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background dark:bg-slate-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-3 rounded-2xl",
                    message.sender === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm",
                    isRTL && "font-cairo"
                  )}
                >
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt={isRTL ? "صورة مرفقة" : "Attached image"}
                      className="mb-2 max-h-48 w-full rounded-lg object-cover ring-1 ring-black/10 dark:ring-white/20"
                    />
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span
                    className={cn(
                      "text-xs mt-1 block opacity-70",
                      message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString(isRTL ? "ar" : "en", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border dark:border-slate-800 bg-background dark:bg-slate-900/80 backdrop-blur-md">
            {mediaPreview && (
              <div className="px-3 pt-3">
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 p-2 dark:border-slate-700">
                  <img src={mediaPreview} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <p className="min-w-0 flex-1 text-xs text-muted-foreground">
                    {isRTL ? "معاينة الوسائط - سترسل مع الرسالة" : "Media preview - will be sent with message"}
                  </p>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setMediaPreview(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-3">
              <div className="flex items-center gap-1 shrink-0">
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file || !file.type.startsWith("image/")) return
                    const reader = new FileReader()
                    reader.onload = () => setMediaPreview(String(reader.result))
                    reader.readAsDataURL(file)
                    e.target.value = ""
                  }}
                />
                <button
                  type="button"
                  onClick={() => mediaInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-muted dark:hover:bg-slate-800 transition-colors text-muted-foreground hover:text-cyan-500"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPopup((prev) => !prev)}
                    className="p-2 rounded-full hover:bg-muted dark:hover:bg-slate-800 transition-colors text-muted-foreground hover:text-cyan-500"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <EmojiPopup
                    isOpen={showEmojiPopup}
                    isRTL={isRTL}
                    emojis={SUPPORT_STICKERS}
                    onPick={(emoji) => {
                      setInputValue((prev) => prev + emoji)
                      setShowEmojiPopup(false)
                    }}
                  />
                </div>
              </div>
              
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                className={cn(
                  "flex-1 min-w-0 px-4 py-2.5 rounded-2xl bg-muted dark:bg-slate-800/80 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all text-foreground placeholder:text-muted-foreground",
                  isRTL && "font-cairo text-right"
                )}
              />

              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() && !mediaPreview}
                size="icon"
                className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95 disabled:opacity-50 transition-all"
              >
                <Send className={cn("w-4 h-4", isRTL && "-scale-x-100")} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
