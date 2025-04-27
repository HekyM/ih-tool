from pathlib import Path
from PIL import Image


def convert_to_webp(source):
    """Convert image to webp if it doesn't already exist.

    Args:
        source (pathlib.Path): Path to source image

    Returns:
        pathlib.Path: path to new image
    """
    destination = Path('public/assets') / source.with_suffix(".webp")

    if destination.exists():
        print(f"WebP already exists for {source}")
        return destination

    image = Image.open(source)  # Open image
    image.save(destination, format="webp")  # Convert image to webp

    return destination


def main():
    paths = Path("images").glob("**/*.png")
    for path in paths:
        webp_path = convert_to_webp(path)
        print(webp_path)


if __name__ == "__main__":
    main()
