# Feature Specification: Bilingual Iranian Revolution Memorial Website

**Feature Branch**: `001-revolution-memorial`  
**Created**: January 23, 2026  
**Status**: Draft  
**Input**: User description: "Build a bilingual (Persian / English) memorial, documentation, and media website focused on the Iranian Revolution, the crimes of the Islamic Republic, and the human cost of recent events."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Homepage Memorial Content (Priority: P1)

A visitor arrives at the website and views the homepage, which presents the historical context, current situation, victim statistics, and latest news in a respectful, documentary format.

**Why this priority**: The homepage is the primary entry point and must immediately communicate the site's purpose, provide key information, and establish the respectful, factual tone. This is the foundation for all other user journeys.

**Independent Test**: Can be fully tested by navigating to the homepage and verifying all four sections display correctly with proper bilingual support, current date in header, and respectful presentation. Delivers immediate value by providing comprehensive overview of the memorial's purpose and current information.

**Acceptance Scenarios**:

1. **Given** a visitor opens the homepage, **When** the page loads, **Then** they see all four sections (Iranian Revolution, Islamic Republic & Dictatorship, Victim Statistics, News & Official Statements) in their selected language
2. **Given** the homepage is displayed, **When** the visitor views Section 1, **Then** they see text about the Iranian Revolution, an image of the new leader, and a short factual introduction with historical, hopeful tone
3. **Given** the homepage is displayed, **When** the visitor views Section 2, **Then** they see explanation of the Islamic Republic as dictatorship, text and images showing oppression, and explanation of why the revolution began
4. **Given** the homepage is displayed, **When** the visitor views Section 3, **Then** they see live victim statistics showing total killed, breakdown by gender (women, men, children), with numbers updating dynamically
5. **Given** the homepage is displayed, **When** the visitor views Section 4, **Then** they see the first news item prominently with large image, title over image, and short excerpt, followed by remaining news items with title, thumbnail, date, location, and links
6. **Given** a visitor is on the homepage, **When** they view the header, **Then** they see the current date displayed and auto-updated
7. **Given** a visitor is on the homepage, **When** they view the footer, **Then** they see a minimal, respectful footer with memorial tone and minimal links

---

### User Story 2 - Browse and Read News Articles (Priority: P2)

A visitor navigates to news content, views article previews, and reads full articles with rich media content in their preferred language.

**Why this priority**: News articles are core documentation content that preserves historical memory and provides verified information. Users must be able to discover, preview, and read articles easily.

**Independent Test**: Can be fully tested by navigating to news listings, clicking articles, and verifying preview behavior (excerpt before separator) and full article display (all content after separator) with proper media display. Delivers value by providing structured access to documented events and official information.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage, **When** they click a news item, **Then** they are taken to the news detail page
2. **Given** a visitor views a news listing, **When** they see a news item preview, **Then** only content before the manual excerpt separator is displayed
3. **Given** a visitor opens a news detail page, **When** the page loads, **Then** they see full title, publication date, country and city, optional media (image/video/audio), and full text content in a long-form readable layout
4. **Given** a news item has media, **When** the visitor views the detail page, **Then** the media is displayed appropriately (image visible, video playable, audio playable)
5. **Given** a visitor reads a news article, **When** they view the content, **Then** all text appears in their selected language (Persian or English)

---

### User Story 3 - View Victim Memorials (Priority: P2)

A visitor navigates to the victims page to view the full list of documented victims, with filtering and sorting capabilities, presented respectfully.

**Why this priority**: The victims page is central to the memorial's purpose of documenting human cost with dignity. Users must be able to honor and remember individuals while finding specific entries efficiently.

**Independent Test**: Can be fully tested by navigating to the victims page, viewing entries with all required information (photo, name, age, gender, city, date of death, notes), and using filtering/sorting options. Delivers value by providing respectful access to documented victims and their information.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the victims page, **When** the page loads, **Then** they see a list of all victims with each entry showing photo, full name, age, gender, city, date of death, and optional notes
2. **Given** a visitor is on the victims page, **When** they use filtering options, **Then** the list updates to show only matching victims
3. **Given** a visitor is on the victims page, **When** they use sorting options, **Then** the list reorders according to the selected criteria
4. **Given** a victim entry has a photo, **When** the visitor views the entry, **Then** the photo is displayed respectfully and with proper aspect ratio
5. **Given** a visitor views victim entries, **When** they see the layout, **Then** it maintains a respectful, dignified presentation without gamification

