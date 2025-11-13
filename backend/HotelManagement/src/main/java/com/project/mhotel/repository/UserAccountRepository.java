package com.project.mhotel.repository;

import com.project.mhotel.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmail(String email);
    Optional<UserAccount> findByUsername(String username);
    // Tìm user theo role
    List<UserAccount> findByRole(String role);
    Long countByRole(UserAccount.Role role);
}