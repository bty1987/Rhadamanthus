/*
 * @File Name	: IPUtil.java
 * @Package		：com.fanglin.utils 
 * @Version		: 1.0
 * @Date		: 2014-8-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * Describing	: Ip相关工具类
 */

package com.fanglin.utils;

import javax.servlet.http.HttpServletRequest;


public class IPUtil {

	public static boolean ipMatches(String sourceIP, String rexIP){
		if(rexIP == null){
			return false;
		}

		if(sourceIP == null){
			return false;
		}

		String[] sourceArray = sourceIP.split("\\.");
		String[] rexArray = rexIP.split("\\.");

		for(int i = 0; i < rexArray.length; i++){

			if(!"*".equals(rexArray[i]) && !rexArray[i].equals(sourceArray[i])){
				return false;
			}
		}

		return true;
	}

	/*
	 * 获得远程的Ip
	 */
	public static String getIpAddr(HttpServletRequest request){
		String ip = request.getHeader("x-forwarded-for");

		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)){
			ip = request.getHeader("Proxy-Client-IP");
		}

		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)){
			ip = request.getHeader("WL-Proxy-Client-IP");
		}

		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)){
			ip = request.getRemoteAddr();
		}
		
		if(ip.contains(",")){
			ip = ip.split(",")[0];
		}
		return ip;
	}

}
