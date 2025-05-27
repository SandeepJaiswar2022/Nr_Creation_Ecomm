package com.learning.NrCreation.Service.Razorpay;

import com.learning.NrCreation.Request.PaymentVerificationRequest;
import com.razorpay.RazorpayException;
import org.json.JSONObject;

import java.util.Map;

public interface RazorpayService {
    public Map<String,String> createRazorPayOrder(JSONObject orderRequestJson) throws RazorpayException;
    public boolean verifyPayment(PaymentVerificationRequest request);
}
