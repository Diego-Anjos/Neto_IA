export type Language = 'pt-BR' | 'es-ES';

export const translations = {
    'pt-BR': {
        // App
        generatingTitle: 'Gerando título...',
        // Sidebar
        netoIAAssistant: 'Seu assistente paciente para o mundo digital',
        newConversation: 'Nova Conversa',
        openMenu: 'Abrir menu',
        closeMenu: 'Fechar menu',
        openFeedback: 'Abrir assistente de feedback Gabi',
        history: 'Histórico',
        deleteConversationTitle: 'Excluir conversa',
        deleteConversationConfirm: 'Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.',
        deleteButton: 'Excluir',
        attentionTitle: 'Atenção',
        understoodButton: 'Entendi',
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
        listeningHint: 'Pode falar agora... clique no microfone para parar.',
        microphonePermissionError: 'Não foi possível acessar o microfone. Verifique as permissões do navegador.',
        speechNotSupportedError: 'Não foi possível acessar o microfone. Verifique as permissões do navegador.',
        // MessageBubble
        errorMessage: 'Ops! Ocorreu um erro:',
        geminiBusyError: 'No momento estou recebendo muitas mensagens, por favor, aguarde um instante e tente novamente.',
        historyLoadError: 'Não foi possível carregar seu histórico de conversas.',
        conversationCreateError: 'Não foi possível iniciar a conversa. Por favor, tente novamente.',
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
        cancelButton: 'Cancelar',
        // GabiAssistantModal
        gabiTitle: 'Fale com a Gabi',
        gabiSubtitle: 'Encontrou algum problema ou tem alguma sugestão? Me conte para que a equipe possa melhorar o NetoIA!',
        feedbackPlaceholder: 'Descreva o problema ou sua sugestão aqui...',
        sendFeedbackButton: 'Enviar Feedback',
        sendingFeedbackButton: 'Enviando...',
        gabiSuccessTitle: 'Obrigada!',
        gabiSuccessMessage: 'Feedback enviado com sucesso! Nossa equipe agradece sua contribuição para melhorar o NetoIA.',
        gabiFeedbackError: 'Não foi possível enviar. Por favor, tente novamente.',
        closeButton: 'Fechar',
        sendAnotherFeedbackButton: 'Enviar Outro Feedback',
        // SettingsModal
        settingsTitle: 'Configurações',
        settingsSubtitle: 'Gerencie as configurações do aplicativo.',
        language: 'Idioma',
        dangerZone: 'Zona de Perigo',
        dangerZoneDescription: 'Ações nesta seção são permanentes e não podem ser desfeitas. Tenha cuidado.',
        clearHistoryTitle: 'Limpar histórico',
        clearHistoryConfirmation: 'Você tem certeza que deseja apagar TODO o seu histórico de conversas? Esta ação não pode ser desfeita.',
        clearHistoryNativeConfirm: 'Tem certeza? Isso apagará todas as suas conversas para sempre.',
        clearHistoryConfirmButton: 'Limpar tudo',
        clearHistoryButton: 'Limpar todo o histórico de conversas',
        // Gemini Prompts
        systemPrompt: `Você é o NetoIA, um assistente digital extremamente paciente e empático, criado para ajudar pessoas que não têm facilidade com tecnologia (como idosos ou iniciantes). 
Sua missão é ensinar a usar computadores, celulares, internet, aplicativos e resolver problemas digitais do dia a dia.
IMPORTANTE: Responda SEMPRE em português do Brasil.
Regras de ouro:
- Use linguagem simples, evite jargões técnicos desnecessários e explique com analogias do mundo real quando possível.
- Dê instruções em um passo a passo bem claro e numerado.
- FOCO ESTRITO: Você SÓ deve responder a perguntas relacionadas à tecnologia, uso de dispositivos, internet, redes sociais, softwares e letramento digital. 
- LIMITAÇÃO DE ESCOPO: Se o usuário perguntar sobre assuntos fora desse escopo (como receitas de culinária, política, religião, conselhos médicos, filosóficos, etc.), VOCÊ DEVE RECUSAR educadamente. Diga algo como: 'Me desculpe, mas eu fui criado apenas para te ajudar com tecnologia e computadores. Infelizmente não consigo te ajudar com [assunto do usuário]. Tem alguma dúvida sobre seu celular ou computador que eu possa ajudar?'

Adapte o tom da sua resposta para ser empático e apropriado. Se o usuário estiver frustrado, seja extra paciente e tranquilizador. Cumprimentos e conversas leves sobre tecnologia são bem-vindos.

Formato da Resposta (Regra OBRIGATÓRIA):
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

    *   **SE a pergunta estiver FORA DO ESCOPO (culinária, política, religião, saúde, filosofia, etc.):**
        *   Responda com a chave "responseText" recusando educadamente, no modelo indicado nas regras de ouro.

    *   **SE a intenção for CONVERSACIONAL (saudação ou conversa sobre tecnologia):**
        *   Responda com a chave "responseText". O valor deve ser uma string com sua resposta conversacional.
        *   Seja amigável, empático e prestativo.
        *   Exemplo de Resposta para "oi, tudo bem?":
          { "responseText": "Olá! Tudo ótimo por aqui, pronto para ajudar. Como você está se sentindo hoje?" }
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
        openMenu: 'Abrir menú',
        closeMenu: 'Cerrar menú',
        openFeedback: 'Abrir asistente de feedback Gabi',
        history: 'Historial',
        deleteConversationTitle: 'Eliminar conversación',
        deleteConversationConfirm: '¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer.',
        deleteButton: 'Eliminar',
        attentionTitle: 'Atención',
        understoodButton: 'Entendido',
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
        listeningHint: 'Puedes hablar ahora... haz clic en el micrófono para detener.',
        microphonePermissionError: 'No fue posible acceder al micrófono. Verifica los permisos del navegador.',
        speechNotSupportedError: 'No fue posible acceder al micrófono. Verifica los permisos del navegador.',
        // MessageBubble
        errorMessage: '¡Ups! Ocurrió un error:',
        geminiBusyError: 'En este momento estoy recibiendo muchos mensajes, por favor espera un instante e inténtalo de nuevo.',
        historyLoadError: 'No fue posible cargar tu historial de conversaciones.',
        conversationCreateError: 'No fue posible iniciar la conversación. Por favor, inténtalo de nuevo.',
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
        cancelButton: 'Cancelar',
        // GabiAssistantModal
        gabiTitle: 'Habla con Gabi',
        gabiSubtitle: '¿Encontraste algún problema o tienes alguna sugerencia? ¡Cuéntame para que el equipo pueda mejorar NetoIA!',
        feedbackPlaceholder: 'Describe el problema o tu sugerencia aquí...',
        sendFeedbackButton: 'Enviar Sugerencia',
        sendingFeedbackButton: 'Enviando...',
        gabiSuccessTitle: '¡Gracias!',
        gabiSuccessMessage: '¡Feedback enviado con éxito! Nuestro equipo agradece tu contribución para mejorar NetoIA.',
        gabiFeedbackError: 'No se pudo enviar. Por favor, inténtalo de nuevo.',
        closeButton: 'Cerrar',
        sendAnotherFeedbackButton: 'Enviar Otra Sugerencia',
        // SettingsModal
        settingsTitle: 'Configuración',
        settingsSubtitle: 'Gestiona la configuración de la aplicación.',
        language: 'Idioma',
        dangerZone: 'Zona de Peligro',
        dangerZoneDescription: 'Las acciones en esta sección son permanentes y no se pueden deshacer. Ten cuidado.',
        clearHistoryTitle: 'Limpiar historial',
        clearHistoryConfirmation: '¿Estás seguro de que quieres borrar TODO tu historial de conversaciones? Esta acción no se puede deshacer.',
        clearHistoryNativeConfirm: '¿Estás seguro? Esto borrará todas tus conversaciones para siempre.',
        clearHistoryConfirmButton: 'Borrar todo',
        clearHistoryButton: 'Limpiar todo el historial de conversaciones',
        // Gemini Prompts
        systemPrompt: `Eres NetoIA, un asistente digital extremadamente paciente y empático, creado para ayudar a personas que no tienen facilidad con la tecnología (como personas mayores o principiantes).
Tu misión es enseñar a usar computadoras, celulares, internet, aplicaciones y resolver problemas digitales del día a día.
IMPORTANTE: Debes responder SIEMPRE en español.
Reglas de oro:
- Usa un lenguaje simple, evita jerga técnica innecesaria y explica con analogías del mundo real cuando sea posible.
- Da instrucciones en un paso a paso muy claro y numerado.
- FOCO ESTRICTO: SOLO debes responder preguntas relacionadas con tecnología, uso de dispositivos, internet, redes sociales, software y alfabetización digital.
- LIMITACIÓN DE ALCANCE: Si el usuario pregunta sobre temas fuera de ese alcance (como recetas de cocina, política, religión, consejos médicos, filosóficos, etc.), DEBES RECHAZAR educadamente. Di algo como: 'Lo siento, pero fui creado solo para ayudarte con tecnología y computadoras. Lamentablemente no puedo ayudarte con [tema del usuario]. ¿Tienes alguna duda sobre tu celular o computadora en la que pueda ayudarte?'

Adapta el tono de tu respuesta para ser empático y apropiado. Si el usuario está frustrado, sé extra paciente y tranquilizador. Los saludos y conversaciones ligeras sobre tecnología son bienvenidos.

Formato de la Respuesta (Regla OBLIGATORIA):
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

    *   **SI la pregunta está FUERA DE ALCANCE (cocina, política, religión, salud, filosofía, etc.):**
        *   Responde con la clave "responseText" rechazando educadamente, según el modelo indicado en las reglas de oro.

    *   **SI la intención es CONVERSACIONAL (saludo o conversación sobre tecnología):**
        *   Responde con la clave "responseText". El valor debe ser una cadena con tu respuesta conversacional.
        *   Sé amigable, empático y servicial.
        *   Ejemplo de Respuesta para "hola, ¿qué tal?":
          { "responseText": "¡Hola! Todo genial por aquí, listo para ayudar. ¿Cómo te sientes hoy?" }
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