---

### User Story 4 - Browse Media Gallery (Priority: P3)

A visitor navigates to the media page to browse photos and videos documenting events, with filtering by location, type, and date, and full-screen viewing capability.

**Why this priority**: Media content provides visual documentation of events. While important, it's secondary to textual documentation and victim memorials. Users need efficient ways to discover and view media.

**Independent Test**: Can be fully tested by navigating to the media page, viewing the responsive grid layout, applying filters (country, city, media type, date range), sorting results, and opening items in full-screen modal. Delivers value by providing organized access to visual documentation with strong filtering capabilities.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the media page, **When** the page loads, **Then** they see a responsive grid layout of media items (photos and videos)
2. **Given** a visitor views a media item, **When** they see the item, **Then** it displays media type, country, city, district/neighborhood (if available), event date, and description in their selected language
3. **Given** a visitor is on the media page, **When** they apply filters (country, city, media type, date range), **Then** the grid updates to show only matching items
4. **Given** a visitor is on the media page, **When** they change sorting options, **Then** items reorder by date or location as selected
5. **Given** a visitor clicks a media item, **When** they click it, **Then** it opens in a full-screen modal with smooth, respectful animations
6. **Given** a visitor views media content, **When** they see images or videos, **Then** no graphic violence is displayed (content adheres to ethical constraints)

---

### User Story 5 - View Official Statements (Priority: P3)

A visitor navigates to the statements page to view official statements, with the most recent statement highlighted prominently.

**Why this priority**: Official statements provide authoritative documentation but are less frequently accessed than news or victim information. The page must clearly present statements in chronological order.

**Independent Test**: Can be fully tested by navigating to the statements page, verifying the most recent statement is displayed first with image and visual highlighting, and clicking other statements to view full content. Delivers value by providing access to official documentation and positions.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the statements page, **When** the page loads, **Then** they see the most recent statement displayed first with image and visual highlighting
2. **Given** a visitor views the statements page, **When** they see remaining statements, **Then** they are displayed as titles with dates, clickable to full statement pages
3. **Given** a visitor clicks a statement, **When** they open it, **Then** they see the full statement content in their selected language

---

### User Story 6 - Switch Between Languages (Priority: P1)

A visitor switches between Persian (RTL) and English (LTR) languages, with the selection persisting across all pages and all content translating appropriately.

**Why this priority**: Bilingual support is a core requirement. The language switcher must work seamlessly across all pages and content, and the selection must persist to maintain user preference throughout their session.

**Independent Test**: Can be fully tested by using the language switcher on any page, verifying all text content changes language, layout adjusts for RTL/LTR, and the selection persists when navigating between pages. Delivers value by making the memorial accessible to both Persian and English speakers.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page, **When** they use the language switcher, **Then** all text content immediately changes to the selected language (Persian or English)
2. **Given** a visitor switches to Persian, **When** the language changes, **Then** the layout adjusts to RTL (right-to-left) orientation
3. **Given** a visitor switches to English, **When** the language changes, **Then** the layout adjusts to LTR (left-to-right) orientation
4. **Given** a visitor selects a language, **When** they navigate to another page, **Then** their language selection persists and the new page displays in that language
5. **Given** a visitor returns to the site later, **When** they visit again, **Then** their previous language selection is remembered and applied

---

### User Story 7 - Admin Content Management (Priority: P2)

An administrator accesses a secure admin area to manage all content types (victims, news, statements, media) with full bilingual editing capabilities.

**Why this priority**: Content management is essential for maintaining and updating the memorial. Admins must be able to add, edit, and delete all content types safely and efficiently, with changes reflecting immediately on public pages.

**Independent Test**: Can be fully tested by logging into the admin area, creating/editing/deleting each content type (victims, news, statements, media), uploading files, assigning metadata, and verifying changes appear immediately on public pages. Delivers value by enabling ongoing documentation and memorial maintenance.

