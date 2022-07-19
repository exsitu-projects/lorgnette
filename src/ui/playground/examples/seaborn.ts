import { PYTHON_LANGUAGE } from "../../../core/languages/python/language";

const text = `
barplot(
    ax = ax,
    data = user_data,
    x = "year",
    y = "time",
    hue = "gender",
    palette = "muted",
    alpha = 0.7,
    ci = None,
    hatch = "///",
    edgecolor = "white",
    linewidth = 1
)

ax.set_title("Effect of X on Y")
ax.set_xlabel("Year")
ax.set_xlabel("Time (seconds)")
`;

export const SEABORN_EXAMPLE = {
    name: "Seaborn",
    language: PYTHON_LANGUAGE,
    content: text.trim()
};