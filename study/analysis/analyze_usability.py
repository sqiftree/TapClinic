#!/usr/bin/env python3
"""
TapClinic HCI Usability Statistical Analysis (Pure Python 3 Stdlib).

Computes descriptive statistics, paired t-tests, Cohen's d_z, and
exact/asymptotic Wilcoxon signed-rank tests comparing Variant A (Text Form)
against Variant B (TapClinic Interactive Body Map).
"""

import argparse
import csv
import math
import statistics
import sys
from pathlib import Path
from typing import Dict, List, Tuple


REQUIRED_COLS = [
    "participant_id",
    "order",
    "time_a_sec",
    "time_b_sec",
    "errors_a",
    "errors_b",
    "sus_a",
    "sus_b",
]


def student_t_cdf_two_tailed(t_abs: float, df: int) -> float:
    """Compute exact two-tailed p-value for Student's t using Simpson integration."""
    if df <= 0:
        return float("nan")
    if t_abs == 0.0:
        return 1.0

    # Log constant for Student's t PDF
    log_c = (
        math.lgamma((df + 1) / 2.0)
        - math.lgamma(df / 2.0)
        - 0.5 * math.log(df * math.pi)
    )
    coeff = math.exp(log_c)

    def pdf(x: float) -> float:
        return coeff * ((1.0 + (x * x) / df) ** (-(df + 1) / 2.0))

    # Integrate from 0 to t_abs using composite Simpson's rule
    steps = 2000
    h = t_abs / steps
    total = pdf(0.0) + pdf(t_abs)
    for k in range(1, steps):
        x = k * h
        total += (4.0 if k % 2 == 1 else 2.0) * pdf(x)
    integral_0_to_t = (h / 3.0) * total
    p_two = max(0.0, min(1.0, 1.0 - 2.0 * integral_0_to_t))
    return p_two


def paired_t_test(a_vals: List[float], b_vals: List[float]) -> Dict[str, float]:
    """Paired t-test on differences d = B - A."""
    n = len(a_vals)
    diffs = [b - a for a, b in zip(a_vals, b_vals)]
    mean_d = statistics.mean(diffs)
    if n < 2:
        return {"mean_diff": mean_d, "sd_diff": 0.0, "t": 0.0, "df": 0, "p": float("nan"), "cohens_dz": 0.0}
    sd_d = statistics.stdev(diffs)
    if sd_d == 0.0:
        t_stat = 0.0 if mean_d == 0.0 else math.copysign(float("inf"), mean_d)
        p_val = 1.0 if mean_d == 0.0 else 0.0
        dz = 0.0
    else:
        se = sd_d / math.sqrt(n)
        t_stat = mean_d / se
        p_val = student_t_cdf_two_tailed(abs(t_stat), n - 1)
        dz = mean_d / sd_d
    return {
        "mean_diff": mean_d,
        "sd_diff": sd_d,
        "t": t_stat,
        "df": n - 1,
        "p": p_val,
        "cohens_dz": dz,
    }


def wilcoxon_signed_rank(a_vals: List[float], b_vals: List[float]) -> Dict[str, float]:
    """Two-tailed Wilcoxon signed-rank test (exact DP for n_nz <= 25)."""
    diffs = [b - a for a, b in zip(a_vals, b_vals) if abs(b - a) > 1e-12]
    n = len(diffs)
    if n == 0:
        return {"n_nonzero": 0, "W_plus": 0.0, "W_minus": 0.0, "W": 0.0, "p": 1.0, "method": "none"}

    # Assign average ranks to |diffs|
    indexed = sorted(enumerate(diffs), key=lambda item: abs(item[1]))
    ranks = [0.0] * n
    tie_groups: List[int] = []
    i = 0
    while i < n:
        j = i
        while j + 1 < n and abs(abs(indexed[j + 1][1]) - abs(indexed[i][1])) <= 1e-12:
            j += 1
        avg_rank = (i + 1 + j + 1) / 2.0
        for k in range(i, j + 1):
            ranks[indexed[k][0]] = avg_rank
        tie_groups.append(j - i + 1)
        i = j + 1

    w_plus = sum(r for d, r in zip(diffs, ranks) if d > 0)
    w_minus = sum(r for d, r in zip(diffs, ranks) if d < 0)
    w_stat = min(w_plus, w_minus)

    if n <= 25:
        # Exact DP using doubled integer ranks (so half-ranks like 1.5 become 3)
        doubled_ranks = [int(round(r * 2)) for r in ranks]
        max_sum = sum(doubled_ranks)
        dp = [0] * (max_sum + 1)
        dp[0] = 1
        for dr in doubled_ranks:
            for s in range(max_sum, dr - 1, -1):
                dp[s] += dp[s - dr]
        target = int(round(w_stat * 2))
        total_outcomes = 1 << n
        tail = sum(dp[s] for s in range(0, target + 1))
        if target * 2 == max_sum:
            p_val = 1.0
        else:
            p_val = min(1.0, (2.0 * tail) / total_outcomes)
        method = "exact"
    else:
        mean_w = n * (n + 1) / 4.0
        tie_adj = sum(t * (t * t - 1) for t in tie_groups) / 48.0
        var_w = (n * (n + 1) * (2 * n + 1) / 24.0) - tie_adj
        if var_w <= 0:
            p_val = 1.0
        else:
            z = (abs(w_stat - mean_w) - 0.5) / math.sqrt(var_w)
            p_val = math.erfc(max(0.0, z) / math.sqrt(2.0))
        method = "normal_approx"

    return {
        "n_nonzero": n,
        "W_plus": w_plus,
        "W_minus": w_minus,
        "W": w_stat,
        "p": p_val,
        "method": method,
    }


