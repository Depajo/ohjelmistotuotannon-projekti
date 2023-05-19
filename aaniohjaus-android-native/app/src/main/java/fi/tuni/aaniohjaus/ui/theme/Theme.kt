package fi.tuni.aaniohjaus.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material.MaterialTheme
import androidx.compose.material.darkColors
import androidx.compose.material.lightColors
import androidx.compose.runtime.Composable

/**
 * DarkColorPalette defines the color palette for the dark theme.
 * It specifies the background color, secondary color, and secondary variant color.
 */
private val DarkColorPalette = darkColors(
    background = DarkBackground,
    secondary = DarkContainerBackground,
    secondaryVariant = Red300
)

/**
 * LightColorPalette defines the color palette for the light theme.
 * It specifies the background color, secondary color, and secondary variant color.
 */
private val LightColorPalette = lightColors(
    background = LightBackground,
    secondary = LightContainerBackground,
    secondaryVariant = Red300
)

/**
 * AaniohjausTheme is a composable function that defines the theme for the Aaniohjaus application.
 *
 * @param darkTheme Flag indicating whether the dark theme should be applied. Defaults to the system's dark theme setting.
 * @param content The composable content that will be rendered within the theme.
 */
@Composable
fun AaniohjausTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    // Define the color palette based on the theme mode
    val colors = if (darkTheme) DarkColorPalette else LightColorPalette
    // Define the typography based on the theme mode
    val typography = if (darkTheme) DarkTypography else LightTypography

    // Apply the Material Design theme
    MaterialTheme(
        colors = colors,
        typography = typography,
        shapes = Shapes,
        content = content
    )
}