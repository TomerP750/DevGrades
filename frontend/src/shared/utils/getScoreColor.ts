

export function getScoreColor(value: number, max = 5) {
    const safeMax = max > 0 ? max : 5;
    const percentage = (Math.min(Math.max(value, 0), safeMax) / safeMax) * 100;
  
    if (percentage >= 80) return "text-success";
    if (percentage >= 40) return "text-warning";
    return "text-danger";
  }