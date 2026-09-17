# KidVenture Enterprise

## Included in this runnable foundation
- React + TypeScript + Vite
- Responsive child/parent experience based on the supplied design
- K–6 curriculum data model and 126 seeded lessons
- Interactive lesson player with questions, feedback and XP
- Multiple learner profiles
- Progress/mastery dashboard
- Parent/family controls
- Parent / Teacher / Admin role switch for UI prototyping
- IndexedDB persistence with offline fallback
- PWA manifest and service worker
- Accessibility settings and scalable text
- Offline-first app shell

## Production enterprise architecture
Recommended production services:
1. Identity: OIDC/OAuth2 with parent, learner, teacher, school-admin and platform-admin roles.
2. API: versioned REST/GraphQL gateway with schema validation, rate limits and audit logging.
3. Database: PostgreSQL with tenant_id on organization-scoped entities.
4. Content CMS: versioned curriculum, lessons, questions, media and standards mappings.
5. Learning engine: mastery model, prerequisites, spaced review and adaptive sequencing.
6. Media: object storage + CDN, signed URLs, transcoding and safe-content pipeline.
7. Analytics: event stream -> warehouse; parent/teacher dashboards use aggregate views.
8. Notifications: email/push with consent and quiet hours.
9. Security: encryption in transit/at rest, secrets manager, least privilege, audit trail, backups and disaster recovery.
10. Compliance: design for COPPA/FERPA requirements where applicable, with legal/privacy review before launch.

## Suggested domain model
Organization, School, Classroom, User, ChildProfile, ParentLink, TeacherAssignment, Grade, Subject, Standard, Unit, Lesson, Activity, Question, Attempt, MasteryRecord, Badge, Goal, LearningEvent, MediaAsset, Consent, AuditEvent.

## Local development
`npm install`
`npm run dev`
`npm run typecheck`
`npm run build`

The bundled frontend uses local demo persistence intentionally. It does not claim to be a production backend or production compliance implementation.
