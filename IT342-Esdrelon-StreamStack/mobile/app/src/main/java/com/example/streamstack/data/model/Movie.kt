package com.example.streamstack.data.model

data class Movie(
    val id: Int,
    val title: String,
    val year: String,
    val rating: Double,
    val genre: String,
    val duration: String,
    val image: String,
    val description: String
)