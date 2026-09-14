import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {editPlan} from './edit-plan';

const fps = 30;
const durationInFrames = Math.max(
  1,
  Math.round(editPlan.reduce((sum, segment) => sum + (segment.to - segment.from), 0) * fps),
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Reels"
    component={Reel}
    durationInFrames={durationInFrames}
    fps={fps}
    width={1080}
    height={1920}
  />
);
