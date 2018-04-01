/**
 * @File Name		: LogUtils.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2017-4-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.utils;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;

public class LogUtils {
	
	public static Map<String, String> getMapFromStr(String str){
		Map<String, String> map = new HashMap<String, String>();
	    
	    String[] strs = str.split(Constant.SEMICOLON);
	    
	    for(String s: strs){
	    	String[] ss = s.split(Constant.COLON);
	        map.put(ss[0], ss[1]);
	    }
	    return map;
	}
	
	public static void logging(Logger logger, Exception e, String actionName){
		if(SystemConfig.DEBUG_TRUE_STR.equals(SystemConfig.getString("debug", SystemConfig.DEBUG_FALSE_STR))){
			e.printStackTrace();
		}else{
			logger.error(String.format("%s|%s|%s|%s", "AI", "E", actionName, e.getMessage()));
		}
	}
	
	public static void logging(Logger logger, String server, String errormsg, String api){
		logger.error(String.format("%s|%s|%s|%s %s", "AI", "I", api, server, errormsg));
	}
	
	public static void logging(Logger logger, String api, int errorcode, String errormsg){
		logger.error(String.format("%s|%s|%s|%d-%s", "AI", "E", api, errorcode, errormsg));
	}
	
	public static void logging(Logger logger, String userId, String actionName){
		logger.error(String.format("%s|%s|%s|%s", "AI", "I", actionName, userId));
	}
	
	public static void logging(Logger logger, String actionName, Long runTime){
		logger.error(String.format("%s|%s|%s|%s", "OT", "I", actionName, runTime.toString()));
	}

}
