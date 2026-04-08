package com.example.streamstack.ui.screens

import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.streamstack.data.model.Movie
import com.example.streamstack.data.repository.MovieRepository
import com.example.streamstack.ui.components.MovieCard
import com.example.streamstack.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    navController: NavController,
    repository: MovieRepository
) {
    var movies by remember { mutableStateOf<List<Movie>>(emptyList()) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    var isLoading by remember { mutableStateOf(true) }
    var showUserMenu by remember { mutableStateOf(false) }

    val context = LocalContext.current
    val prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE)
    val username = prefs.getString("username", "User") ?: "User"

    val scope = rememberCoroutineScope()
    val categories = listOf("All", "Action", "Drama", "Sci-Fi", "Crime", "Thriller")

    // Load movies
    LaunchedEffect(Unit) {
        val result = repository.getMovies()
        result.onSuccess {
            movies = it
            isLoading = false
        }
    }

    // Filter movies
    val filteredMovies = movies.filter { movie ->
        val matchesSearch = movie.title.contains(searchQuery, ignoreCase = true) ||
                movie.description.contains(searchQuery, ignoreCase = true)
        val matchesCategory = selectedCategory == "All" || movie.genre == selectedCategory
        matchesSearch && matchesCategory
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "StreamStack",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                actions = {
                    IconButton(onClick = { showUserMenu = !showUserMenu }) {
                        Text(
                            text = username.first().uppercase(),
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite,
                            modifier = Modifier
                                .size(40.dp)
                                .background(PrimaryPurple, RoundedCornerShape(20.dp))
                                .wrapContentSize(Alignment.Center)
                        )
                    }

                    DropdownMenu(
                        expanded = showUserMenu,
                        onDismissRequest = { showUserMenu = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Profile") },
                            onClick = { showUserMenu = false }
                        )
                        DropdownMenuItem(
                            text = { Text("Settings") },
                            onClick = { showUserMenu = false }
                        )
                        Divider()
                        DropdownMenuItem(
                            text = { Text("Logout", color = ErrorRed) },
                            onClick = {
                                prefs.edit().clear().apply()
                                navController.navigate("login") {
                                    popUpTo("dashboard") { inclusive = true }
                                }
                            }
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = CardDark,
                    titleContentColor = TextWhite
                )
            )
        },
        containerColor = BackgroundDark
    ) { paddingValues ->
        // Everything in ONE LazyVerticalGrid - this makes it all scroll together
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(
                top = paddingValues.calculateTopPadding(),
                start = 16.dp,
                end = 16.dp,
                bottom = 16.dp
            ),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Hero Section (spans full width)
            item(span = { androidx.compose.foundation.lazy.grid.GridItemSpan(2) }) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = PrimaryPurple
                    ),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        Column {
                            Text(
                                text = "Welcome to StreamStack",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextWhite
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Discover thousands of movies",
                                fontSize = 16.sp,
                                color = TextWhite.copy(alpha = 0.8f)
                            )
                        }
                    }
                }
            }

            // Search Bar (spans full width)
            item(span = { androidx.compose.foundation.lazy.grid.GridItemSpan(2) }) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Search movies...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = CardDark,
                        unfocusedContainerColor = CardDark,
                        focusedBorderColor = PrimaryPurple,
                        unfocusedBorderColor = Color.Transparent,
                        focusedTextColor = TextWhite,
                        unfocusedTextColor = TextWhite,
                        focusedPlaceholderColor = TextLight,
                        unfocusedPlaceholderColor = TextLight
                    )
                )
            }

            // Category Filter (spans full width)
            item(span = { androidx.compose.foundation.lazy.grid.GridItemSpan(2) }) {
                ScrollableTabRow(
                    selectedTabIndex = categories.indexOf(selectedCategory),
                    modifier = Modifier.fillMaxWidth(),
                    containerColor = BackgroundDark,
                    contentColor = TextWhite,
                    edgePadding = 0.dp
                ) {
                    categories.forEach { category ->
                        Tab(
                            selected = selectedCategory == category,
                            onClick = { selectedCategory = category },
                            text = {
                                Text(
                                    text = category,
                                    fontWeight = if (selectedCategory == category) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        )
                    }
                }
            }

            // Loading State
            if (isLoading) {
                item(span = { androidx.compose.foundation.lazy.grid.GridItemSpan(2) }) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = PrimaryPurple)
                    }
                }
            }

            // No Results State
            if (!isLoading && filteredMovies.isEmpty()) {
                item(span = { androidx.compose.foundation.lazy.grid.GridItemSpan(2) }) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "🎬",
                                fontSize = 64.sp
                            )
                            Text(
                                text = "No movies found",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextWhite
                            )
                            Text(
                                text = "Try a different search",
                                fontSize = 14.sp,
                                color = TextLight
                            )
                        }
                    }
                }
            }

            // Movie Cards
            items(filteredMovies) { movie ->
                MovieCard(movie = movie)
            }
        }
    }
}