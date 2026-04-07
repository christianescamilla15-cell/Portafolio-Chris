/**
 * Chat Multi-Agente - Horizonte Creativo
 * Integración con OpenRouter (modelos gratuitos)
 */

const CHAT_CONFIG = {
  apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'meta-llama/llama-3-8b-instruct', // Modelo gratuito
  systemPrompt: `Eres Horizon, el asistente virtual de Horizonte Creativo, un estudio de diseño digital.

Tu personalidad:
- Amigable, profesional y creativo
- Hablas en español
- Ayudas con información sobre servicios de diseño, branding, marketing digital
- Puedes responder preguntas sobre el equipo (10 personas)
- Nunca inventas información que no tengas
- Si no sabes algo, lo dices con honestidad

Servicios disponibles:
- Diseño Gráfico: Identidades visuales, logos, branding
- Diseño Web: Páginas web, landing pages, e-commerce
- Marketing Digital: Estrategia, redes sociales, SEO
- Desarrollo de Chatbots: Asistentes virtuales con IA

Equipo:
1. Marco Ramírez - Director Creativo
2. Valentina Torres - Diseñadora Senior
3. Andrés López - Desarrollador Full Stack
4. Camila Ruiz - Especialista en Marketing
5. Diego Herrera - Ilustrador Digital
6. Gabriela Mora - Gestora de Proyectos
7. Roberto Sánchez - Diseñador Web
8. Lucía Fernández - Copywriter
9. Javier Castro - Fotógrafo
10. Ana Belén Díaz - Community Manager

Contacto: hola@horizontecreativo.com`
};

