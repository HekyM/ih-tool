from pathlib import Path
from PIL import Image


def convert_to_webp(source: Path):
    """Convert image to webp.

    Args:
        source (pathlib.Path): Path to source image

    Returns:
        pathlib.Path: path to new image
    """
    destination = Path('public/assets') / source.with_suffix(".webp")

    if destination.exists() and destination.stat().st_mtime > source.stat().st_mtime:
        return destination

    image = Image.open(source)  # Open image
    image.save(destination, format="webp")  # Convert image to webp

    print(destination)
    return destination


def main():
    paths = Path("images").glob("**/*.png")
    for path in paths:
        convert_to_webp(path)


if __name__ == "__main__":
    main()
