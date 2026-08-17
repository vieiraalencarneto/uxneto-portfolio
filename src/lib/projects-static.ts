import type { Locale } from "./i18n";

type LocalizedString = { en: string; pt: string };

export type ProjectStub = {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  label: LocalizedString;
  role: string;
  date: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  accentColor: string;
};

export const PROJECTS: ProjectStub[] = [
  {
    slug: "improving-havan-gift-list",
    title: {
      en: "New Havan's Gift List",
      pt: "Nova Lista de Presentes da Havan",
    },
    description: {
      en: "How UX improvements drove 42% revenue growth and 79.5% more sign-ups — entirely through organic traffic.",
      pt: "Como melhorias de UX geraram 42% de crescimento em receita e 79,5% mais cadastros — inteiramente por tráfego orgânico.",
    },
    label: { en: "CASE STUDY", pt: "ESTUDO DE CASO" },
    role: "Product Designer",
    date: "2023 — 2025",
    thumbnailUrl: "https://framerusercontent.com/images/wmU6Xc4CKXI2kvmX1CtLIsFj0Y.png",
    thumbnailAlt: "Havan Gift List redesign interface",
    accentColor: "#fde440",
  },
  {
    slug: "havan-headers-ecommerce-gift-registry-internal-systems",
    title: {
      en: "Three Faces of the Header",
      pt: "Três Faces do Header",
    },
    description: {
      en: "One design system, three contexts: e-commerce, gift registry, and internal tools — each with distinct navigation needs.",
      pt: "Um sistema de design, três contextos: e-commerce, lista de presentes e ferramentas internas — cada um com necessidades de navegação distintas.",
    },
    label: { en: "CASE STUDY", pt: "ESTUDO DE CASO" },
    role: "Product Designer",
    date: "2022 — 2024",
    thumbnailUrl: "https://framerusercontent.com/images/CjEm7elxROc3umNHB3GRL8MAA.png",
    thumbnailAlt: "MacBook with header application",
    accentColor: "#c6bffa",
  },
  {
    slug: "saving-costs-whatsapp-button",
    title: {
      en: "86% Fewer Misdirected Calls",
      pt: "86% Menos Ligações Erradas",
    },
    description: {
      en: "Segmenting user intent behind a WhatsApp button saved R$91k/year in click costs within the first month.",
      pt: "Segmentar a intenção do usuário por trás de um botão de WhatsApp economizou R$91 mil/ano em custos de clique no primeiro mês.",
    },
    label: { en: "CASE STUDY", pt: "ESTUDO DE CASO" },
    role: "Product Designer",
    date: "2022",
    thumbnailUrl: "https://framerusercontent.com/images/rC7jAxmIPqE7ofhJopaNO7pc0.png",
    thumbnailAlt: "WhatsApp button UX flow",
    accentColor: "#56d270",
  },
  {
    slug: "havan-ecommerce-product-cards",
    title: {
      en: "Product Cards Built on Cognitive Biases",
      pt: "Cards de Produto com Vieses Cognitivos",
    },
    description: {
      en: "A systematic approach to designing product cards that use psychological principles to inform and convert.",
      pt: "Uma abordagem sistemática para projetar cards de produto usando princípios psicológicos para informar e converter.",
    },
    label: { en: "CASE STUDY", pt: "ESTUDO DE CASO" },
    role: "Product Designer",
    date: "2023",
    thumbnailUrl: "https://framerusercontent.com/images/UcDfXc4GUhpHP9jUS19mw6k.png",
    thumbnailAlt: "Havan e-commerce product card design",
    accentColor: "#fde440",
  },
  {
    slug: "showcasing-gift-registry-items-a-strategic-approach",
    title: {
      en: "Showcasing Gift Registry Items",
      pt: "Vitrine Estratégica de Lista de Presentes",
    },
    description: {
      en: "Strategic product showcases reduced list abandonment by 20% and increased average items added by 7%.",
      pt: "Vitrines estratégicas reduziram o abandono de lista em 20% e aumentaram a média de itens adicionados em 7%.",
    },
    label: { en: "CASE STUDY", pt: "ESTUDO DE CASO" },
    role: "Product Designer",
    date: "2023",
    thumbnailUrl: "https://framerusercontent.com/images/aThrLNCs65C26RW36jj7YOrre4.png",
    thumbnailAlt: "Gift registry items strategic showcase",
    accentColor: "#c6bffa",
  },
];

export function localizeProject(p: ProjectStub, locale: Locale) {
  return {
    ...p,
    title: p.title[locale],
    description: p.description[locale],
    label: p.label[locale],
  };
}