def quantile_linear(sorted_vals: List[float], q: float) -> float:
    """Linearly interpolated quantile for q in [0, 1]."""
    n = len(sorted_vals)
    if n == 0:
        return float("nan")
    if n == 1:
        return sorted_vals[0]
    pos = q * (n - 1)
    lo = int(math.floor(pos))
    hi = int(math.ceil(pos))
    frac = pos - lo
    return sorted_vals[lo] * (1.0 - frac) + sorted_vals[hi] * frac


def describe(vals: List[float]) -> Dict[str, float]:
    s = sorted(vals)
    q1 = quantile_linear(s, 0.25)
    q3 = quantile_linear(s, 0.75)
    return {
        "n": len(vals),
        "mean": statistics.mean(vals),
        "sd": statistics.stdev(vals) if len(vals) > 1 else 0.0,
        "median": statistics.median(vals),
        "iqr": q3 - q1,
        "min": s[0],
        "max": s[-1],
    }


def fmt_p(p: float) -> str:
    if math.isnan(p):
        return "NaN"
    if p < 0.001:
        return "< 0.001"
    return f"{p:.4f}"


def load_rows(csv_path: Path) -> List[Dict[str, str]]:
    with csv_path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            raise ValueError("CSV file is empty or missing headers.")
        missing = [c for c in REQUIRED_COLS if c not in reader.fieldnames]
        if missing:
            raise ValueError(f"Missing required columns: {', '.join(missing)}")
        rows = [row for row in reader if row.get("participant_id", "").strip()]
    if not rows:
        raise ValueError("No participant rows found in CSV.")
    return rows


def build_report(csv_path: Path, rows: List[Dict[str, str]]) -> str:
    n = len(rows)
    ab_count = sum(1 for r in rows if r["order"].strip().upper() == "AB")
    ba_count = sum(1 for r in rows if r["order"].strip().upper() == "BA")

    metrics: List[Tuple[str, str, str]] = [
        ("Waktu Pengisian (detik)", "time_a_sec", "time_b_sec"),
        ("Jumlah Error Tugas", "errors_a", "errors_b"),
        ("Skor SUS (0–100)", "sus_a", "sus_b"),
    ]

    lines: List[str] = [
        "# Ringkasan Analisis Statistik Uji Kebergunaan TapClinic",
        "",
        f"- **Berkas Sumber**: `{csv_path.name}`",
        f"- **Total Partisipan**: *N* = {n} (`AB`: {ab_count}, `BA`: {ba_count})",
        "",
        "## 1. Statistik Deskriptif (Varian A vs. Varian B)",
        "",
        "| Metrik | Varian | Mean ± SD | Median (IQR) | Min–Maks |",
        "| :--- | :---: | :---: | :---: | :---: |",
    ]

    paired_rows: List[str] = []

    for label, col_a, col_b in metrics:
        a_vals = [float(r[col_a]) for r in rows]
        b_vals = [float(r[col_b]) for r in rows]
        da = describe(a_vals)
        db = describe(b_vals)

        lines.append(
            f"| {label} | A (Teks) | {da['mean']:.2f} ± {da['sd']:.2f} | "
            f"{da['median']:.2f} ({da['iqr']:.2f}) | {da['min']:.1f}–{da['max']:.1f} |"
        )
        lines.append(
            f"| {label} | B (TapClinic) | {db['mean']:.2f} ± {db['sd']:.2f} | "
            f"{db['median']:.2f} ({db['iqr']:.2f}) | {db['min']:.1f}–{db['max']:.1f} |"
        )

        tt = paired_t_test(a_vals, b_vals)
        wx = wilcoxon_signed_rank(a_vals, b_vals)
        paired_rows.append(
            f"| {label} | {tt['mean_diff']:+.2f} ± {tt['sd_diff']:.2f} | "
            f"t({tt['df']}) = {tt['t']:.3f} | {fmt_p(tt['p'])} | {tt['cohens_dz']:.2f} | "
            f"W = {wx['W']:.1f} (*n*={wx['n_nonzero']}, {wx['method']}) | {fmt_p(wx['p'])} |"
        )

    lines.extend(
        [
            "",
            "## 2. Uji Hipotesis Berpasangan (Selisih = B − A)",
            "",
            "| Metrik | Mean Selisih ± SD | Paired *t* | *p* (*t*-test) | Cohen's *d_z* | Wilcoxon *W* | *p* (Wilcoxon) |",
            "| :--- | :---: | :---: | :---: | :---: | :---: | :---: |",
        ]
    )
    lines.extend(paired_rows)

    if "preference" in rows[0]:
        pref_counts: Dict[str, int] = {}
        for r in rows:
            p = (r.get("preference") or "N/A").strip()
            pref_counts[p] = pref_counts.get(p, 0) + 1
        lines.extend(["", "## 3. Preferensi Subjektif Partisipan", ""])
        for k, v in sorted(pref_counts.items()):
            pct = (v / n) * 100.0
            lines.append(f"- **{k}**: {v}/{n} ({pct:.1f}%)")

    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Analyze TapClinic within-subjects usability CSV data.")
    parser.add_argument("csv_path", type=Path, help="Path to CSV exported from TapClinic prototype.")
    parser.add_argument("--markdown-out", type=Path, default=None, help="Optional output path for Markdown report.")
    args = parser.parse_args()

    try:
        rows = load_rows(args.csv_path)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    report = build_report(args.csv_path, rows)
    print(report)

    if args.markdown_out is not None:
        args.markdown_out.parent.mkdir(parents=True, exist_ok=True)
        args.markdown_out.write_text(report, encoding="utf-8")
        print(f"Saved Markdown summary to {args.markdown_out}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
