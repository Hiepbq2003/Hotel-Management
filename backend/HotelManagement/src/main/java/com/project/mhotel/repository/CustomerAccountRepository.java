package com.project.mhotel.repository;

import com.project.mhotel.entity.CustomerAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerAccountRepository extends JpaRepository<CustomerAccount, Long> {
    Optional<CustomerAccount> findByEmail(String email);
    Optional<CustomerAccount> findById(Long id);
}