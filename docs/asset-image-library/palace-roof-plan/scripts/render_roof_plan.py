"""Compatibility entrypoint for the current plain engineering plan."""
from pathlib import Path
import runpy
if __name__ == "__main__":
    runpy.run_path(str(Path(__file__).with_name("render_plain_roof_plan.py")), run_name="__main__")
