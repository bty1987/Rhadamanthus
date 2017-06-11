/**
 * @File Name		: SecretUtils.java
 * @Package   	: com.fanglin.secret.utils
 * @Version		: 1.0
 * @Date			: 2017-6-10
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.secret.utils;

import java.util.Random;

public class SecretUtils {
	
	public static String getRandomString(int length){
		
        String str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        Random random = new Random();
        StringBuffer sb = new StringBuffer();
          
        for(int i = 0; i < length; ++i){  
            int number = random.nextInt(str.length());//[0,62)
              
            sb.append(str.charAt(number));  
        }  
        return sb.toString();  
    }
	
	public static void main(String[] args) {
		System.out.println(getRandomString(8).toUpperCase());
		
	}

}
