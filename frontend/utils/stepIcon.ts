import {
    BatteryCharging,
    Bell,
    Bluetooth,
    Calendar,
    Camera,
    CircleCheck,
    ClipboardPaste,
    Clock,
    Copy,
    CreditCard,
    Download,
    FileText,
    Folder,
    Globe,
    Headphones,
    Image,
    Keyboard,
    KeyRound,
    Lightbulb,
    Link,
    Lock,
    LogIn,
    Mail,
    Maximize,
    MessageCircle,
    Monitor,
    Mouse,
    MousePointerClick,
    Phone,
    Play,
    Plug,
    Power,
    Printer,
    Router,
    Save,
    Search,
    Settings,
    Share2,
    Smartphone,
    Sun,
    Trash2,
    Type,
    Upload,
    Usb,
    User,
    Video,
    Volume2,
    Wifi,
    ZoomIn,
    type LucideIcon,
} from 'lucide-react';
import type { InstructionStep } from '../types';

/**
 * Keywords are written without accents and in lower case, because the text is
 * normalized before matching. A trailing "*" matches any continuation of the
 * word (e.g. "pesquis*" covers "pesquisar", "pesquise" and "pesquisa").
 *
 * Order matters, since the first rule that matches wins. Rules are grouped
 * from most to least telling: concrete devices and apps, then the action the
 * user must perform, then on-screen objects, and finally the generic "click"
 * catch-all that would otherwise swallow almost every step.
 */
