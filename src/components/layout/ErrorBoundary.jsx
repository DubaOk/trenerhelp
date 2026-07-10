import { Component } from 'react'

// renders the error as readable text instead of a white screen,
// so problems on real devices can be reported and diagnosed
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    const message = `${this.state.error?.message ?? this.state.error}`
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: 20, marginBottom: 8 }}>Что-то пошло не так</h1>
        <p style={{ color: '#828282', fontSize: 14, marginBottom: 16 }}>
          Перезагрузите страницу. Если не помогло — отправьте разработчику текст ниже:
        </p>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: '#efefef',
            padding: 12,
            borderRadius: 8,
            fontSize: 12,
          }}
        >
          {message}
          {'\n\n'}
          {this.state.error?.stack?.slice(0, 600)}
        </pre>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 16,
            height: 48,
            width: '100%',
            borderRadius: 999,
            border: 'none',
            background: '#202020',
            color: '#fff',
            fontSize: 16,
          }}
        >
          Перезагрузить
        </button>
      </div>
    )
  }
}
