/*
 * @File Name	: SecurityCodeHelper.java
 * @Package		：com.fanglin.commons.security 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * Describing	: 工具类，生成随机验证码字符串
 */

package com.fanglin.core.security;

import java.util.Arrays;

public class SecurityCodeHelper {
	
    /**
     * 验证码难度级别，Simple只包含数字，Medium包含数字和小写英文，Hard包含数字和大小写英文
     */
    public enum SecurityCodeLevel {Simple,Medium,Hard};
    
    /**
     * 产生默认验证码，4位中等难度
     * @return  String 验证码串
     */
    public static String getSecurityCode(){
        return getSecurityCode(4, SecurityCodeLevel.Medium,false);
    }
    
    /**
     * 产生长度和难度任意的验证码
     * @param length  长度
     * @param level   难度级别
     * @param isCanRepeat  是否能够出现重复的字符，如果为true，则可能出现 5578这样包含两个5,如果为false，则不可能出现这种情况
     * @return  String 验证码串
     */
    public static String getSecurityCode(int length, SecurityCodeLevel level, boolean isCanRepeat){
        
        int len = length; // 随机抽取len个字符
        
        char[] codes = {'1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','m','n','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'};
        
        if(level == SecurityCodeLevel.Simple){ //根据不同的难度截取字符数组
            codes = Arrays.copyOfRange(codes, 0,9);
        }else if(level==SecurityCodeLevel.Medium){
            codes = Arrays.copyOfRange(codes, 0,33);
        }
        
        int n = codes.length; // 字符集合长度
        
        if(len > n && isCanRepeat == false){ // 抛出运行时异常
        	return "";
        }
        
        //存放抽取出来的字符
        char[] result = new char[len];
        
        //判断能否出现重复的字符
        if(isCanRepeat){
            for(int i=0;i<result.length;i++){
                
                int r= (int)(Math.random() * n); //索引 0 and n-1
            
                result[i]=codes[r]; //将result中的第i个元素设置为codes[r]存放的数值
            }
        }else{
            for(int i=0;i<result.length;i++){
                int r= (int)(Math.random() * n); // 索引 0 and n-1
                
                result[i] = codes[r]; // 将result中的第i个元素设置为codes[r]存放的数值
                
                //必须确保不会再次抽取到那个字符，因为所有抽取的字符必须不相同。
                //因此，这里用数组中的最后一个字符改写codes[r]，并将n减1
                codes[r] = codes[n-1];
                n--;
            }
        }
        
        return String.valueOf(result);
    }
}