import { Linkedin, User } from "lucide-react";
import type { TeamMember } from "@/lib/site-config";
import { withBasePath } from "@/lib/asset-path";

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 sm:block sm:rounded-2xl sm:p-6">
      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background sm:mb-4 sm:size-16">
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
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-foreground sm:truncate-none">
          {member.name}
        </h3>
        <p className="truncate text-sm text-primary sm:truncate-none">{member.role}</p>
        <p className="mt-3 hidden text-sm leading-relaxed text-muted-foreground sm:block">
          {member.bio}
        </p>
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
    </div>
  );
}
