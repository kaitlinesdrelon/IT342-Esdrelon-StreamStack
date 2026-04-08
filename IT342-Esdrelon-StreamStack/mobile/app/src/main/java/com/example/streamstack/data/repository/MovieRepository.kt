package com.example.streamstack.data.repository

import com.example.streamstack.data.api.ApiService
import com.example.streamstack.data.model.LoginRequest
import com.example.streamstack.data.model.LoginResponse
import com.example.streamstack.data.model.Movie
import com.example.streamstack.data.model.RegisterRequest
import com.example.streamstack.data.model.User

class MovieRepository(private val apiService: ApiService) {

    suspend fun register(username: String, email: String, password: String): Result<String> {
        return try {
            val response = apiService.register(
                RegisterRequest(username, email, password)
            )

            if (response.isSuccessful) {
                Result.success("Registration successful!")
            } else {
                Result.failure(Exception(response.message() ?: "Registration failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun login(email: String, password: String): Result<LoginResponse> {
        return try {
            // Demo login for testing without backend
            if (email == "demo@test.com" && password == "demo123") {
                val demoUser = User(
                    id = 1,
                    username = "Demo User",
                    email = "demo@test.com"
                )
                val demoResponse = LoginResponse(
                    token = "demo-token-12345",
                    user = demoUser
                )
                return Result.success(demoResponse)
            }

            // Real backend login
            val response = apiService.login(LoginRequest(email, password))

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(response.message() ?: "Login failed"))
            }
        } catch (e: Exception) {
            // If backend is not available, suggest demo login
            Result.failure(Exception("Backend not available. Use demo@test.com / demo123"))
        }
    }

    suspend fun getMovies(): Result<List<Movie>> {
        return try {
            // Sample movies for demo
            val sampleMovies = listOf(
                Movie(1, "The Shawshank Redemption", "1994", 9.3, "Drama", "142 min",
                    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
                    "Two imprisoned men bond over a number of years."),
                Movie(2, "The Dark Knight", "2008", 9.0, "Action", "152 min",
                    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
                    "Batman must accept one of the greatest psychological tests."),
                Movie(3, "Inception", "2010", 8.8, "Sci-Fi", "148 min",
                    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
                    "A thief who steals corporate secrets through dream-sharing."),
                Movie(4, "Pulp Fiction", "1994", 8.9, "Crime", "154 min",
                    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
                    "The lives of two mob hitmen intertwine."),
                Movie(5, "Forrest Gump", "1994", 8.8, "Drama", "142 min",
                    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
                    "The presidencies unfold through the perspective of an Alabama man."),
                Movie(6, "The Matrix", "1999", 8.7, "Sci-Fi", "136 min",
                    "https://images.unsplash.com/photo-1574267432644-f737f0d95187?w=400&h=600&fit=crop",
                    "A computer hacker learns about the true nature of reality."),
                Movie(7, "Interstellar", "2014", 8.6, "Sci-Fi", "169 min",
                    "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
                    "Explorers travel through a wormhole in space."),
                Movie(8, "The Godfather", "1972", 9.2, "Crime", "175 min",
                    "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop",
                    "The aging patriarch transfers control to his son."),
            )

            // Try to get from backend, fallback to sample data
            try {
                val response = apiService.getMovies()
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.success(sampleMovies)
                }
            } catch (e: Exception) {
                Result.success(sampleMovies)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}