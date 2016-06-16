/**
 * @File Name		: QRCodeUtil.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2016-5-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Hashtable;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

public class QRCodeUtil {
	
	public static final Logger logger = LoggerFactory.getLogger(QRCodeUtil.class);
	
	public static String encode(String contents, int width, int height) {
		
		BitMatrix byteMatrix;
        Hashtable<Object, Object> hints = new Hashtable<Object, Object>(); // 指定纠错等级 
        
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L); // 指定编码格式 
        
        try {
            byteMatrix = new MultiFormatWriter().encode(new String(contents.getBytes("UTF-8"), "iso-8859-1"), BarcodeFormat.QR_CODE, width, height);
            ByteArrayOutputStream bao = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(byteMatrix, "png", bao);
            String qrCode = Base64Code(bao.toByteArray());
            
            return String.format("data:image/png;base64,%s", qrCode);
        }catch (Exception e){
            logger.error(String.format("%s - %s - %s", "HH", "E", e.getMessage()));
        }
        
        return null;
    }
	
	public static String  Base64Code(byte[] b) {
        BASE64Encoder encoder = new BASE64Encoder();
        String codeBase64 = "";
        
        StringBuilder pictureBuffer = new StringBuilder();
        pictureBuffer.append(encoder.encode(b));
        codeBase64 = pictureBuffer.toString();
        
        return codeBase64;
    }
	
	public void createImage(String Base64){
        BASE64Decoder decoder = new BASE64Decoder();
        FileOutputStream write;
        
        try {
            write = new FileOutputStream(new File("c:/ok.png"));
            byte[] decoderBytes = decoder.decodeBuffer(Base64);
            write.write(decoderBytes);
        } catch (Exception e) {
        	logger.error(String.format("%s - %s - %s", "HH", "E", e.getMessage()));
        }
          
        System.out.println("Decoding the picture Success");  
    }  
	
	public static void main(String[] args) {
		
        String contents = "http://61.161.185.22//dingding/login/login.html?loginFlag=726f19f84a214b2594fa3aefe502ea5a";
  
        int width = 210, height = 210;
  
        System.out.println(QRCodeUtil.encode(contents, width, height));
        
        System.out.println("DCE1B1519CAF68B8BC3FCA5C7A2D6FAA9AB125D8712BA9EDA010A7ECD3DCE278B0B5CD21A0512789CFBCBFA8F08C1B4277CD2E5F7C7B8597488A05A98116338EF7D62F6ED2F0A7FC05D77B2323ACB367329B9F2DBE050A9B89058676C7E70492".length());
    }

}
