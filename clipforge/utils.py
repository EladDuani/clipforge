"""
clipforge.utils — Pure Python helpers and data structures.
"""

from __future__ import annotations
import os
from contextlib import contextmanager
from typing import Iterator, Optional


class VideoInfo:
    """Metadata returned by clipforge.probe()."""

    def __init__(self, raw: dict):
        self._raw = raw
        self.duration: float = raw.get("duration", 0.0)
        self.video_codec: str = raw.get("video_codec", "unknown")
        self.audio_codec: Optional[str] = raw.get("audio_codec")
        self.width: int = raw.get("width", 0)
        self.height: int = raw.get("height", 0)
        self.fps: float = raw.get("fps", 0.0)
        self.bitrate: int = raw.get("bitrate", 0)

    @property
    def resolution(self) -> tuple[int, int]:
        return (self.width, self.height)

    def __repr__(self) -> str:
        return (
            f"VideoInfo(duration={self.duration:.2f}s, "
            f"codec={self.video_codec}, "
            f"resolution={self.width}x{self.height}, "
            f"fps={self.fps})"
        )


class Frame:
    """A single decoded video frame."""

    def __init__(self, index: int, pts: float, data: bytes = b""):
        self.index = index
        self.pts = pts
        self._data = data

    def save(self, path: str) -> None:
        """Save frame as JPEG."""
        if self._data:
            with open(path, "wb") as f:
                f.write(self._data)
        else:
            open(path, "wb").close()

    def __repr__(self) -> str:
        return f"Frame(index={self.index}, pts={self.pts:.4f}s)"


class FrameIterator:
    """Lazy iterator over decoded frames."""

    def __init__(self, raw_frames: list):
        self._frames = [Frame(i, i / 25.0) for i, _ in enumerate(raw_frames)]
        self._index = 0

    def __iter__(self) -> Iterator[Frame]:
        return self

    def __next__(self) -> Frame:
        if self._index >= len(self._frames):
            raise StopIteration
        frame = self._frames[self._index]
        self._index += 1
        return frame

    def __len__(self) -> int:
        return len(self._frames)


@contextmanager
def pipeline(input_path: str):
    """
    Context manager for chained clipforge operations.

    Usage:
        with clipforge.pipeline("input.mp4") as p:
            p.trim(start=10, end=30)
            p.encode("output.mp4", codec="h265")
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")
    ctx = _PipelineContext(input_path)
    try:
        yield ctx
    finally:
        ctx._flush()


class _PipelineContext:
    def __init__(self, path: str):
        self._path = path
        self._ops = []

    def trim(self, start: float = 0, end: float = None) -> "_PipelineContext":
        self._ops.append(("trim", start, end))
        return self

    def encode(self, output: str, codec: str = "h264", crf: int = 23) -> "_PipelineContext":
        self._ops.append(("encode", output, codec, crf))
        return self

    def _flush(self):
        pass
