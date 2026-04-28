import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent
} from "react";
import {
  ArrowLeft,
  CalendarDays,
  Heart,
  Images,
  MapPin,
  Sparkles
} from "lucide-react";
import { trips, type Trip } from "./data/trips";

const routeFromHash = () => window.location.hash.replace(/^#/, "") || "/";
const TRANSITION_DURATION_MS = 980;
const introBackgrounds = [
  "/photos/intro-bg/beihai-01.jpg",
  "/photos/intro-bg/beihai-02.jpg",
  "/photos/intro-bg/beihai-03.jpg"
];
const DEFAULT_INTRO_ACTIVE = "cutout";
const DIAGONAL_GALLERY_PHOTOS = {
  bottomLeft: "https://ink-app-cards.oss-ap-southeast-1.aliyuncs.com/img/北海/IMG20231005065015.jpg",
  topRight: "https://ink-app-cards.oss-ap-southeast-1.aliyuncs.com/img/北海/DSC_6402.JPG"
};
const diagonalGalleryPhotoSet = new Set(Object.values(DIAGONAL_GALLERY_PHOTOS));

type TripTransition = {
  src: string;
  x: number;
  y: number;
};

function useHashRoute() {
  const [route, setRoute] = useState(routeFromHash);

  useEffect(() => {
    const handleHashChange = () => setRoute(routeFromHash());

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route;
}

function AppHeader() {
  return (
    <header className="app-header">
      <a className="brand" href="#/" aria-label="返回我们的故事首页">
        <span className="brand-mark">
          <Heart size={18} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span>我们的故事</span>
      </a>
      <nav aria-label="页面导航">
        <a href="#timeline">时光轴</a>
      </nav>
    </header>
  );
}

function PhotoFrame({
  src,
  alt,
  className = "",
  priority = false,
  onSelect
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onSelect?: () => void;
}) {
  const [hasError, setHasError] = useState(false);
  const isInteractive = Boolean(onSelect);
  const isVideo = /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(src);
  const handleKeyDown = (event: KeyboardEvent<HTMLImageElement | HTMLVideoElement | HTMLDivElement>) => {
    if (!onSelect || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    onSelect();
  };

  if (!src || hasError) {
    return (
      <div
        className={`photo-frame photo-fallback ${className}`}
        role={isInteractive ? "button" : "img"}
        aria-label={alt}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
      >
        <Sparkles size={22} aria-hidden="true" />
      </div>
    );
  }

  if (isVideo) {
    return (
      <div
        className={`photo-frame video-frame ${className}`}
        aria-label={alt}
        role={isInteractive ? "button" : "img"}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
      >
        <video
          className="video-frame-media"
          src={src}
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload={priority ? "auto" : "metadata"}
          disablePictureInPicture
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <img
      className={`photo-frame ${className}`}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => setHasError(true)}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    />
  );
}

function CoupleCutout({
  isActive,
  isScrollEmphasized,
  onSelect
}: {
  isActive: boolean;
  isScrollEmphasized: boolean;
  onSelect: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <img
      className={`couple-cutout ${isActive ? "is-intro-active" : ""} ${
        isScrollEmphasized ? "is-scroll-emphasis" : ""
      }`}
      src="/photos/couple-cutout.png"
      alt="我们一起旅行的合照"
      loading="eager"
      draggable={false}
      onClick={onSelect}
      onError={() => setHasError(true)}
    />
  );
}

function TripMeta({ trip }: { trip: Trip }) {
  return (
    <div className="trip-meta">
      <span>
        <MapPin size={16} aria-hidden="true" />
        {trip.location}
      </span>
      <span>
        <CalendarDays size={16} aria-hidden="true" />
        {trip.date}
      </span>
    </div>
  );
}

function HomePage({
  onTripNavigate
}: {
  onTripNavigate: (event: MouseEvent<HTMLAnchorElement>, trip: Trip) => void;
}) {
  const featuredTrip = trips[0];
  const [activeIntroElement, setActiveIntroElement] = useState(DEFAULT_INTRO_ACTIVE);
  const [isCutoutScrollEmphasized, setIsCutoutScrollEmphasized] = useState(false);
  const lastScrollY = useRef(0);
  const scrollEmphasisTimer = useRef<number | undefined>(undefined);
  const selectIntroElement = (element: string) => {
    setActiveIntroElement((current) => (current === element ? current : element));
  };

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    lastScrollY.current = window.scrollY;

    const clearScrollEmphasis = () => {
      if (scrollEmphasisTimer.current) {
        window.clearTimeout(scrollEmphasisTimer.current);
      }

      scrollEmphasisTimer.current = window.setTimeout(() => {
        setIsCutoutScrollEmphasized(false);
      }, 620);
    };

    const handleScroll = () => {
      if (!mobileQuery.matches) {
        setIsCutoutScrollEmphasized(false);
        lastScrollY.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current + 5;

      if (isScrollingDown) {
        setActiveIntroElement("cutout");
        setIsCutoutScrollEmphasized(true);
        clearScrollEmphasis();
      } else if (currentScrollY < lastScrollY.current - 5) {
        setIsCutoutScrollEmphasized(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollEmphasisTimer.current) {
        window.clearTimeout(scrollEmphasisTimer.current);
      }
    };
  }, []);

  return (
    <main>
      <section className="intro-section" aria-labelledby="intro-title">
        <div className="intro-copy">
          <p className="eyebrow">Every place with you</p>
          <h1 id="intro-title">把一起走过的地方，慢慢收藏起来。</h1>
          <p className="intro-text">
            旅行、照片、一些只有我们懂的小瞬间，都沿着时间的顺序发着光。
          </p>
          <div className="intro-actions">
            <a className="primary-link" href="#timeline">
              <CalendarDays size={18} aria-hidden="true" />
              看时光轴
            </a>
            <a className="secondary-link" href={`#/trip/${featuredTrip.slug}`}>
              <Images size={18} aria-hidden="true" />
              最新记忆
            </a>
          </div>
        </div>
        <div className="depth-scene" aria-label="我们的旅行合照和照片预览">
          <button
            className={`intro-background-wall ${
              activeIntroElement === "background" ? "is-intro-active" : ""
            }`}
            type="button"
            aria-label="突出北海背景照片"
            onClick={() => selectIntroElement("background")}
          >
            {introBackgrounds.map((photo, index) => (
              <PhotoFrame
                key={photo}
                src={photo}
                alt={`北海背景照片 ${index + 1}`}
                className={`intro-bg-photo intro-bg-photo-${index + 1}`}
              />
            ))}
          </button>
          <CoupleCutout
            isActive={activeIntroElement === "cutout"}
            isScrollEmphasized={isCutoutScrollEmphasized}
            onSelect={() => selectIntroElement("cutout")}
          />
        </div>
      </section>

      <section className="timeline-section" id="timeline" aria-labelledby="timeline-title">
        <div className="section-heading">
          <p className="eyebrow">Timeline</p>
          <h2 id="timeline-title">我们的旅行时光轴</h2>
        </div>
        <div className="timeline">
          {trips.map((trip, index) => (
            <a
              className={`timeline-item ${index % 2 === 0 ? "timeline-left" : "timeline-right"}`}
              href={`#/trip/${trip.slug}`}
              key={trip.slug}
              onClick={(event) => onTripNavigate(event, trip)}
            >
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-card">
                <div className="timeline-visual" aria-hidden="true">
                  <PhotoFrame src={trip.timelineImage ?? trip.transitionImage ?? trip.cover} alt="" className="timeline-echo" />
                  <PhotoFrame src={trip.timelineImage ?? trip.transitionImage ?? trip.cover} alt="" className="timeline-subject" />
                </div>
                <div className="timeline-copy">
                  <span className="timeline-count">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{trip.title}</h3>
                  <TripMeta trip={trip} />
                  <p>{trip.summary}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

    </main>
  );
}

function TripPage({ trip }: { trip: Trip }) {
  const galleryPhotos = trip.photos.map((photo, index) => ({ photo, index }));
  const bottomLeftIndex = trip.photos.indexOf(DIAGONAL_GALLERY_PHOTOS.bottomLeft);
  const topRightIndex = trip.photos.indexOf(DIAGONAL_GALLERY_PHOTOS.topRight);
  const hasDiagonalGalleryPair = bottomLeftIndex >= 0 && topRightIndex >= 0;
  const diagonalInsertIndex = hasDiagonalGalleryPair
    ? Math.min(bottomLeftIndex, topRightIndex)
    : Number.POSITIVE_INFINITY;
  const beforeDiagonalPhotos = hasDiagonalGalleryPair
    ? galleryPhotos.filter(
        ({ photo, index }) => index < diagonalInsertIndex && !diagonalGalleryPhotoSet.has(photo)
      )
    : galleryPhotos;
  const afterDiagonalPhotos = hasDiagonalGalleryPair
    ? galleryPhotos.filter(
        ({ photo, index }) => index >= diagonalInsertIndex && !diagonalGalleryPhotoSet.has(photo)
      )
    : [];
  const renderGalleryGrid = (photos: typeof galleryPhotos) => {
    if (photos.length === 0) {
      return null;
    }

    return (
      <div className="masonry-grid">
        {photos.map(({ photo, index }) => {
          const photoClassName = [
            index % 3 === 0 ? "tall-photo" : "",
            photo.includes("DSC_6902.JPG") ? "portrait-photo" : ""
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <PhotoFrame
              key={photo}
              src={photo}
              alt={`${trip.title}照片 ${index + 1}`}
              className={photoClassName}
            />
          );
        })}
      </div>
    );
  };

  return (
    <main>
      <section className="trip-hero" aria-labelledby="trip-title">
        <PhotoFrame src={trip.heroImage ?? trip.cover} alt={`${trip.title}封面`} className="trip-hero-image" priority />
        <div className="trip-hero-copy">
          <a className="back-link" href="#/">
            <ArrowLeft size={18} aria-hidden="true" />
            返回时光轴
          </a>
          <p className="eyebrow">{trip.location}</p>
          <h1 id="trip-title">{trip.title}</h1>
          <TripMeta trip={trip} />
          <p>{trip.summary}</p>
        </div>
      </section>

      <section className="story-section" aria-labelledby="story-title">
        <div className="story-copy">
          <p className="eyebrow">Story</p>
          <h2 id="story-title">这一天的记忆</h2>
          <p>{trip.story}</p>
        </div>
        <div className="memory-note">
          <Heart size={20} aria-hidden="true" />
          <p>后来去过很多地方，还是会记得那天和你一起走过的路。</p>
        </div>
      </section>

      <section className="trip-gallery-section" aria-labelledby="trip-gallery-title">
        <div className="section-heading">
          <p className="eyebrow">Photos</p>
          <h2 id="trip-gallery-title">这一站的照片</h2>
        </div>
        {renderGalleryGrid(beforeDiagonalPhotos)}
        {hasDiagonalGalleryPair ? (
          <div className="diagonal-photo-pair" aria-label={`${trip.title}斜对角照片`}>
            <PhotoFrame
              src={DIAGONAL_GALLERY_PHOTOS.topRight}
              alt={`${trip.title}照片 ${topRightIndex + 1}`}
              className="diagonal-photo diagonal-photo-top-right"
            />
            <PhotoFrame
              src={DIAGONAL_GALLERY_PHOTOS.bottomLeft}
              alt={`${trip.title}照片 ${bottomLeftIndex + 1}`}
              className="diagonal-photo diagonal-photo-bottom-left"
            />
          </div>
        ) : null}
        {renderGalleryGrid(afterDiagonalPhotos)}
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="eyebrow">Not found</p>
      <h1>这一页还没有写进故事里。</h1>
      <a className="primary-link" href="#/">
        <ArrowLeft size={18} aria-hidden="true" />
        返回首页
      </a>
    </main>
  );
}

function TransitionOverlay({ transition }: { transition?: TripTransition }) {
  if (!transition) {
    return null;
  }

  const transitionStyle = {
    "--transition-x": `${transition.x}px`,
    "--transition-y": `${transition.y}px`
  } as CSSProperties;

  return (
    <div className="trip-transition-overlay" aria-hidden="true" style={transitionStyle}>
      <img src={transition.src} alt="" style={transitionStyle} />
    </div>
  );
}

export function App() {
  const route = useHashRoute();
  const transitionTimer = useRef<number | undefined>(undefined);
  const [transition, setTransition] = useState<TripTransition | undefined>();

  useEffect(() => {
    return () => {
      if (transitionTimer.current) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  const handleTripNavigate = (event: MouseEvent<HTMLAnchorElement>, trip: Trip) => {
    if (
      !trip.transitionImage ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current);
    }

    const visual = event.currentTarget.querySelector(".timeline-visual");
    const rect = visual?.getBoundingClientRect() ?? event.currentTarget.getBoundingClientRect();

    setTransition({
      src: trip.transitionImage,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });

    transitionTimer.current = window.setTimeout(() => {
      window.location.hash = `/trip/${trip.slug}`;
      setTransition(undefined);
    }, TRANSITION_DURATION_MS);
  };

  const selectedTrip = useMemo(() => {
    const match = route.match(/^\/trip\/([^/]+)$/);
    if (!match) {
      return undefined;
    }

    return trips.find((trip) => trip.slug === match[1]);
  }, [route]);

  const isTripRoute = route.startsWith("/trip/");

  return (
    <div className="app-shell">
      <AppHeader />
      {isTripRoute ? (
        selectedTrip ? (
          <TripPage trip={selectedTrip} />
        ) : (
          <NotFoundPage />
        )
      ) : (
        <HomePage onTripNavigate={handleTripNavigate} />
      )}
      <TransitionOverlay transition={transition} />
    </div>
  );
}
