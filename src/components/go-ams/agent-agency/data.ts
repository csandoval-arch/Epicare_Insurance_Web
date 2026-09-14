import { asset } from "@/lib/asset";
import { ComparisonImage, FeaturePill } from "./types";

export const AGENT_IMAGES: ComparisonImage[] = [
  {
    id: "policies",
    src: asset("/Files/Go_AMS/agent-agency/agent/go-ams-agent-policies.webp"),
    alt: "GO AMS - Pólizas de Agente"
  },
  {
    id: "details",
    src: asset("/Files/Go_AMS/agent-agency/agent/go-ams-agent-customer-details.webp"),
    alt: "GO AMS - Detalle de Clientes"
  },
  {
    id: "quote",
    src: asset("/Files/Go_AMS/agent-agency/agent/go-ams-agent-quote-enroll.webp"),
    alt: "GO AMS - Quote and Enroll"
  }
];

export const AGENCY_IMAGES: ComparisonImage[] = [
  {
    id: "agency_policies",
    src: asset("/Files/Go_AMS/agent-agency/agency/go-ams-agency-downline.webp"),
    alt: "GO AMS - Pólizas de Agencia"
  },
  {
    id: "agency_details",
    src: asset("/Files/Go_AMS/agent-agency/agency/go-ams-agency-broker-support.webp"),
    alt: "GO AMS - Detalle de Agencia"
  },
  {
    id: "agency_quote",
    src: asset("/Files/Go_AMS/agent-agency/agency/go-ams-agency-quote.webp"),
    alt: "GO AMS - Agency Quote"
  }
];

export const AGENT_FEATURES: FeaturePill[] = [
  {
    title: "Pólizas de Agente",
    description: "Acceso total a tus pólizas activas, renovaciones y análisis de cartera.",
    badge: "Policies"
  },
  {
    title: "Detalle de Clientes",
    description: "Expediente 360° del asegurado, historial de pólizas y documentos.",
    badge: "Details"
  },
  {
    title: "Quote & Enroll",
    description: "Cotización multicarrier y enrolamiento instantáneo con tus carriers.",
    badge: "Quote & Enroll"
  }
];

export const AGENCY_FEATURES: FeaturePill[] = [
  {
    title: "Pólizas de Downline",
    description: "Supervisión consolidada de producción, volumen y estado de compliance.",
    badge: "Policies"
  },
  {
    title: "Detalle de Agentes & Clientes",
    description: "Gestión de estructura, onboarding de productores y expedientes de agencia.",
    badge: "Details"
  },
  {
    title: "Quote & Contracts",
    description: "Resumen centralizado de appointments, acuerdos y cotización de grupo.",
    badge: "Contracts"
  }
];
