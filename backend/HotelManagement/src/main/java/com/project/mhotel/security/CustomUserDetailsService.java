package com.project.mhotel.security;

import com.project.mhotel.entity.CustomerAccount;
import com.project.mhotel.entity.UserAccount;
import com.project.mhotel.repository.CustomerAccountRepository;
import com.project.mhotel.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Optional<CustomerAccount> customer = customerAccountRepository.findByEmail(email);
        if (customer.isPresent()) {
            return new CustomUserDetails(customer.get());
        }

        Optional<UserAccount> user = userAccountRepository.findByEmail(email);
        if (user.isPresent()) {
            return new CustomUserDetails(user.get());
        }

        throw new UsernameNotFoundException("Không tìm thấy tài khoản với email: " + email);
    }
}