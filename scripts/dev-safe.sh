#!/usr/bin/env bash
# Chạy `next dev` có "cầu chì": theo dõi RAM và số tiến trình Node, tự tắt dev
# server TRƯỚC khi máy hết RAM, và ghi lại tiến trình nào đang sinh ra hàng loạt
# để tìm nguyên nhân treo máy.
#
#   pnpm dev:safe            # mặc định: dừng khi RAM trống < 2000 MB hoặc > 120 tiến trình Node
#   MIN_AVAIL_MB=3000 MAX_NODE=80 pnpm dev:safe
#
# Log chẩn đoán: /tmp/zerotech-dev-diag.log (gửi file này khi bị dừng).
set -u

MIN_AVAIL_MB="${MIN_AVAIL_MB:-2000}"
MAX_NODE="${MAX_NODE:-120}"
DIAG=/tmp/zerotech-dev-diag.log
DEV_LOG=/tmp/zerotech-dev.log

cd "$(dirname "$0")/.." || exit 1

node_count() { ps -eo comm= | grep -cE '^(MainThread|node|next-server)$'; }
avail_mb() { awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo; }

snapshot() {
  {
    echo "===== $(date '+%T') — $1 — node=$(node_count) avail=$(avail_mb)MB"
    echo "--- Tiến trình Node theo tiến trình cha (số lượng × cha):"
    ps -eo ppid=,comm= | awk '$2=="MainThread"||$2=="node"||$2=="next-server"{print $1}' |
      sort | uniq -c | sort -rn | head -10 |
      while read -r n ppid; do echo "$n × cha $ppid: $(ps -o args= -p "$ppid" 2>/dev/null | cut -c1-160)"; done
    echo "--- 25 tiến trình Node mới nhất:"
    ps -eo pid,ppid,etimes,rss,args --sort=etimes |
      grep -E '/node|node |next' | grep -v grep | head -25 | cut -c1-220
  } >>"$DIAG"
}

: >"$DIAG"
BASE=$(node_count)
echo "Bắt đầu: node=$BASE avail=$(avail_mb)MB. Giới hạn: avail<${MIN_AVAIL_MB}MB hoặc node>${MAX_NODE}."
echo "Dev log: $DEV_LOG — Chẩn đoán: $DIAG"
snapshot "trước khi chạy"

# Chạy trong process group riêng để tắt được toàn bộ cây tiến trình.
setsid pnpm dev:lite >"$DEV_LOG" 2>&1 &
DEV_PID=$!

stop_dev() {
  kill -TERM -- "-$DEV_PID" 2>/dev/null
  sleep 2
  kill -KILL -- "-$DEV_PID" 2>/dev/null
}
trap 'echo; echo "Dừng dev server..."; stop_dev; exit 0' INT TERM

LAST=$BASE
while kill -0 "$DEV_PID" 2>/dev/null; do
  sleep 2
  N=$(node_count)
  A=$(avail_mb)
  printf '\rnode=%-4s avail=%-6sMB ' "$N" "$A"
  if [ "$N" -ge $((LAST + 20)) ]; then
    snapshot "số tiến trình Node tăng nhanh"
    LAST=$N
  fi
  if [ "$A" -lt "$MIN_AVAIL_MB" ] || [ "$N" -gt "$MAX_NODE" ]; then
    echo
    echo "⚠ Vượt ngưỡng an toàn (node=$N, avail=${A}MB) — tắt dev server."
    snapshot "VƯỢT NGƯỠNG — tắt dev server"
    stop_dev
    echo "Đã tắt. Gửi file $DIAG để tìm nguyên nhân."
    exit 1
  fi
done

echo
echo "Dev server đã thoát. Xem $DEV_LOG"
