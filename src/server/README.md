# MediaQC TRPC Backend

Complete backend architecture for MediaQC system with TRPC, Zod schemas, and service layer.

## 📁 Structure

```
src/server/
├── schemas/           # Zod validation schemas
│   ├── project.schema.ts
│   ├── asset.schema.ts
│   ├── media.schema.ts
│   └── qc.schema.ts
│
├── routers/           # TRPC route definitions
│   ├── projects.router.ts
│   ├── assets.router.ts
│   ├── media.router.ts
│   ├── qc.router.ts
│   └── _app.ts        # Main router
│
├── services/          # Business logic layer
│   ├── project.service.ts
│   ├── asset.service.ts
│   ├── media.service.ts
│   └── qc.service.ts
│
├── mocks/             # Mock data generators
│   ├── project.mocks.ts
│   ├── asset.mocks.ts
│   └── media.mocks.ts
│
├── utils/             # Utility functions
│   ├── subtitle-parser.ts
│   └── audio-processor.ts
│
├── trpc.ts            # TRPC configuration
└── README.md          # This file
```

## 🔌 API Endpoints

### Projects Router

- `projects.list` → Get list of projects (CommandCenter)
- `projects.get` → Get single project (AssetMap metadata)
- `projects.create` → Create new project
- `projects.update` → Update project
- `projects.delete` → Delete project
- `projects.getDemo` → Get demo fixture project

### Assets Router

- `assets.getTree` → Get asset tree structure (AssetMap views)
- `assets.getAsset` → Get single asset
- `assets.create` → Create new asset
- `assets.update` → Update asset
- `assets.delete` → Delete asset
- `assets.listByProject` → List all assets for a project

### Media Router

- `media.getSubtitleTrack` → Get subtitle data (OcularFlow)
- `media.getAudioTrack` → Get audio data (DubFlow)
- `media.upload` → Upload media file
- `media.getMediaUrl` → Get playback/download URL
- `media.process` → Trigger media processing

### QC Router

- `qc.scoreSubtitleAsset` → Score subtitle track
- `qc.scoreAudioAsset` → Score audio track
- `qc.getScore` → Get QC score
- `qc.generateReport` → Generate QC report
- `qc.listScores` → List scores for project

## 📊 Data Models

### Project

```typescript
{
  id: string;
  name: string;
  type: 'user-uploaded' | 'demo-fixture';
  status: 'draft' | 'in-progress' | 'review' | 'completed';
  metadata: {
    originalLanguage: string;
    duration: number;
    // ...
  };
  storage: {
    masterVideo: string;
    audioTracks: Record<string, string>;
    subtitleFiles: Record<string, string>;
    // ...
  };
}
```

### Asset Tree

```typescript
{
  projectId: string;
  root: {
    asset: Asset;
    children: AssetTreeNode[];
  };
  flatList: Asset[];
}
```

### Subtitle Track

```typescript
{
  assetId: string;
  segments: SubtitleSegment[];
  metadata: { /* ... */ };
  qcSummary: { /* ... */ };
  reviewQueue: ReviewItem[];
}
```

### Audio Track

```typescript
{
  assetId: string;
  waveform: { /* ... */ };
  issues: AudioIssue[];
  qcSummary: { /* ... */ };
}
```

## 🎬 Demo Project

Demo fixture project should be placed in `/public/demo-project/`:

```
/public/demo-project/
├── master.mp4
├── audio-source.wav
├── audio-de.wav
├── subtitles-en.itt
├── subtitles-es.itt
├── subtitles-de.itt
├── scene-cuts.json
├── fn-events.json
├── knp.json
├── metadata.json
└── assetmap.json
```

## 🔧 Implementation Notes

### Current State
- ✅ Full Zod schemas with validation
- ✅ Complete TRPC router definitions
- ✅ Service layer with business logic
- ✅ Mock data generators
- ✅ Utility functions (pseudocode)
- ⚠️ In-memory data store (replace with DB)
- ⚠️ Subtitle parser (pseudocode - needs implementation)
- ⚠️ Audio processor (pseudocode - needs implementation)

### To Implement
1. **Database Layer**: Replace in-memory maps with Prisma/Drizzle ORM
2. **Storage**: Implement S3/cloud storage integration
3. **Subtitle Parser**: Complete ITT/SRT/VTT parsers
4. **Audio Processor**: Implement waveform generation and QC detection
5. **Authentication**: Add auth middleware to TRPC procedures
6. **File Upload**: Implement presigned URL generation for uploads

### Recommended Libraries
- **Subtitle Parsing**: `subtitle`, `srt-parser-2`
- **Audio Processing**: `node-wav`, `audioworklet`, `web-audio-api`
- **Storage**: `@aws-sdk/client-s3` or similar
- **Database**: `prisma` or `drizzle-orm`

## 🚀 Usage

### Server Setup (Example)

```typescript
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './routers/_app';
import { createContext } from './trpc';

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

server.listen(3000);
```

### Client Setup (Frontend)

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server/routers/_app';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

// Usage in components
const projects = await trpc.projects.list.query({ limit: 10 });
const assetTree = await trpc.assets.getTree.query({ projectId: '...' });
const subtitles = await trpc.media.getSubtitleTrack.query({ assetId: '...' });
```

## 📝 Example Payloads

See individual router files and mock data generators for complete example payloads.

## 🔒 Security Considerations

- Add authentication middleware to protected procedures
- Validate file uploads (type, size, content)
- Implement rate limiting
- Add CORS configuration
- Sanitize user inputs (already covered by Zod)
- Use presigned URLs for media access
