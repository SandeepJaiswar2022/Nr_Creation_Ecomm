package com.learning.NrCreation.Service.Razorpay;

import com.learning.NrCreation.Configuration.RazorpayConfig;
import com.learning.NrCreation.Enum.OrderStatus;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.OrderRepository;
import com.learning.NrCreation.Request.PaymentVerificationRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SignatureException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RazorpayServiceImpl implements RazorpayService{
    private final RazorpayClient razorpayClient;
    private final OrderRepository orderRepository;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    @Override
    public Map<String, String> createRazorPayOrder(JSONObject orderRequestJson) throws RazorpayException {

        Order razorpayOrder = razorpayClient.orders.create(orderRequestJson);

        String id = razorpayOrder.get("id").toString();         // safe
        String amount = razorpayOrder.get("amount").toString(); // safe
        String currency = razorpayOrder.get("currency").toString(); // safe

        return Map.of(
                "razorpayOrderId", id,
                "amount", amount,
                "currency", currency
        );
    }

    @Override
    public boolean verifyPayment(PaymentVerificationRequest request) {
        try {
            String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();

//            System.out.println("\n\npayload: " + payload);
            String actualSignature = hmacSHA256(payload, apiSecret);
            System.out.println("\nActualSignature: " + actualSignature);
            System.out.println("\nSignature: " + request.getRazorpaySignature());
            if (actualSignature.equals(request.getRazorpaySignature())) {
                com.learning.NrCreation.Entity.Order order = orderRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                        .orElseThrow(() -> new ResourceNotFoundException("Order not found for Razorpay Order ID: " + request.getRazorpayOrderId()));
                order.setOrderStatus(OrderStatus.CONFIRMED);
                order.setOrderDate(LocalDateTime.now());
                order.setRazorpayPaymentId(request.getRazorpayPaymentId());
                System.out.println("Order date : "+ order.getOrderDate() +"Order Status : "+ order.getOrderStatus() + "\n\nRazorpay payment id : " + request.getRazorpayPaymentId());
                orderRepository.save(order);
                System.out.println("\n\nPayment Verification Done Successfully\n\n");
                return true;
            } else {
                System.out.println("\n\nPayment Verification Failed\n\n");
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    private String hmacSHA256(String data, String secret) throws SignatureException {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // Convert byte[] to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (Exception e) {
            throw new SignatureException("Error creating HMAC SHA256 signature", e);
        }
    }

}