**Acceptance Scenarios**:

1. **Given** an administrator accesses the admin area, **When** they log in, **Then** they gain access to content management functions
2. **Given** an administrator manages victims, **When** they add, edit, or delete a victim entry, **Then** they can upload/replace/delete photos, enter all required information (name, age, gender, city, date of death, notes), and changes reflect immediately on the public victims page
3. **Given** an administrator manages news items, **When** they create or edit a news item, **Then** they can enter title, slug, publication date, country, city/cities, rich text content in both languages, set excerpt separator, and add optional image/video/audio
4. **Given** an administrator manages official statements, **When** they create or edit a statement, **Then** they can enter content in both languages, add images, set publication date, and statements appear on the statements page
5. **Given** an administrator manages media, **When** they upload photos or videos, **Then** they can assign country, city, district/neighborhood, event date, description in both languages, and media appears in the media gallery
6. **Given** an administrator makes any content change, **When** they save, **Then** the change reflects immediately on the corresponding public page
7. **Given** an administrator edits bilingual content, **When** they enter text, **Then** they can write content separately for Persian and English versions

---

### Edge Cases

- What happens when a news item has no excerpt separator? (System should use first paragraph or first N characters as default excerpt)
- What happens when victim statistics are zero or unavailable? (Display "0" or "Data being updated" message respectfully)
- What happens when a media item has no location data? (Display "Location unknown" or allow filtering to show items without location)
- What happens when an admin uploads a file that exceeds size limits? (Show clear error message with maximum size requirements)
- What happens when content exists in only one language? (Display available language with indicator that translation is pending)
- What happens when date/timezone conflicts occur for event dates? (Use consistent timezone handling, document timezone in metadata)
- What happens when multiple cities are associated with a single news item? (Display all cities, allow filtering by any associated city)
- How does the system handle rapid language switching? (Ensure smooth transitions without content flickering or layout shifts)
- What happens when admin session expires during content editing? (Save draft automatically, prompt for re-authentication before final save)

## Requirements *(mandatory)*

### Functional Requirements

#### Global Requirements

- **FR-001**: System MUST display all content in both Persian (RTL) and English (LTR) languages
- **FR-002**: System MUST provide a persistent language switcher accessible on all pages
- **FR-003**: System MUST remember user's language selection across sessions
- **FR-004**: System MUST display the current date in the header, auto-updated
- **FR-005**: System MUST use the provided Imperial Iranian flag asset as site logo and loading screen symbol
- **FR-006**: System MUST maintain a respectful, factual, documentary tone throughout
- **FR-007**: System MUST exclude graphic violence from all displayed content
- **FR-008**: System MUST exclude sensationalism from content presentation
- **FR-009**: System MUST exclude Islamic Republic symbols from the site
- **FR-010**: System MUST use smooth, subtle animations throughout
- **FR-011**: System MUST provide high readability and accessibility
- **FR-012**: System MUST display a minimal, respectful footer with memorial tone

#### Homepage Requirements

- **FR-013**: System MUST display Section 1 (Iranian Revolution) with text explanation, image of new leader, and short factual introduction in historical, hopeful tone
- **FR-014**: System MUST display Section 2 (Islamic Republic & Dictatorship) with explanation of dictatorship, text and images showing oppression, and explanation of revolution origins
- **FR-015**: System MUST display Section 3 (Victim Statistics) with total killed, breakdown by gender (women, men, children), updating dynamically as data changes
- **FR-016**: System MUST present victim statistics in a respectful, non-gamified manner
- **FR-017**: System MUST display Section 4 (News & Official Statements) with first news item prominently (large image, title over image, short excerpt)
- **FR-018**: System MUST display remaining news items with title, small thumbnail, date, country and city, and link to full news page

#### News System Requirements

- **FR-019**: System MUST support news items with title, slug, publication date, country, city or cities, rich text content (FA/EN), manual excerpt separator, optional image, optional video, optional audio
- **FR-020**: System MUST display only content before the excerpt separator in news previews
- **FR-021**: System MUST display full content on news detail pages
- **FR-022**: System MUST display news detail pages with full title, date, country and city, media (image/video/audio), and full text content in long-form readable layout
- **FR-023**: System MUST support multiple cities per news item

