import { Linkedin, User } from "lucide-react";
import type { TeamMember } from "@/lib/site-config";
import { withBasePath } from "@/lib/asset-path";

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex size-16 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
        {member.photoUrl ? (
          <img
            src={withBasePath(member.photoUrl)}
            alt={`Portrait of ${member.name}`}
            width={64}
            height={64}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <User className="size-7 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground">{member.name}</h3>
      <p className="text-sm text-primary">{member.role}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Linkedin className="size-4" aria-hidden="true" />
          LinkedIn
        </a>
      )}
    </div>
  );
}
