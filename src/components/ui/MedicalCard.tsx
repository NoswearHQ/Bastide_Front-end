import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MedicalCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

interface MedicalCardMediaProps {
  src: string;
  alt: string;
  className?: string;
}

interface MedicalCardContentProps {
  children: ReactNode;
  className?: string;
}

interface MedicalCardTitleProps {
  children: ReactNode;
  className?: string;
}

interface MedicalCardMetaProps {
  children: ReactNode;
  className?: string;
}

interface MedicalCardDescriptionProps {
  children: ReactNode;
  className?: string;
}

function MedicalCard({ children, className, hover = true }: MedicalCardProps) {
  return (
    <div className={cn("medical-card", !hover && "hover:shadow-lg hover:translate-y-0", className)}>
      {children}
    </div>
  );
}

function MedicalCardMedia({ src, alt, className }: MedicalCardMediaProps) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={cn("medical-card__media", className)}
    />
  );
}

function MedicalCardContent({ children, className }: MedicalCardContentProps) {
  return (
    <div className={cn("medical-card__content", className)}>
      {children}
    </div>
  );
}

function MedicalCardTitle({ children, className }: MedicalCardTitleProps) {
  return (
    <h3 className={cn("medical-card__title", className)}>
      {children}
    </h3>
  );
}

function MedicalCardMeta({ children, className }: MedicalCardMetaProps) {
  return (
    <div className={cn("medical-card__meta", className)}>
      {children}
    </div>
  );
}

function MedicalCardDescription({ children, className }: MedicalCardDescriptionProps) {
  return (
    <p className={cn("medical-card__description", className)}>
      {children}
    </p>
  );
}

// Compound component pattern
MedicalCard.Media = MedicalCardMedia;
MedicalCard.Content = MedicalCardContent;
MedicalCard.Title = MedicalCardTitle;
MedicalCard.Meta = MedicalCardMeta;
MedicalCard.Description = MedicalCardDescription;

export { MedicalCard };