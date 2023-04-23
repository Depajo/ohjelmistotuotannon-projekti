package fi.tuni.aaniohjaus.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material.MaterialTheme
import androidx.compose.material.darkColors
import androidx.compose.material.lightColors
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorPalette = darkColors(
    primary = White100,
    primaryVariant = Red300,
    secondary = Black100,
)

private val LightColorPalette = lightColors(
    primary = Black100,
    primaryVariant = Red300,
    secondary = White100,
)

@Composable
fun AaniohjausTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    val colors = if (darkTheme) DarkColorPalette else LightColorPalette
    val typography = if (darkTheme) DarkTypography else LightTypography

    MaterialTheme(
        colors = colors,
        typography = typography,
        shapes = Shapes,
        content = content
    )
}