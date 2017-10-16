/**
 * @File Name		: FormatUtil.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2015-1-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.utils;

public class FormatUtil {
	
	public static int offset(int number){
		int offset = SystemConfig.getInt("offset", 1);
		int increment = SystemConfig.getInt("increment", 1);
		
		return number * increment + offset;
	}
	
	public static String fillZero(int number, String format){
		java.text.DecimalFormat df = new java.text.DecimalFormat(format);
		return df.format(number);
	}
	
	public static int decodeCompany(String company){
		
		int $length = company.length();
		int $index = Integer.parseInt(company.substring($length-2, $length-1));
		int _index = Integer.parseInt(company.substring($length-1));
		
		return Integer.parseInt(company.substring($index, $index+_index));
	}
	
	public static String encodeCompany(int company){
		return String.format("%d%d%d%d%d", (int)((Math.random()*9+1)*100), company, (int)((Math.random()*9+1)*10), 3, String.valueOf(company).length());
	}
	
	public static void main(String[] args){
		System.out.println(fillZero(offset(3), "0000"));
		System.out.println(encodeCompany(11));
		System.out.println(decodeCompany(String.valueOf(encodeCompany(6))));
	}
}
