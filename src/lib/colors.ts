import { RatedType } from "../types/AddEntry"

export const primaryColor = "#a4c9ff"

export const borderColor = "#d8dee2"
export const borderRadius = 4
export const textStandardColor = "#283747"
export const buttonBackgroundColor = primaryColor
export const focusedColor = primaryColor
export const unfocusedColor = "grey"
export const contentDiffColor = "#dedede"
export const contentColor = "#fff"
export const focusedTextColor = "#0068ff"

export const RATING_1_COLOR = "#79e155"
export const RATING_2_COLOR = "#dbdf5f"
export const RATING_3_COLOR = "gold"
export const RATING_4_COLOR = "orange"
export const RATING_5_COLOR = "#ff7c5e"

export const colors = {
    primaryColor
}

export function getColorForRating(rating: number, ratedType: RatedType): string {
    if (rating === -1) {
        return ""
    }

    switch (ratedType) {
        case "5rated":
            switch (rating) {
                case 0:
                    return RATING_1_COLOR
                case 1:
                    return RATING_2_COLOR
                case 2:
                    return RATING_3_COLOR
                case 3:
                    return RATING_4_COLOR
                case 4:
                    return RATING_5_COLOR
            }
    }

    return "#fff"
}