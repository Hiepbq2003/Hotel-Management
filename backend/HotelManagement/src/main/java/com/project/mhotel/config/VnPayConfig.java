package com.project.mhotel.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class VnPayConfig {

    public static String vnp_TmnCode;
    public static String vnp_HashSecret;
    public static String vnp_Url;
    public static String vnp_Returnurl;

    @Value("${vnpay.tmn-code}")
    public void setVnpTmnCode(String tmnCode) {
        vnp_TmnCode = tmnCode;
    }

    @Value("${vnpay.hash-secret}")
    public void setVnpHashSecret(String hashSecret) {
        vnp_HashSecret = hashSecret;
    }

    @Value("${vnpay.url}")
    public void setVnpUrl(String url) {
        vnp_Url = url;
    }

    @Value("${vnpay.return-url}")
    public void setVnpReturnurl(String returnUrl) {
        vnp_Returnurl = returnUrl;
    }
}
