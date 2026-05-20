"""
clipforge — Fast Pythonic FFmpeg wrapper.
"""

__version__ = "0.4.2"
__all__ = ["encode", "decode", "probe", "pipeline"]

from clipforge._binding import encode as _encode, decode as _decode, probe as _probe
from clipforge.utils import VideoInfo, FrameIterator, pipeline


def probe(path: str) -> "VideoInfo":
    """
    Probe a video file and return stream metadata.

    Args:
        path: Path to the video file.

    Returns:
        VideoInfo object with duration, codec, resolution, fps, etc.
    """
    raw = _probe(path)
    return VideoInfo(raw)


def encode(input: str, output: str, codec: str = "h264", crf: int = 23) -> None:
    """
    Transcode a video file.

    Args:
        input:  Path to input file.
        output: Path to output file.
        codec:  Target codec. One of: h264, h265, av1.
        crf:    Constant Rate Factor (quality). Lower = better. Default 23.
    """
    _encode(input, output, codec)


def decode(path: str, fps: float = None) -> "FrameIterator":
    """
    Decode frames from a video file.

    Args:
        path: Path to the video file.
        fps:  Extract at this frame rate. None = every frame.

    Returns:
        FrameIterator yielding Frame objects with .index, .pts, .save().
    """
    raw_frames = _decode(path, fps or 0.0)
    return FrameIterator(raw_frames)
