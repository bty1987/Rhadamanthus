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
	
	public static short decodeCompany(String company){
		
		int $length = company.length();
		int $index = Integer.parseInt(company.substring($length-1));
		
		return Short.parseShort(company.substring($index, $index+1));
	}
	
	public static void main(String[] args){
		System.out.println(fillZero(offset(3), "0000"));
	}
}
