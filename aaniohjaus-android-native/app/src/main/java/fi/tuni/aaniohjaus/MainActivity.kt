package fi.tuni.aaniohjaus

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.Button
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import fi.tuni.aaniohjaus.ui.theme.AaniohjausTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AaniohjausTheme {
                Column {
                    Header()
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = Color.DarkGray
                    ) {
                        val location by remember { mutableStateOf("Ei sijaintia") }
                        MainContent(location)
                    }
                }
            }
        }
    }
}

@Composable
fun Header() {
    Surface(
        color = Color.Gray,
        modifier = Modifier.fillMaxWidth().height(50.dp)
    ) {
        Box {
            Button(
                onClick = {},
                modifier = Modifier.align(Alignment.TopStart).padding(8.dp)
            ) {
                Text(text = "s")
            }
            Button(
                onClick = {},
                modifier = Modifier.align(Alignment.TopEnd).padding(8.dp)
            ) {
                Text(text = "m")
            }
        }
    }
}

@Composable
fun MainContent(location: String) {
    Box {
        Column(
            Modifier.align(Alignment.Center)
        ) {
            Text(
                text = location,
                modifier = Modifier.align(Alignment.CenterHorizontally).padding(20.dp, 0.dp)
            )
            Spacer(Modifier.height(50.dp))
            Button(
                onClick = {},
                modifier = Modifier.size(200.dp, 60.dp),
                shape = CircleShape
            ) {
                Text(text = "Toista osoite")
            }
        }
    }
}

@Preview
@Composable
fun MainScreenPreview() {
    AaniohjausTheme {
        Column {
            Header()
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = Color.DarkGray
            ) {
                val location by remember { mutableStateOf("Ei sijaintia") }
                MainContent(location)
            }
        }
    }
}