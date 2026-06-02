"""Smoke test so CI/pre-commit have something green to run from day 1."""

import tally


def test_version() -> None:
    assert tally.__version__ == "0.0.1"