class HorizonChatbot {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.isTyping = false;
    this.init();
  }

  init() {
    this.createWidget();
    this.loadMessages();
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.id = 'horizon-chat';
    widget.innerHTML = `
      <div class="chat-toggle" id="chatToggle">
        <div class="chat-toggle-icon">💬</div>
        <div class="chat-toggle-pulse"></div>
      </div>
      <div class="chat-window" id="chatWindow">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">🤖</div>
            <div class="chat-header-text">
              <h3>Horizon</h3>
              <span class="chat-status">En línea</span>
            </div>
          </div>
          <button class="chat-close" id="chatClose">×</button>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="chat-message bot">
            <div class="chat-avatar-small">🤖</div>
            <div class="chat-bubble">
              <p>¡Hola! Soy <strong>Horizon</strong>, el asistente virtual de Horizonte Creativo. 👋</p>
              <p>¿En qué puedo ayudarte hoy?</p>
            </div>
          </div>
        </div>
        <div class="chat-input-container">
          <input type="text" id="chatInput" placeholder="Escribe tu mensaje..." autocomplete="off">
          <button class="chat-send" id="chatSend">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(widget);
    this.addStyles();
    this.bindEvents();
  }

  addStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      #horizon-chat {
        --chat-primary: #e94560;
        --chat-bg: #1a1a2e;
        --chat-surface: #16213e;
        --chat-text: #ffffff;
        --chat-text-muted: #8d99ae;
        --chat-border: rgba(255,255,255,0.1);
        --chat-shadow: 0 4px 20px rgba(0,0,0,0.3);
        --chat-radius: 16px;
        font-family: 'Lato', sans-serif;
      }

      .chat-toggle {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #e94560, #f4a261);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--chat-shadow);
        transition: transform 0.3s, box-shadow 0.3s;
        z-index: 10000;
      }

      .chat-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 30px rgba(233, 69, 96, 0.4);
      }

      .chat-toggle-icon {
        font-size: 1.5rem;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      }

      .chat-toggle-pulse {
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #e94560, #f4a261);
        border-radius: 50%;
        animation: chatPulse 2s infinite;
        z-index: -1;
      }

      @keyframes chatPulse {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(1.5); opacity: 0; }
      }

      .chat-window {
        position: fixed;
        bottom: 100px;
        right: 24px;
        width: 380px;
        height: 500px;
        background: var(--chat-bg);
        border-radius: var(--chat-radius);
        box-shadow: var(--chat-shadow);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.95);
        transition: all 0.3s ease;
      }

      .chat-window.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }

      .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        background: var(--chat-surface);
        border-bottom: 1px solid var(--chat-border);
      }

      .chat-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .chat-avatar {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #e94560, #f4a261);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }

      .chat-header-text h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--chat-text);
      }

      .chat-status {
        font-size: 0.75rem;
        color: #10b981;
      }

      .chat-close {
        background: none;
        border: none;
        color: var(--chat-text-muted);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 4px 8px;
        transition: color 0.3s;
      }

      .chat-close:hover {
        color: var(--chat-text);
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .chat-message {
        display: flex;
        gap: 10px;
        animation: messageSlide 0.3s ease;
      }

      @keyframes messageSlide {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .chat-message.user {
        flex-direction: row-reverse;
      }

      .chat-avatar-small {
        width: 32px;
        height: 32px;
        background: var(--chat-surface);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        flex-shrink: 0;
      }

      .chat-message.user .chat-avatar-small {
        background: linear-gradient(135deg, #e94560, #f4a261);
      }

      .chat-bubble {
        max-width: 75%;
        padding: 12px 16px;
        background: var(--chat-surface);
        border-radius: 16px;
        border-top-left-radius: 4px;
        color: var(--chat-text);
        font-size: 0.9rem;
        line-height: 1.5;
      }

      .chat-message.user .chat-bubble {
        background: linear-gradient(135deg, #e94560, #f4a261);
        border-radius: 16px;
        border-top-right-radius: 4px;
      }

      .chat-bubble p {
        margin: 0 0 8px 0;
      }

      .chat-bubble p:last-child {
        margin-bottom: 0;
      }

      .chat-bubble strong {
        color: #f4a261;
      }

      .chat-typing {
        display: flex;
        gap: 6px;
        padding: 8px 0;
      }

      .chat-typing span {
        width: 8px;
        height: 8px;
        background: var(--chat-text-muted);
        border-radius: 50%;
        animation: typingBounce 1.4s infinite ease-in-out;
      }

      .chat-typing span:nth-child(1) { animation-delay: 0s; }
      .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
      .chat-typing span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typingBounce {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
      }

      .chat-input-container {
        display: flex;
        gap: 8px;
        padding: 16px 20px;
        background: var(--chat-surface);
        border-top: 1px solid var(--chat-border);
      }

      #chatInput {
        flex: 1;
        padding: 12px 16px;
        background: var(--chat-bg);
        border: 1px solid var(--chat-border);
        border-radius: 24px;
        color: var(--chat-text);
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.3s;
      }

      #chatInput:focus {
        border-color: #e94560;
      }

      #chatInput::placeholder {
        color: var(--chat-text-muted);
      }

      .chat-send {
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #e94560, #f4a261);
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .chat-send:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
      }

      .chat-send svg {
        width: 18px;
        height: 18px;
        color: white;
      }

      .chat-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      @media (max-width: 480px) {
        .chat-window {
          width: calc(100vw - 32px);
          right: 16px;
          bottom: 90px;
          height: calc(100vh - 150px);
        }

        .chat-toggle {
          bottom: 16px;
          right: 16px;
          width: 55px;
          height: 55px;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  bindEvents() {
    const toggle = document.getElementById('chatToggle');
    const close = document.getElementById('chatClose');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    const window = document.getElementById('chatWindow');

    toggle.addEventListener('click', () => this.toggle());
    close.addEventListener('click', () => this.toggle());
    send.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('chatWindow');
    const toggle = document.getElementById('chatToggle');
    
    if (this.isOpen) {
      window.classList.add('open');
      toggle.querySelector('.chat-toggle-pulse').style.display = 'none';
      document.getElementById('chatInput').focus();
    } else {
      window.classList.remove('open');
      toggle.querySelector('.chat-toggle-pulse').style.display = 'block';
    }
  }

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || this.isTyping) return;
    
    input.value = '';
    this.addMessage(message, 'user');
    this.showTyping();
    
    try {
      const response = await this.getAIResponse(message);
      this.hideTyping();
      this.addMessage(response, 'bot');
    } catch (error) {
      this.hideTyping();
      this.addMessage('Lo siento, hubo un error. Por favor intenta de nuevo.', 'bot');
    }
  }

  async getAIResponse(message) {
    this.messages.push({ role: 'user', content: message });
    
    const response = await fetch(CHAT_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAPIKey()}`
      },
      body: JSON.stringify({
        model: CHAT_CONFIG.model,
        messages: [
          { role: 'system', content: CHAT_CONFIG.systemPrompt },
          ...this.messages
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('API Error');
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;
    
    this.messages.push({ role: 'assistant', content: botResponse });
    this.saveMessages();
    
    return botResponse;
  }

  async getAPIKey() {
    // OpenRouter API Key - El usuario debe proporcionar la suya
    // Obtener gratis en: https://openrouter.ai/keys
    const storedKey = localStorage.getItem('horizon_api_key');
    
    if (storedKey) return storedKey;
    
    // Si no hay key, usar respuesta simulada
    return this.getFallbackResponse.bind(this);
  }

  getFallbackResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hola') || lowerMsg.includes('buenos') || lowerMsg.includes('saludos')) {
      return '¡Hola! 👋 Qué gusto saludarte. Soy Horizon, el asistente de Horizonte Creativo. ¿En qué puedo ayudarte hoy?';
    }
    
    if (lowerMsg.includes('servicio') || lowerMsg.includes('ofrecen') || lowerMsg.includes('hacen')) {
      return 'Ofrecemos servicios de:\n\n🎨 <strong>Diseño Gráfico</strong> - Logos, branding, identidad visual\n🌐 <strong>Diseño Web</strong> - Landing pages, e-commerce\n📱 <strong>Marketing Digital</strong> - Estrategia, SEO, redes sociales\n🤖 <strong>Chatbots con IA</strong> - Asistentes virtuales inteligentes\n\n¿Cuál te interesa?';
    }
    
    if (lowerMsg.includes('precio') || lowerMsg.includes('costo') || lowerMsg.includes('cuanto')) {
      return 'Los precios varían según el proyecto y sus necesidades. Te recomiendo contactarnos directamente para una cotización personalizada.\n\n📧 Escríbenos a: hola@horizontecreativo.com';
    }
    
    if (lowerMsg.includes('equipo') || lowerMsg.includes('quién') || lowerMsg.includes('integrantes')) {
      return 'Somos un equipo de 10 creativos:\n\n1. Marco Ramírez - Director Creativo\n2. Valentina Torres - Diseñadora Senior\n3. Andrés López - Desarrollador Full Stack\n4. Camila Ruiz - Marketing\n5. Diego Herrera - Ilustrador Digital\n6. Gabriela Mora - Gestión de Proyectos\n7. Roberto Sánchez - Diseñador Web\n8. Lucía Fernández - Copywriter\n9. Javier Castro - Fotógrafo\n10. Ana Belén Díaz - Community Manager\n\n¿Te gustaría saber más de alguien?';
    }
    
    if (lowerMsg.includes('contacto') || lowerMsg.includes('email') || lowerMsg.includes('hablar')) {
      return '¡Por supuesto! Puedes contactarnos por:\n\n📧 Email: hola@horizontecreativo.com\n📱 WhatsApp: +52 555 123 4567\n🌐 Web: horizonte-creativo.vercel.app\n\n¿Te gustaría que te ayude con algo más?';
    }
    
    if (lowerMsg.includes('chatbot') || lowerMsg.includes('asistente')) {
      return '¡Somos expertos en chatbots con IA! 😄\n\nCreamos asistentes virtuales inteligentes con:\n- Clasificación de intents\n- Routing automático\n- Integración con WhatsApp, web, etc.\n- Modelos de lenguaje avanzados\n\n¿Te interesa tener uno para tu negocio?';
    }
    
    return 'Gracias por tu mensaje. Para darte la mejor información, te recomiendo contactarnos directamente:\n\n📧 hola@horizontecreativo.com\n\nEstaremos encantados de ayudarte.';
  }

  addMessage(content, type) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    // Convertir saltos de línea a párrafos
    const paragraphs = content.split('\n').filter(p => p.trim());
    const formattedContent = paragraphs.map(p => {
      if (p.includes('<strong>') || p.includes('<br>')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');
    
    messageDiv.innerHTML = `
      <div class="chat-avatar-small">${type === 'bot' ? '🤖' : '👤'}</div>
      <div class="chat-bubble">${formattedContent}</div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
  }

  showTyping() {
    this.isTyping = true;
    const container = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="chat-avatar-small">🤖</div>
      <div class="chat-bubble">
        <div class="chat-typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
  }

  hideTyping() {
    this.isTyping = false;
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  }

  saveMessages() {
    localStorage.setItem('horizon_chat_messages', JSON.stringify(this.messages));
  }

  loadMessages() {
    const saved = localStorage.getItem('horizon_chat_messages');
    if (saved) {
      this.messages = JSON.parse(saved);
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.horizonChat = new HorizonChatbot();
});
