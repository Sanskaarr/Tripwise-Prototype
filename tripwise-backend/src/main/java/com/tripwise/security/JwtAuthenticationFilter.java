package com.tripwise.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        String token = extractToken(request);
        
        log.info("JwtAuthenticationFilter: {} {} | hasToken={}", method, path, token != null);
        
        if (token != null) {
            try {
                boolean isValid = jwtUtil.validateToken(token);
                log.info("JwtAuthenticationFilter: token validation result={}", isValid);
                if (isValid) {
                    String identifier = jwtUtil.extractUserId(token);
                    log.info("JwtAuthenticationFilter: authenticated subject={}", identifier);
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(identifier, null, Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                log.error("JwtAuthenticationFilter: validation exception: {}", e.getMessage(), e);
            }
        } else {
            log.info("JwtAuthenticationFilter: No token found in request headers or cookies for path: {}", path);
        }
        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        // 1. Try Authorization header (for API clients / Postman)
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }

        // 2. Try httpOnly cookie (for browser clients)
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    @Override
    protected boolean shouldNotFilterAsyncDispatch() {
        return false;
    }
}
