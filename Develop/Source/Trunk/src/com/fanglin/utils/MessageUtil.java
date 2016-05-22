/**
 * @File Name		: MessageUtil.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2015-1-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.utils;

import java.util.HashMap;
import java.util.Map;

public class MessageUtil {
	
	public static Map<String, String> getMapFromStr(String str){
		Map<String, String> map = new HashMap<String, String>();
	    
	    String[] strs = str.split(Constant.SEMICOLON);
	    
	    for(String s: strs){
	    	String[] ss = s.split(Constant.COLON);
	        map.put(ss[0], ss[1]);
	    }
	    return map;
	}

	public static String getStrFromMap(Map<String, String> map){
	    
	    StringBuffer str = new StringBuffer();
	    
	    for(String k: map.keySet()){
	    	str.append(k);
	    	str.append(Constant.COLON);
	    	str.append(map.get(k));
	    	str.append(Constant.SEMICOLON);
	    }
	    return str.toString().substring(0, str.length() - 1);
	}
	
}