#### Statements Page Requirements

- **FR-024**: System MUST provide a dedicated statements page listing official statements
- **FR-025**: System MUST display the most recent statement first with image and visual highlighting
- **FR-026**: System MUST display remaining statements as titles with dates, clickable to full statement pages

#### Victims Page Requirements

- **FR-027**: System MUST display a full list of victims with each entry showing photo, full name, age, gender, city, date of death, and optional notes
- **FR-028**: System MUST provide filtering options for victim list with the following filterable fields: city (exact match), gender (exact match: male/female/child/unknown), age range (min/max), and date of death range (from/to). Filters MUST be combinable and results MUST update within 1 second for lists up to 10,000 entries (per SC-004).
- **FR-029**: System MUST provide sorting options for victim list with sortable fields: date of death, creation date, and name (alphabetical). Each field MUST support ascending and descending order. Sorting MUST be applied immediately when selected.
- **FR-030**: System MUST maintain respectful layout for victim entries

#### Media Page Requirements

- **FR-031**: System MUST provide a dedicated media page for photos and videos
- **FR-032**: System MUST display each media item with media type (photo/video), country, city, district/neighborhood (if available), event date, and description (FA/EN)
- **FR-033**: System MUST display media in a responsive grid layout
- **FR-034**: System MUST provide filtering by country (exact match), city (exact match), media type (photo or video), and event date range (from/to). Filters MUST be combinable and results MUST display within 2 seconds for galleries up to 5,000 items (per SC-005). Items without location data MUST be filterable separately (per edge case handling).
- **FR-035**: System MUST provide sorting by event date, creation date, or location (country then city). Each field MUST support ascending and descending order. Sorting MUST be applied immediately when selected.
- **FR-036**: System MUST open media items in full-screen modal when clicked
- **FR-037**: System MUST use smooth, respectful animations for media interactions
- **FR-038**: System MUST focus on strong filtering and usability for media browsing

#### Admin Requirements

- **FR-039**: System MUST provide a secure admin area for content management
- **FR-040**: System MUST allow admins to add, edit, and delete victims
- **FR-041**: System MUST allow admins to upload, replace, and delete victim photos
- **FR-042**: System MUST allow admins to manage news items (create, edit, delete)
- **FR-043**: System MUST allow admins to manage official statements (create, edit, delete)
- **FR-044**: System MUST allow admins to manage media items (photos and videos)
- **FR-045**: System MUST allow admins to assign country and city metadata to content
- **FR-046**: System MUST allow admins to write all content bilingually (separate Persian and English versions)
- **FR-047**: System MUST reflect admin changes on public pages within 10 seconds of saving (per SC-011). This includes cache invalidation and content revalidation to ensure users see updated content promptly.
- **FR-048**: System MUST persist admin changes safely

#### Ethical Constraints

- **FR-049**: System MUST exclude graphic imagery from all displays
- **FR-050**: System MUST exclude sensational framing from content presentation
- **FR-051**: System MUST respect privacy and dignity in all content
- **FR-052**: System MUST focus on human-centered documentation only

#### Error Handling Requirements

- **FR-053**: System MUST handle network errors gracefully by displaying user-friendly error messages in the selected language (Persian or English) without exposing technical details
- **FR-054**: System MUST validate all user inputs (forms, file uploads, data entry) and display clear, actionable error messages indicating what needs to be corrected
- **FR-055**: System MUST handle file upload errors (size limits, invalid file types, upload failures) with specific error messages indicating maximum file size, allowed file types, and retry options
- **FR-056**: System MUST handle database errors (connection failures, query errors) by logging errors server-side and displaying generic user-friendly messages to users
- **FR-057**: System MUST handle missing content scenarios (missing translations, missing images, missing media files) by displaying fallback content or appropriate "content unavailable" indicators
- **FR-058**: System MUST handle authentication/authorization errors by redirecting unauthorized users appropriately and displaying clear access denial messages

#### Loading State Requirements

