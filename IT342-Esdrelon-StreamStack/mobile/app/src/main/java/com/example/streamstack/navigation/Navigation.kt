package com.example.streamstack.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.streamstack.data.api.ApiService
import com.example.streamstack.data.repository.MovieRepository
import com.example.streamstack.ui.screens.DashboardScreen
import com.example.streamstack.ui.screens.LoginScreen
import com.example.streamstack.ui.screens.RegisterScreen
import com.example.streamstack.ui.screens.ProfileScreen

@Composable
fun Navigation(startDestination: String) {
    val navController = rememberNavController()
    val apiService = ApiService.create()
    val repository = MovieRepository(apiService)

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable("login") {
            LoginScreen(
                navController = navController,
                repository = repository
            )
        }

        composable("register") {
            RegisterScreen(
                navController = navController,
                repository = repository
            )
        }

        composable("dashboard") {
            DashboardScreen(
                navController = navController,
                repository = repository
            )
        }

        composable("profile") {
            ProfileScreen(navController = navController)
        }
    }
}