const iconRules: Array<{ icon: LucideIcon; keywords: string[] }> = [
    // Devices, hardware and apps.
    { icon: Phone, keywords: ['ligar para', 'ligacao', 'ligacoes', 'telefonar', 'discar', 'llamar', 'llamada', 'telefone', 'telefono'] },
    { icon: Power, keywords: ['ligar', 'ligue', 'desligar', 'desligue', 'reiniciar', 'encender', 'prender', 'apagar la computadora', 'apagar el ordenador', 'apagar el equipo', 'botao de energia', 'boton de encendido', 'energia', 'power'] },
    { icon: Wifi, keywords: ['wifi', 'wi-fi', 'wi fi', 'rede sem fio', 'red inalambrica', 'sem fio', 'inalambrica'] },
    { icon: Router, keywords: ['roteador', 'router', 'modem'] },
    { icon: Bluetooth, keywords: ['bluetooth'] },
    { icon: Usb, keywords: ['usb', 'pendrive', 'pen drive'] },
    { icon: Plug, keywords: ['cabo', 'cabos', 'tomada', 'plugue', 'enchufe', 'cable'] },
    { icon: BatteryCharging, keywords: ['bateria', 'carregador', 'cargador', 'carregando', 'cargando'] },
    { icon: Printer, keywords: ['imprimir', 'impressora', 'impresora', 'impressao', 'impresion'] },
    { icon: Camera, keywords: ['camera', 'fotografar', 'tirar foto', 'tirar uma foto', 'sacar una foto', 'webcam'] },
    { icon: Headphones, keywords: ['fone', 'fones', 'headphone', 'headphones', 'auriculares', 'audifonos', 'headset'] },
    { icon: Video, keywords: ['video', 'videos', 'videochamada', 'chamada de video', 'videollamada', 'youtube', 'filme', 'pelicula'] },
    { icon: Volume2, keywords: ['volume', 'volumen', 'som', 'audio', 'alto-falante', 'altavoz', 'sonido', 'mudo'] },
    { icon: Mail, keywords: ['email', 'e-mail', 'emails', 'gmail', 'outlook', 'correio', 'correo', 'caixa de entrada', 'bandeja de entrada'] },
    { icon: MessageCircle, keywords: ['whatsapp', 'mensagem', 'mensagens', 'conversa', 'chat', 'mensaje', 'sms'] },
    { icon: Globe, keywords: ['navegador', 'navegue', 'site', 'sites', 'internet', 'pagina', 'web', 'chrome', 'edge', 'firefox', 'safari'] },

    // What the user has to do.
    { icon: Download, keywords: ['baixar', 'baixe', 'download', 'descargar', 'descarga'] },
    { icon: Upload, keywords: ['upload', 'anexar', 'anexo', 'adjuntar', 'subir'] },
    { icon: Trash2, keywords: ['excluir', 'exclua', 'apagar', 'apague', 'deletar', 'lixeira', 'eliminar', 'borrar', 'papelera', 'remover'] },
    { icon: Save, keywords: ['salvar', 'salve', 'guardar', 'guarde'] },
    { icon: Copy, keywords: ['copiar', 'copie', 'copia'] },
    { icon: ClipboardPaste, keywords: ['colar', 'cole', 'pegar', 'pegue', 'recortar'] },
    { icon: Share2, keywords: ['compartilhar', 'compartir', 'encaminhar'] },
    { icon: ZoomIn, keywords: ['aumentar', 'aumente', 'ampliar', 'zoom', 'maior', 'agrandar', 'acercar'] },
    { icon: Search, keywords: ['pesquis*', 'procur*', 'busca', 'buscar', 'busque', 'buscador', 'lupa'] },

    // Things shown on the screen.
    { icon: Folder, keywords: ['pasta', 'pastas', 'carpeta', 'carpetas', 'diretorio'] },
    { icon: FileText, keywords: ['arquivo', 'arquivos', 'documento', 'documentos', 'archivo', 'archivos', 'word', 'pdf', 'planilha'] },
    { icon: Image, keywords: ['imagem', 'imagens', 'foto', 'fotos', 'galeria', 'imagen', 'imagenes', 'papel de parede', 'fondo de pantalla'] },
    { icon: Type, keywords: ['tamanho da letra', 'fonte', 'fuente', 'letra', 'letras', 'negrito'] },
    { icon: Sun, keywords: ['brilho', 'claridade', 'brillo', 'luminosidade'] },
    { icon: Bell, keywords: ['notificacao', 'notificacoes', 'notificacion', 'notificaciones', 'aviso', 'avisos', 'alerta', 'campainha'] },
    { icon: KeyRound, keywords: ['senha', 'senhas', 'contrasena', 'password'] },
    { icon: Lock, keywords: ['bloquear', 'bloqueio', 'seguranca', 'seguridad', 'privacidade', 'privacidad', 'proteger'] },
    { icon: User, keywords: ['perfil', 'conta', 'contas', 'usuario', 'cuenta', 'avatar'] },
    { icon: LogIn, keywords: ['login', 'iniciar sesion', 'fazer login', 'acessar sua conta'] },
    { icon: CreditCard, keywords: ['cartao', 'pagamento', 'pagar', 'banco', 'tarjeta', 'pago', 'boleto'] },
    { icon: Calendar, keywords: ['calendario', 'agenda', 'data', 'fecha', 'compromisso'] },
    { icon: Clock, keywords: ['hora', 'horario', 'aguarde', 'espere', 'minutos', 'segundos', 'tempo'] },
    { icon: Settings, keywords: ['configuracoes', 'configuracao', 'configuracion', 'ajustes', 'definicoes', 'preferencias', 'engrenagem', 'painel de controle', 'panel de control'] },
    { icon: Link, keywords: ['link', 'url', 'endereco', 'enlace', 'direccion'] },
    { icon: Smartphone, keywords: ['celular', 'smartphone', 'movil', 'telemovel', 'tablet', 'aparelho'] },
    { icon: Maximize, keywords: ['janela', 'ventana', 'maximizar', 'minimizar', 'tela cheia', 'pantalla completa'] },
    { icon: Play, keywords: ['reproduzir', 'reproducir', 'tocar', 'play', 'assistir'] },
    { icon: CircleCheck, keywords: ['pronto', 'concluido', 'finalizado', 'sucesso', 'listo', 'terminado', 'confirmar', 'confirme', 'aceitar', 'aceptar'] },
    { icon: Keyboard, keywords: ['tecla*', 'digite', 'digita', 'digitar', 'digitando', 'escreva', 'escriba', 'escribe'] },
    { icon: Mouse, keywords: ['mouse', 'raton', 'botao direito', 'boton derecho', 'clique duplo', 'duplo clique', 'doble clic'] },
    { icon: Monitor, keywords: ['area de trabalho', 'escritorio', 'monitor', 'computador', 'computadora', 'ordenador', 'desktop', 'tela', 'pantalla', 'pc'] },

    // Generic catch-all: nearly every step tells the user to click something.
    { icon: MousePointerClick, keywords: ['clique', 'clicar', 'clic', 'selecione', 'seleccione', 'toque', 'pressione', 'presione', 'aperte', 'botao', 'boton', 'icone', 'icono', 'menu', 'abra', 'abrir'] },
];

const fallbackIcon = Lightbulb;

const normalize = (value: string): string =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Boundaries are spelled out instead of using \b so that keywords containing
// hyphens or spaces ("wi-fi", "area de trabalho") still match whole words only.
const buildMatcher = (keywords: string[]): RegExp => {
    const alternatives = keywords
        .map((keyword) =>
            keyword.endsWith('*')
                ? `${escapeRegExp(keyword.slice(0, -1))}[a-z]*`
                : escapeRegExp(keyword),
        )
        .join('|');

    return new RegExp(`(?:^|[^a-z0-9])(?:${alternatives})(?![a-z0-9])`);
};

const compiledRules = iconRules.map(({ icon, keywords }) => ({
    icon,
    matcher: buildMatcher(keywords),
}));

/**
 * Picks an icon that matches what the step is actually about, so the
 * illustration reinforces the instruction instead of showing a random photo.
 */
export const getStepIcon = (step: InstructionStep): LucideIcon => {
    const haystack = normalize(`${step.text ?? ''} ${step.image_description ?? ''}`);
    return compiledRules.find(({ matcher }) => matcher.test(haystack))?.icon ?? fallbackIcon;
};
