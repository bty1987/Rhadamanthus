/*
 * @File Name	: SystemConfig.java
 * @Package		：com.fanglin.utils 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 产生UUID的工具类
 */ 

package com.fanglin.utils;

import java.util.UUID;

public class UUIDUtil {

	public synchronized static String getUuid(){
		UUID uuid = UUID.randomUUID();
		return uuid.toString().replaceAll("-", "");
	}

	public static void main(String[] args){
		System.out.println(UUIDUtil.getUuid());
	}
}
