package com.placementtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Every endpoint returns this same shape, whether it succeeds or fails:
 *   { "success": true,  "message": "...", "data": {...} }
 *   { "success": false, "message": "...", "data": null  }
 *
 * Why: the React frontend can write ONE piece of logic to handle every
 * API call ("if success show data, else show message as an error toast")
 * instead of guessing the shape of each individual endpoint's response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
