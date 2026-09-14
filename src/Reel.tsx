import React from 'react';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadForum} from '@remotion/google-fonts/Forum';
import {Video} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {accents, editPlan} from './edit-plan';
import {captions} from './captions';

const {fontFamily: cormorant} = loadCormorant('normal', {
  weights: ['500', '600', '700'],
  subsets: ['cyrillic'],
});
const {fontFamily: forum} = loadForum('normal', {subsets: ['cyrillic']});

const COLORS = {
  olive: '#707554',
  terracotta: '#B6654A',
  ivory: '#F3EBDD',
  shadow: 'rgba(27, 24, 20, 0.72)',
};

const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const caption = captions.find((item) => ms >= item.startMs && ms < item.endMs);
  if (!caption) return null;

  const local = frame - Math.round((caption.startMs / 1000) * fps);
  return (
    <div
      style={{
        position: 'absolute',
        left: 92,
        right: 156,
        bottom: 330,
        display: 'flex',
        justifyContent: 'center',
        opacity: interpolate(local, [0, 6], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: `0 ${interpolate(local, [0, 8], [14, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}px`,
      }}
    >
      <div
        style={{
          maxWidth: 790,
          padding: '12px 22px 15px',
          color: COLORS.ivory,
          background: 'rgba(30, 27, 22, 0.38)',
          borderRadius: 16,
          fontFamily: cormorant,
          fontWeight: 600,
          fontSize: 62,
          lineHeight: 1.03,
          letterSpacing: 0.2,
          textAlign: 'center',
          textShadow: `0 3px 18px ${COLORS.shadow}`,
          backdropFilter: 'blur(5px)',
        }}
      >
        {caption.text.trim()}
      </div>
    </div>
  );
};

const AccentLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const accent = accents.find((item) => seconds >= item.start && seconds < item.end);
  if (!accent) return null;
  const local = frame - Math.round(accent.start * fps);

  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 170,
        top: 250,
        color: COLORS[accent.tone],
        fontFamily: forum,
        fontSize: 82,
        lineHeight: 0.98,
        textAlign: 'left',
        opacity: interpolate(local, [0, 9], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: `${interpolate(local, [0, 11], [-16, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}px 0`,
        textShadow: `0 2px 24px ${COLORS.shadow}`,
      }}
    >
      {accent.text}
    </div>
  );
};

export const Reel: React.FC = () => {
  const {fps} = useVideoConfig();
  let cursor = 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#171511'}}>
      {editPlan.map((segment, index) => {
        const duration = Math.round((segment.to - segment.from) * fps);
        const start = cursor;
        cursor += duration;

        return (
          <Sequence key={index} from={start} durationInFrames={duration}>
            <Video
              src={staticFile('source.mov')}
              trimBefore={Math.round(segment.from * fps)}
              durationInFrames={duration}
              volume={1}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                scale: segment.scale ?? 1.03,
                translate: `${segment.x ?? 0}px ${segment.y ?? 0}px`,
                filter: 'contrast(1.035) saturate(0.96) brightness(1.015)',
              }}
            />
          </Sequence>
        );
      })}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(20,16,12,.10) 0%, transparent 38%, rgba(20,16,12,.22) 100%)',
        }}
      />
      <AccentLayer />
      <CaptionLayer />
    </AbsoluteFill>
  );
};
