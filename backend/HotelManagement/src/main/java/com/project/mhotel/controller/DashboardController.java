package com.project.mhotel.controller;

import com.project.mhotel.dto.DashboardStatsResponse;
import com.project.mhotel.service.DashboardService;
import com.project.mhotel.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_RECEPTION')")
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStatistics(

            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        String userRole = userDetails.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("CUSTOMER")
                .replace("ROLE_", "");

        DashboardStatsResponse stats = dashboardService.getDashboardStats(userRole);

        return ResponseEntity.ok(stats);
    }
}