- **FR-059**: System MUST display loading indicators for all asynchronous operations including: data fetching (homepage sections, lists, detail pages), file uploads (photos, media), and page navigation transitions
- **FR-060**: System MUST display loading states that are appropriate to the operation duration: brief operations (<1s) may use subtle indicators, longer operations (>1s) MUST show progress or estimated time
- **FR-061**: System MUST prevent user interaction with loading content (disable buttons, prevent navigation) during critical operations to avoid duplicate submissions or data corruption
- **FR-062**: System MUST handle timeout scenarios for long-running operations (file uploads, large data fetches) by displaying timeout messages and retry options
- **FR-063**: System MUST maintain responsive UI during loading states (no blocking, allow cancellation where appropriate)

### Key Entities

- **Victim**: Represents a documented individual who lost their life. Attributes include: photo, full name, age, gender, city, date of death, optional notes. Relationships: none (standalone memorial entries).

- **News Item**: Represents a documented event or news article. Attributes include: title, slug (URL-friendly identifier), publication date, country, one or more cities, rich text content (separate Persian and English versions), manual excerpt separator position, optional image, optional video, optional audio. Relationships: can reference multiple cities, can have associated media files.

- **Official Statement**: Represents an official declaration or position statement. Attributes include: title, publication date, rich text content (separate Persian and English versions), optional image. Relationships: none (standalone documents).

- **Media Item**: Represents a photo or video documenting events. Attributes include: media type (photo or video), country, city, district/neighborhood (optional), event date, description (separate Persian and English versions), media file. Relationships: can reference location (country, city, district).

- **Admin User**: Represents an authorized content manager. Attributes include: authentication credentials, permissions. Relationships: can create/edit/delete all content types (victims, news, statements, media).

- **Language Preference**: Represents user's selected language. Attributes include: language code (Persian/English), persistence method. Relationships: applies to all content displays.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view the complete homepage with all four sections in under 3 seconds on standard broadband connection
- **SC-002**: Users can switch between Persian and English languages in under 1 second with all content updating immediately
- **SC-003**: Users can navigate from homepage to any news article detail page in under 2 seconds
- **SC-004**: Users can filter the victims list and see results update in under 1 second for lists up to 10,000 entries
- **SC-005**: Users can filter media gallery by location, type, and date range with results displaying in under 2 seconds for galleries up to 5,000 items
- **SC-006**: Victim statistics update dynamically and display current totals within 5 seconds of data changes
- **SC-007**: Administrators can create a new victim entry with photo upload in under 2 minutes
- **SC-008**: Administrators can create a bilingual news item with media in under 5 minutes
- **SC-009**: All content displays correctly in both RTL (Persian) and LTR (English) layouts without text overflow or layout breaks
- **SC-010**: Language selection persists across 100% of page navigations within a session
- **SC-011**: Admin content changes appear on public pages within 10 seconds of saving
- **SC-012**: Site maintains respectful, documentary tone as verified by content review (no graphic violence, no sensationalism, dignified presentation)
- **SC-013**: All text content is accessible and readable with minimum contrast ratios meeting accessibility standards
- **SC-014**: Media items open in full-screen modal with smooth animations completing in under 500ms
- **SC-015**: News article previews correctly truncate at excerpt separator 100% of the time

## Assumptions

- The Imperial Iranian flag asset is provided and available for use as logo and loading screen
- Content will be provided in both Persian and English by content creators/admins
- Victim data, news content, statements, and media will be provided through the admin interface
- Standard web accessibility guidelines (WCAG 2.1 Level AA) apply for readability and accessibility requirements
- Date/timezone handling will use a consistent timezone (assumed UTC or site-specific timezone) for all event dates
- File upload limits for photos and videos will follow standard web hosting constraints (assumed 10-50MB per file, to be confirmed during implementation)
- Admin authentication will use standard secure authentication methods (specific method to be determined during implementation)
- The "new leader of Iran" image and information for Section 1 will be provided by content administrators
- Media content received from inside Iran will be pre-screened by administrators to ensure compliance with ethical constraints (no graphic violence)
- The site will operate under standard web hosting conditions with typical bandwidth and storage capabilities
