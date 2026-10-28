#!/usr/bin/env bash
# Test 1: Kolurin + Kuwolskii, human-sized, on a real street (cartoon over video).
cd "$(dirname "$0")/../../.."
tools/layer.sh plates/test1/plate.mp4 plates/test1/chars-green.mp4 episodes/tests/test1/test1.mp4
