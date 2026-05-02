package edu.cit.esdrelon.streamstack.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String username;
    private String email;
    private String firstname;
    private String lastname;
}