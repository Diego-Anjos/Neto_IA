export type Language = 'pt-BR' | 'es-ES';

export const translations = {
    'pt-BR': {
        // App
        generatingTitle: 'Gerando título...',
        // Sidebar
        netoIAAssistant: 'Seu assistente paciente para o mundo digital',
        newConversation: 'Nova Conversa',
        history: 'Histórico',
        deleteConversationConfirm: 'Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.',
        accounts: 'Contas cadastradas',
        settings: 'Configurações',
        logout: 'Sair',
        // ChatInterface & WelcomeScreen
        welcomeTitle: 'Bem-vindo(a), {userName} ao NetoIA!',
        welcomeSubtitle: 'Estou aqui para ajudar você a usar o computador. Faça uma pergunta usando o campo abaixo.',
        welcomeCard1Title: 'Faça uma Pergunta',
        welcomeCard1Body: 'Use palavras simples. Por exemplo: "Como eu crio uma pasta?" ou "Como aumentar o tamanho da letra?".',
        welcomeCard2Title: 'Receba Instruções',
        welcomeCard2Body: 'Vou mostrar um passo a passo com texto e imagens para te guiar, de forma fácil e clara.',
        welcomeCard3Title: 'Aprenda no seu Ritmo',
        welcomeCard3Body: 'Você pode ouvir as instruções e seguir cada passo com calma, sem pressa.',
        // InputBar
        inputPlaceholder: 'Digite sua pergunta aqui...',
        sendButtonLabel: 'Enviar pergunta',
        recordVoiceButtonLabel: 'Gravar pergunta por voz',
        recordingVoiceButtonLabel: 'Gravando sua voz',
        // MessageBubble
        errorMessage: 'Ops! Ocorreu um erro:',
        pauseReading: 'Pausar leitura',
        readAloud: 'Ler em voz alta',
        copyText: 'Copiar texto',
        copied: 'Copiado!',
        // InstructionStepComponent
        showExampleImage: 'Ver imagem de exemplo',
        hideExampleImage: 'Ocultar imagem',
        copyInstructionText: 'Copiar texto da instrução',
        copy: 'Copiar',
        closeImage: 'Fechar imagem',
        listenToInstruction: 'Ouvir instrução {step}',
        pauseInstruction: 'Pausar instrução {step}',
        // LoginScreen
        welcomeBack: 'Bem-vindo(a) de volta! Faça login para continuar.',
        emailLabel: 'E-mail',
        passwordLabel: 'Senha',
        fillAllFieldsError: 'Por favor, preencha todos os campos.',
        invalidCredentialsError: 'E-mail ou senha inválidos.',
        loginError: 'Ocorreu um erro ao tentar fazer login.',
        loginButton: 'Entrar',
        noAccount: 'Não tem uma conta?',
        signUp: 'Cadastre-se',
        // RegistrationScreen
        createAccountTitle: 'Crie sua Conta',
        createAccountSubtitle: 'Junte-se ao NetoIA para começar a aprender.',
        fullNameLabel: 'Nome Completo',
        createPasswordLabel: 'Crie uma Senha',
        emailExistsError: 'Este e-mail já está cadastrado.',
        registerError: 'Ocorreu um erro ao tentar se cadastrar.',
        registerAndLoginButton: 'Cadastrar e Entrar',
        alreadyHaveAccount: 'Já tem uma conta?',
        login: 'Faça login',
        // PasswordPromptModal
        switchToUserTitle: 'Mudar para {userName}',
        passwordPromptInstruction: 'Para sua segurança, por favor, insira a senha da conta.',
        incorrectPasswordError: 'Senha incorreta. Por favor, tente novamente.',
        confirmButton: 'Confirmar',
        cancelButton: 'Cancelar',
        // GabiAssistantModal
        gabiTitle: 'Fale com a Gabi',
        gabiSubtitle: 'Encontrou algum problema ou tem alguma sugestão? Me conte para que a equipe possa melhorar o NetoIA!',
        feedbackPlaceholder: 'Descreva o problema ou sua sugestão aqui...',
        sendFeedbackButton: 'Enviar Feedback',
        gabiSuccessTitle: 'Obrigada!',
        gabiSuccessMessage: 'Sua mensagem foi enviada com sucesso! A equipe do NetoIA agradece sua ajuda para melhorar nosso assistente.',
        closeButton: 'Fechar',
        sendAnotherFeedbackButton: 'Enviar Outro Feedback',
        // SettingsModal
        settingsTitle: 'Configurações',
        settingsSubtitle: 'Gerencie as configurações do aplicativo.',
        language: 'Idioma',
        dangerZone: 'Zona de Perigo',
        dangerZoneDescription: 'Ações nesta seção são permanentes e não podem ser desfeitas. Tenha cuidado.',
        clearHistoryConfirmation: 'Você tem certeza que deseja apagar TODO o seu histórico de conversas? Esta ação não pode ser desfeita.',
        clearHistoryButton: 'Limpar todo o histórico de conversas',
        // Gemini Prompts
        systemPrompt: `Você é a "NetoIA", uma assistente de IA super amigável e paciente, com dupla personalidade, projetada especificamente para ajudar pessoas idosas.

Sua primeira e principal tarefa é analisar a mensagem do usuário para entender a intenção e o sentimento.

1.  **Análise de Intenção e Sentimento:**
    *   **Intenção de Instrução:** O usuário está pedindo ajuda para realizar uma tarefa específica em um computador ou dispositivo? (ex: "como mandar um email", "não consigo aumentar o volume").
    *   **Intenção Conversacional:** O usuário está fazendo uma pergunta geral, cumprimentando, expressando um sentimento ou apenas conversando? (ex: "oi, tudo bem?", "estou frustrado com a tecnologia", "quem foi o primeiro homem na lua?").
    *   **Análise de Sentimento:** O usuário parece feliz, confuso, frustrado, curioso ou neutro? Adapte o tom da sua resposta para ser empático e apropriado. Se estiverem frustrados, seja extra paciente e tranquilizador.

2.  **Formato da Resposta (Regra OBRIGATÓRIA):**
    *   Sua resposta DEVE ser um objeto JSON válido.
    *   Este objeto JSON deve conter APENAS UMA das duas chaves a seguir, dependendo da intenção do usuário: "steps" ou "responseText".

    *   **SE a intenção for de INSTRUÇÃO:**
        *   Responda com a chave "steps". O valor deve ser um array de objetos, onde cada objeto representa um passo.
        *   Cada objeto de passo deve ter as chaves: "step" (número), "text" (instrução simples) e "image_description" (descrição de uma imagem de ajuda).
        *   Mantenha a linguagem extremamente simples e os passos bem pequenos.
        *   Exemplo de Resposta para Instrução:
          {
            "steps": [
              { "step": 1, "text": "Primeiro, vá para a sua Área de Trabalho.", "image_description": "Um ícone de um monitor de computador." },
              { "step": 2, "text": "Clique com o botão direito do mouse em um espaço vazio.", "image_description": "Uma mão clicando no botão direito de um mouse." }
            ]
          }

    *   **SE a intenção for CONVERSACIONAL:**
        *   Responda com a chave "responseText". O valor deve ser uma string com sua resposta conversacional.
        *   Seja amigável, empático e prestativo. Use o sentimento que você detectou para moldar sua resposta.
        *   Exemplo de Resposta para "oi, tudo bem?":
          { "responseText": "Olá! Tudo ótimo por aqui, pronta para ajudar. Como você está se sentindo hoje?" }
        *   Exemplo de Resposta para "estou tão frustrado, não entendo nada disso":
          { "responseText": "Eu entendo completamente como a tecnologia pode ser frustrante às vezes. Não se preocupe, estou aqui para ajudar com toda a paciência do mundo. O que está te incomodando?" }

NUNCA inclua as chaves "steps" e "responseText" na mesma resposta. Escolha uma.`,
        titlePrompt: `Você é um assistente de IA especialista em resumir textos. Sua tarefa é criar um título curto e conciso (máximo de 5 palavras) para uma conversa, com base na primeira pergunta do usuário. O título deve ser em português do Brasil e capturar a essência da pergunta. Responda APENAS com o título, sem nenhuma outra palavra ou formatação.

Exemplo de Pergunta: "oi, tudo bem? preciso de ajuda pra mandar uma foto pelo zapzap para minha neta"
Sua Resposta: Enviar Foto no WhatsApp

Exemplo de Pergunta: "como eu faço pra deixar a letra do computador maior? ta dificil de ler"
Sua Resposta: Aumentar Letra do Computador`
    },
    'es-ES': {
        // App
        generatingTitle: 'Generando título...',
        // Sidebar
        netoIAAssistant: 'Tu asistente paciente para el mundo digital',
        newConversation: 'Nueva Conversación',
        history: 'Historial',
        deleteConversationConfirm: '¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer.',
        accounts: 'Cuentas registradas',
        settings: 'Configuración',
        logout: 'Salir',
        // ChatInterface & WelcomeScreen
        welcomeTitle: '¡Bienvenido(a), {userName} a NetoIA!',
        welcomeSubtitle: 'Estoy aquí para ayudarte a usar la computadora. Haz una pregunta en el campo de abajo.',
        welcomeCard1Title: 'Haz una Pregunta',
        welcomeCard1Body: 'Usa palabras simples. Por ejemplo: "¿Cómo creo una carpeta?" o "¿Cómo aumento el tamaño de la letra?".',
        welcomeCard2Title: 'Recibe Instrucciones',
        welcomeCard2Body: 'Te mostraré un paso a paso con texto e imágenes para guiarte, de forma fácil y clara.',
        welcomeCard3Title: 'Aprende a tu Ritmo',
        welcomeCard3Body: 'Puedes escuchar las instrucciones y seguir cada paso con calma, sin prisa.',
        // InputBar
        inputPlaceholder: 'Escribe tu pregunta aquí...',
        sendButtonLabel: 'Enviar pregunta',
        recordVoiceButtonLabel: 'Grabar pregunta por voz',
        recordingVoiceButtonLabel: 'Grabando tu voz',
        // MessageBubble
        errorMessage: '¡Ups! Ocurrió un error:',
        pauseReading: 'Pausar lectura',
        readAloud: 'Leer en voz alta',
        copyText: 'Copiar texto',
        copied: '¡Copiado!',
        // InstructionStepComponent
        showExampleImage: 'Ver imagen de ejemplo',
        hideExampleImage: 'Ocultar imagen',
        copyInstructionText: 'Copiar texto de la instrucción',
        copy: 'Copiar',
        closeImage: 'Cerrar imagen',
        listenToInstruction: 'Escuchar instrucción {step}',
        pauseInstruction: 'Pausar instrucción {step}',
        // LoginScreen
        welcomeBack: '¡Bienvenido(a) de vuelta! Inicia sesión para continuar.',
        emailLabel: 'Correo electrónico',
        passwordLabel: 'Contraseña',
        fillAllFieldsError: 'Por favor, completa todos los campos.',
        invalidCredentialsError: 'Correo electrónico o contraseña inválidos.',
        loginError: 'Ocurrió un error al intentar iniciar sesión.',
        loginButton: 'Entrar',
        noAccount: '¿No tienes una cuenta?',
        signUp: 'Regístrate',
        // RegistrationScreen
        createAccountTitle: 'Crea tu Cuenta',
        createAccountSubtitle: 'Únete a NetoIA para empezar a aprender.',
        fullNameLabel: 'Nombre Completo',
        createPasswordLabel: 'Crea una Contraseña',
        emailExistsError: 'Este correo electrónico ya está registrado.',
        registerError: 'Ocurrió un error al intentar registrarte.',
        registerAndLoginButton: 'Registrarse y Entrar',
        alreadyHaveAccount: '¿Ya tienes una cuenta?',
        login: 'Inicia sesión',
        // PasswordPromptModal
        switchToUserTitle: 'Cambiar a {userName}',
        passwordPromptInstruction: 'Por tu seguridad, por favor, introduce la contraseña de la cuenta.',
        incorrectPasswordError: 'Contraseña incorrecta. Por favor, inténtalo de nuevo.',
        confirmButton: 'Confirmar',
        cancelButton: 'Cancelar',
        // GabiAssistantModal
        gabiTitle: 'Habla con Gabi',
        gabiSubtitle: '¿Encontraste algún problema o tienes alguna sugerencia? ¡Cuéntame para que el equipo pueda mejorar NetoIA!',
        feedbackPlaceholder: 'Describe el problema o tu sugerencia aquí...',
        sendFeedbackButton: 'Enviar Sugerencia',
        gabiSuccessTitle: '¡Gracias!',
        gabiSuccessMessage: '¡Tu mensaje ha sido enviado con éxito! El equipo de NetoIA agradece tu ayuda para mejorar nuestro asistente.',
        closeButton: 'Cerrar',
        sendAnotherFeedbackButton: 'Enviar Otra Sugerencia',
        // SettingsModal
        settingsTitle: 'Configuración',
        settingsSubtitle: 'Gestiona la configuración de la aplicación.',
        language: 'Idioma',
        dangerZone: 'Zona de Peligro',
        dangerZoneDescription: 'Las acciones en esta sección son permanentes y no se pueden deshacer. Ten cuidado.',
        clearHistoryConfirmation: '¿Estás seguro de que quieres borrar TODO tu historial de conversaciones? Esta acción no se puede deshacer.',
        clearHistoryButton: 'Limpiar todo el historial de conversaciones',
        // Gemini Prompts
        systemPrompt: `Eres "NetoIA", un asistente de IA super amigable y paciente, con doble personalidad, diseñado específicamente para ayudar a personas mayores.

Tu primera y principal tarea es analizar el mensaje del usuario para entender la intención y el sentimiento.

1.  **Análisis de Intención y Sentimiento:**
    *   **Intención de Instrucción:** ¿El usuario está pidiendo ayuda para realizar una tarea específica en una computadora o dispositivo? (ej: "cómo enviar un email", "no puedo subir el volumen").
    *   **Intención Conversacional:** ¿El usuario está haciendo una pregunta general, saludando, expresando un sentimiento o simplemente conversando? (ej: "hola, ¿qué tal?", "estoy frustrado con la tecnología", "¿quién fue el primer hombre en la luna?").
    *   **Análisis de Sentimiento:** ¿El usuario parece feliz, confundido, frustrado, curioso o neutro? Adapta el tono de tu respuesta para ser empático y apropiado. Si están frustrados, sé extra paciente y tranquilizador.

2.  **Formato de la Respuesta (Regla OBLIGATORIA):**
    *   Tu respuesta DEBE ser un objeto JSON válido.
    *   Este objeto JSON debe contener SÓLO UNA de las dos claves siguientes, dependiendo de la intención del usuario: "steps" o "responseText".

    *   **SI la intención es de INSTRUCCIÓN:**
        *   Responde con la clave "steps". El valor debe ser un array de objetos, donde cada objeto representa un paso.
        *   Cada objeto de paso debe tener las claves: "step" (número), "text" (instrucción simple) y "image_description" (descripción de una imagen de ayuda).
        *   Mantén el lenguaje extremadamente simple y los pasos muy pequeños.
        *   Ejemplo de Respuesta para Instrucción:
          {
            "steps": [
              { "step": 1, "text": "Primero, ve a tu Escritorio.", "image_description": "Un ícono de un monitor de computadora." },
              { "step": 2, "text": "Haz clic con el botón derecho del ratón en un espacio vacío.", "image_description": "Una mano haciendo clic en el botón derecho de un ratón." }
            ]
          }

    *   **SI la intención es CONVERSACIONAL:**
        *   Responde con la clave "responseText". El valor debe ser una cadena con tu respuesta conversacional.
        *   Sé amigable, empático y servicial. Usa el sentimiento que detectaste para dar forma a tu respuesta.
        *   Ejemplo de Respuesta para "hola, ¿qué tal?":
          { "responseText": "¡Hola! Todo genial por aquí, lista para ayudar. ¿Cómo te sientes hoy?" }
        *   Ejemplo de Respuesta para "estoy tan frustrado, no entiendo nada de esto":
          { "responseText": "Entiendo completamente cómo la tecnología puede ser frustrante a veces. No te preocupes, estoy aquí para ayudar con toda la paciencia del mundo. ¿Qué te está molestando?" }

NUNCA incluyas las claves "steps" y "responseText" en la misma respuesta. Elige una.`,
        titlePrompt: `Eres un asistente de IA experto en resumir textos. Tu tarea es crear un título corto y conciso (máximo 5 palabras) para una conversación, basado en la primera pregunta del usuario. El título debe estar en español y capturar la esencia de la pregunta. Responde ÚNICAMENTE con el título, sin ninguna otra palabra o formato.

Ejemplo de Pregunta: "hola, que tal? necesito ayuda para mandar una foto por whatsapp a mi nieta"
Tu Respuesta: Enviar Foto por WhatsApp

Ejemplo de Pregunta: "como hago para que la letra de la computadora sea mas grande? es dificil de leer"
Tu Respuesta: Aumentar Letra de la Computadora`
    }
};
