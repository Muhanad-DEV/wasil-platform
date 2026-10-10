export interface VCardOptions {
  name: string;
  nameAr?: string | null;
  jobTitle: string;
  jobTitleAr?: string | null;
  companyName: string;
  companyNameAr?: string | null;
  phone: string;
  secondaryPhone?: string | null;
  whatsapp?: string | null;
  email: string;
  website?: string | null;
  location?: string | null;
  bio?: string | null;
}

export function generateVCardString(options: VCardOptions): string {
  const displayName = options.nameAr ? `${options.name} | ${options.nameAr}` : options.name;
  const displayTitle = options.jobTitleAr ? `${options.jobTitle} | ${options.jobTitleAr}` : options.jobTitle;
  const displayOrg = options.companyNameAr ? `${options.companyName} | ${options.companyNameAr}` : options.companyName;

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN;CHARSET=UTF-8:${displayName}`,
    `N;CHARSET=UTF-8:${options.name};;;;`,
    `ORG;CHARSET=UTF-8:${displayOrg}`,
    `TITLE;CHARSET=UTF-8:${displayTitle}`,
    `TEL;TYPE=WORK,VOICE:${options.phone}`,
  ];

  if (options.secondaryPhone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${options.secondaryPhone}`);
  }

  lines.push(`EMAIL;TYPE=WORK,INTERNET:${options.email}`);

  if (options.website) {
    lines.push(`URL:${options.website}`);
  }

  if (options.location) {
    lines.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;;${options.location};;Sultanate of Oman;`);
  }

  const notes: string[] = [];
  if (options.whatsapp) {
    notes.push(`WhatsApp: ${options.whatsapp}`);
  }
  if (options.bio) {
    notes.push(options.bio);
  }
  if (notes.length > 0) {
    lines.push(`NOTE;CHARSET=UTF-8:${notes.join(' | ')}`);
  }

  lines.push('REV:' + new Date().toISOString());
  lines.push('END:VCARD');

  return lines.join('\r\n');
}
