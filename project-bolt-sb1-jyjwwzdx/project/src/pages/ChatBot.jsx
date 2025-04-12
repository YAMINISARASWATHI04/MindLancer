import React, { useEffect, useRef, useState } from 'react';

const ChatBox = () => {
    const [messages, setMessages] = useState(() => {
        // Load messages from localStorage if available
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const messageContainerRef = useRef(null);

    // API configuration
    const API_KEY = "nBJAnLtM.6AQ4qa3p0M8zebSYYdlNkKvkL94e1tkv";
    const CHANNEL_TOKEN = "mindlacer";
    const API_URL = `https://payload.vextapp.com/hook/MX354AUWLX/catch/${CHANNEL_TOKEN}`;

    // Constants
    const MAX_RETRY_ATTEMPTS = 3;
    const TYPING_INDICATOR_DELAY = 300; // ms

    // Inline styles
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '24rem', // 96
            maxWidth: '28rem', // md
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        },
        header: {
            backgroundColor: '#2563eb', // blue-600
            color: '#ffffff',
            padding: '0.75rem 1rem',
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #2052c3',
        },
        headerTitle: {
            fontWeight: '600',
            fontSize: '1rem',
            margin: 0,
        },
        headerControls: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        onlineBadge: {
            fontSize: '0.75rem',
            backgroundColor: '#4ade80', // green-400
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            color: '#ffffff',
        },
        clearButton: {
            fontSize: '0.75rem',
            backgroundColor: '#3b82f6', // blue-500
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease',
        },
        messagesContainer: {
            flex: '1',
            padding: '1rem',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: '#f9fafb', // gray-50
        },
        emptyStateContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#9ca3af', // gray-400
            textAlign: 'center',
        },
        emptyStateText: {
            margin: '0 0 0.5rem 0',
        },
        emptyStateSubtext: {
            fontSize: '0.75rem',
            maxWidth: '20rem',
            margin: 0,
        },
        messageGroup: {
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
        },
        messageGroupUser: {
            alignItems: 'flex-end',
        },
        messageGroupBot: {
            alignItems: 'flex-start',
        },
        messageWrapper: {
            maxWidth: '80%',
        },
        message: {
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        userMessage: {
            backgroundColor: '#2563eb', // blue-600
            color: '#ffffff',
        },
        botMessage: {
            backgroundColor: '#f3f4f6', // gray-100
            color: '#1f2937', // gray-800
        },
        errorMessage: {
            backgroundColor: '#fee2e2', // red-100
            color: '#991b1b', // red-800
        },
        typingIndicator: {
            backgroundColor: '#f3f4f6', // gray-100
            color: '#6b7280', // gray-500
            display: 'flex',
            padding: '0.75rem 1rem',
        },
        typingDot: {
            width: '0.5rem',
            height: '0.5rem',
            backgroundColor: '#9ca3af', // gray-400
            borderRadius: '9999px',
            margin: '0 0.125rem',
            animation: 'bounce 1s infinite',
        },
        timestamp: {
            fontSize: '0.7rem',
            opacity: '0.75',
            marginTop: '0.25rem',
            display: 'block',
        },
        retryButton: {
            fontSize: '0.7rem',
            color: '#2563eb', // blue-600
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            padding: '0.25rem 0',
            cursor: 'pointer',
        },
        retryIcon: {
            marginRight: '0.25rem',
            width: '0.75rem',
            height: '0.75rem',
        },
        inputArea: {
            borderTop: '1px solid #e5e7eb', // gray-200
            padding: '1rem',
            backgroundColor: '#ffffff',
            borderBottomLeftRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem',
        },
        inputWrapper: {
            display: 'flex',
            alignItems: 'center',
        },
        textInput: {
            flex: '1',
            border: '1px solid #d1d5db', // gray-300
            borderRight: 'none',
            borderTopLeftRadius: '0.5rem',
            borderBottomLeftRadius: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
            color: '#1f2937', // gray-800 - Fixed text color
        },
        textInputFocused: {
            borderColor: '#3b82f6', // blue-500
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)', // blue-500 with opacity
        },
        sendButton: {
            backgroundColor: '#2563eb', // blue-600
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderTopRightRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '2.5rem',
            transition: 'background-color 150ms ease',
        },
        sendButtonDisabled: {
            backgroundColor: '#93c5fd', // blue-300
            cursor: 'not-allowed',
        },
        sendIcon: {
            width: '1.25rem',
            height: '1.25rem',
        },
        loaderIcon: {
            width: '1.25rem',
            height: '1.25rem',
            animation: 'spin 1s linear infinite',
        },
        alertIcon: {
            width: '1.25rem',
            height: '1.25rem',
            color: '#ef4444', // red-500
        },
        errorText: {
            fontSize: '0.75rem',
            color: '#ef4444', // red-500
            marginTop: '0.5rem',
            margin: '0.5rem 0 0 0',
        },
        helpText: {
            fontSize: '0.75rem',
            color: '#6b7280', // gray-500
            marginTop: '0.5rem',
            margin: '0.5rem 0 0 0',
        },
        '@keyframes bounce': {
            '0%, 100%': {
                transform: 'translateY(0)',
            },
            '50%': {
                transform: 'translateY(-0.25rem)',
            }
        },
        '@keyframes spin': {
            '0%': {
                transform: 'rotate(0deg)',
            },
            '100%': {
                transform: 'rotate(360deg)',
            }
        }
    };

    // Save messages to localStorage when they change
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input on initial load
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const [inputFocused, setInputFocused] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        // Submit on Enter key (not with Shift key)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const formatTimestamp = () => {
        return new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const clearConversation = () => {
        if (window.confirm('Are you sure you want to clear the entire conversation?')) {
            setMessages([]);
            localStorage.removeItem('chatMessages');
        }
    };

    const retryLastMessage = async () => {
        if (isLoading || messages.length === 0) return;

        // Find the last user message
        const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.sender === 'user');
        if (lastUserMessageIndex === -1) return;

        const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];

        // Remove the failed bot message if it exists
        const updatedMessages = messages.filter(msg => !msg.isError);
        setMessages(updatedMessages);

        // Send the message again
        await sendMessageToAPI(lastUserMessage.text);
    };

    const sendMessageToAPI = async (messageText) => {
        setIsLoading(true);
        setError(null);

        try {
            // Add typing indicator
            const typingId = Date.now();
            setMessages(prevMessages => [...prevMessages, {
                id: typingId,
                text: '...',
                sender: 'bot',
                isTyping: true,
                timestamp: formatTimestamp()
            }]);

            // Slight delay to show typing indicator
            await new Promise(resolve => setTimeout(resolve, TYPING_INDICATOR_DELAY));

            // Send request to API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Apikey': `Api-Key ${API_KEY}`
                },
                body: JSON.stringify({ payload: messageText })
            });

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();

            // Remove typing indicator and add bot response
            setMessages(prevMessages => {
                const filteredMessages = prevMessages.filter(msg => msg.id !== typingId);
                return [...filteredMessages, {
                    id: Date.now(),
                    text: data.text || 'No response content',
                    sender: 'bot',
                    requestId: data.request_id,
                    timestamp: formatTimestamp()
                }];
            });

            // Reset retry count on successful request
            setRetryCount(0);

        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.message);

            // Remove typing indicator
            setMessages(prevMessages => {
                const filteredMessages = prevMessages.filter(msg => !msg.isTyping);

                // Only add error message if we haven't exceeded retry attempts
                if (retryCount < MAX_RETRY_ATTEMPTS) {
                    return [...filteredMessages, {
                        id: Date.now(),
                        text: `Sorry, there was an error: ${error.message}. Retry ${retryCount + 1}/${MAX_RETRY_ATTEMPTS}.`,
                        sender: 'bot',
                        isError: true,
                        timestamp: formatTimestamp()
                    }];
                } else {
                    return [...filteredMessages, {
                        id: Date.now(),
                        text: 'Maximum retry attempts reached. Please try again later or contact support.',
                        sender: 'bot',
                        isError: true,
                        timestamp: formatTimestamp()
                    }];
                }
            });

            // Auto-retry logic (with increased delay between retries)
            if (retryCount < MAX_RETRY_ATTEMPTS) {
                setRetryCount(prevCount => prevCount + 1);
                const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff

                setTimeout(() => {
                    sendMessageToAPI(messageText);
                }, retryDelay);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        // Add user message to chat
        const userMessage = {
            id: Date.now(),
            text: trimmedInput,
            sender: 'user',
            timestamp: formatTimestamp()
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputValue('');

        // Process the message
        await sendMessageToAPI(trimmedInput);
    };

    const groupedMessages = messages.reduce((acc, message, index) => {
        const prevMessage = index > 0 ? messages[index - 1] : null;

        // Start a new group if:
        // 1. It's the first message
        // 2. The sender changed
        // 3. More than 2 minutes passed between messages
        const startNewGroup = !prevMessage ||
            prevMessage.sender !== message.sender ||
            (new Date(message.timestamp) - new Date(prevMessage.timestamp) > 2 * 60 * 1000);

        if (startNewGroup) {
            acc.push([message]);
        } else {
            acc[acc.length - 1].push(message);
        }

        return acc;
    }, []);

    // Icons as SVG strings for inline use
    const SendIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.sendIcon}>
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
    );

    const LoaderIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.loaderIcon}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
    );

    const AlertIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.alertIcon}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    );

    const RefreshIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.retryIcon}>
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
        </svg>
    );

    return (
        <div style={styles.container}>
            {/* Chat header */}
            <div style={styles.header}>
                <h2 style={styles.headerTitle}>Chat with Noodles</h2>
                <div style={styles.headerControls}>
                    <span style={styles.onlineBadge}>Online</span>
                    <button
                        onClick={clearConversation}
                        style={styles.clearButton}
                        title="Clear conversation"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Messages area */}
            <div
                style={styles.messagesContainer}
                ref={messageContainerRef}
            >
                {messages.length === 0 ? (
                    <div style={styles.emptyStateContainer}>
                        <p style={styles.emptyStateText}>Send a message to start chatting</p>
                        <p style={styles.emptyStateSubtext}>
                            Your conversation will be stored locally in your browser.
                        </p>
                    </div>
                ) : (
                    groupedMessages.map((group, groupIndex) => {
                        const isUser = group[0].sender === 'user';
                        const groupStyle = {
                            ...styles.messageGroup,
                            ...(isUser ? styles.messageGroupUser : styles.messageGroupBot)
                        };

                        return (
                            <div key={`group-${groupIndex}`} style={groupStyle}>
                                {group.map((message, messageIndex) => {
                                    const isLast = messageIndex === group.length - 1;
                                    let messageStyle = {
                                        ...styles.message
                                    };

                                    if (message.sender === 'user') {
                                        messageStyle = {
                                            ...messageStyle,
                                            ...styles.userMessage
                                        };
                                        if (isLast) {
                                            messageStyle.borderBottomRightRadius = 0;
                                        }
                                    } else if (message.isError) {
                                        messageStyle = {
                                            ...messageStyle,
                                            ...styles.errorMessage
                                        };
                                        if (isLast) {
                                            messageStyle.borderBottomLeftRadius = 0;
                                        }
                                    } else if (message.isTyping) {
                                        messageStyle = {
                                            ...messageStyle,
                                            ...styles.typingIndicator
                                        };
                                    } else {
                                        messageStyle = {
                                            ...messageStyle,
                                            ...styles.botMessage
                                        };
                                        if (isLast) {
                                            messageStyle.borderBottomLeftRadius = 0;
                                        }
                                    }

                                    return (
                                        <div
                                            key={message.id}
                                            style={{
                                                ...styles.messageWrapper,
                                                marginTop: messageIndex > 0 ? '0.25rem' : 0
                                            }}
                                        >
                                            <div style={messageStyle}>
                                                {message.isTyping ? (
                                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                        <div style={{
                                                            ...styles.typingDot,
                                                            animation: 'bounce 1s infinite'
                                                        }}></div>
                                                        <div style={{
                                                            ...styles.typingDot,
                                                            animation: 'bounce 1s infinite',
                                                            animationDelay: '0.2s'
                                                        }}></div>
                                                        <div style={{
                                                            ...styles.typingDot,
                                                            animation: 'bounce 1s infinite',
                                                            animationDelay: '0.4s'
                                                        }}></div>
                                                    </div>
                                                ) : (
                                                    message.text
                                                )}
                                                {/* Only show timestamp for last message in group */}
                                                {isLast && (
                                                    <span style={styles.timestamp}>
                                                        {message.timestamp}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Show retry button for error messages */}
                                            {message.isError && isLast && (
                                                <button
                                                    onClick={retryLastMessage}
                                                    disabled={isLoading}
                                                    style={styles.retryButton}
                                                >
                                                    <RefreshIcon />
                                                    Retry
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} style={styles.inputArea}>
                <div style={styles.inputWrapper}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        disabled={isLoading && retryCount >= MAX_RETRY_ATTEMPTS}
                        ref={inputRef}
                        placeholder="Type your message..."
                        style={{
                            ...styles.textInput,
                            ...(inputFocused ? styles.textInputFocused : {}),
                            backgroundColor: (isLoading && retryCount >= MAX_RETRY_ATTEMPTS) ? '#f3f4f6' : '#ffffff'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim() || (retryCount >= MAX_RETRY_ATTEMPTS && error)}
                        style={{
                            ...styles.sendButton,
                            ...(isLoading || !inputValue.trim() || (retryCount >= MAX_RETRY_ATTEMPTS && error) ? styles.sendButtonDisabled : {})
                        }}
                    >
                        {isLoading ? (
                            <LoaderIcon />
                        ) : error && retryCount >= MAX_RETRY_ATTEMPTS ? (
                            <AlertIcon />
                        ) : (
                            <SendIcon />
                        )}
                    </button>
                </div>
                {error && retryCount >= MAX_RETRY_ATTEMPTS && (
                    <p style={styles.errorText}>
                        Service appears to be unavailable. Please try again later.
                    </p>
                )}
                <p style={styles.helpText}>
                    Press Enter to send, Shift+Enter for new line
                </p>
            </form>

            {/* Add keyframe animations via style tag */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `
            }} />
        </div>
    );
};

export default ChatBox;