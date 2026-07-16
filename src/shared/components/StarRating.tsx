import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { AppTheme } from "../../../themes/Theme";
import { useTheme } from "../providers/ThemeContext";

const STAR_COUNT = 5;
const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
const VIEWBOX = 24;
const STROKE_WIDTH = 1.4;

interface IStarRatingProps {
  rate: number;
  align?: ViewStyle["justifyContent"];
  touchableOpacityDisabled?: boolean;
  onChange?: (rate: number) => void;
  size?: number;
}

function StarGlyph({
  size,
  fill,
  stroke
}: {
  size: number;
  fill: string;
  stroke: string;
}) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
      <Path
        d={STAR_PATH}
        fill={fill}
        stroke={stroke}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function StarRating({
  rate,
  align = "center",
  touchableOpacityDisabled = false,
  onChange,
  size = 36
}: IStarRatingProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const fillColor = theme.colors.highlight;
  const outlineColor = touchableOpacityDisabled
    ? fillColor
    : theme.colors.textPlaceholder;
  const filledCount = Math.floor(rate);

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: align,
          gap: touchableOpacityDisabled ? 0 : 8
        }
      ]}
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => {
        const fill = Math.min(1, Math.max(0, rate - index));
        const isFull = fill >= 1;
        const showHighlight = touchableOpacityDisabled && isFull;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChange?.(index + 1)}
            disabled={touchableOpacityDisabled}
          >
            <View
              style={[
                touchableOpacityDisabled && styles.star,
                showHighlight && styles.highlight,
                showHighlight && index === 0 && styles.highlightStart,
                showHighlight &&
                  index === filledCount - 1 &&
                  styles.highlightEnd
              ]}
            >
              <View style={{ width: size, height: size }}>
                <StarGlyph
                  size={size}
                  fill={isFull ? fillColor : "none"}
                  stroke={isFull ? fillColor : outlineColor}
                />
                {fill > 0 && fill < 1 && (
                  <View
                    collapsable={false}
                    style={[styles.fillClip, { width: size * fill, height: size }]}
                  >
                    <StarGlyph size={size} fill={fillColor} stroke={fillColor} />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center"
    },
    star: {
      padding: 4
    },
    fillClip: {
      position: "absolute",
      left: 0,
      top: 0,
      overflow: "hidden"
    },
    highlight: {
      backgroundColor: theme.colors.backgroundHighlight
    },
    highlightStart: {
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50
    },
    highlightEnd: {
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50
    }
  });
