package com.learning.NrCreation.Exception;

public class UnauthorizedAccessException extends RuntimeException{
    public UnauthorizedAccessException(String message)
    {
        super(message);
    }

}