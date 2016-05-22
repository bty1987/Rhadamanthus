/*
 * @File Name	: SystemConfig.java
 * @Package		：com.fanglin.utils 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * Describing	: 获得配置文件内容的工具类
 */ 

package com.fanglin.utils;

import java.io.InputStream;
import java.util.Properties;

public class SystemConfig {

	private static String configFilePathName = "/sysconfig.properties";

	private static Properties prop;

	static {
		try {
			InputStream is = SystemConfig.class.getResourceAsStream(configFilePathName);
			prop = new Properties();
			prop.load(is);
		} catch (Throwable e){
			throw new RuntimeException("config-file cannot be load: " + configFilePathName);
		}
	}

	public static String getString(String key){
		return prop.getProperty(key);
	}

	public static String getString(String key, String defaultValue){
		return prop.getProperty(key, defaultValue);
	}

	public static boolean getBoolean(String key){
		String tempValue = getString(key);
		return Boolean.valueOf(tempValue).booleanValue();
	}

	public static boolean getBoolean(String key, boolean defaultValue){
		String tempValue = getString(key, "" + defaultValue);
		return Boolean.valueOf(tempValue).booleanValue();
	}

	public static double getDouble(String key){
		String tempValue = getString(key);
		return Double.parseDouble(tempValue);
	}

	public static double getDouble(String key, double defaultValue){
		String tempValue = getString(key, "" + defaultValue);
		return Double.parseDouble(tempValue);
	}

	public static float getFloat(String key){
		String tempValue = getString(key);
		return Float.parseFloat(tempValue);
	}

	public static float getFloat(String key, float defaultValue){
		String tempValue = getString(key, "" + defaultValue);
		return Float.parseFloat(tempValue);
	}

	public static int getInt(String key){
		String tempValue = getString(key);
		return Integer.parseInt(tempValue);
	}

	public static int getInt(String key, int defaultValue){
		String tempValue = getString(key, "" + defaultValue);
		return Integer.parseInt(tempValue);
	}

	public static long getLong(String key){
		String tempValue = getString(key);
		return Long.parseLong(tempValue);
	}

	public static long getLong(String key, long defaultValue){
		String tempValue = getString(key, "" + defaultValue);
		return Long.parseLong(tempValue);
	}
}
