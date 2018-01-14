package com.fanglin.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CookieUtil {
	
	public static void addCookie(HttpServletResponse response, String name, String value) throws UnsupportedEncodingException {
		value = URLEncoder.encode(value, "UTF-8");
		Cookie cookie = new Cookie(name, value);
		cookie.setMaxAge(2 * 60 * 60);// 保存2小时
		cookie.setPath("/");
		response.addCookie(cookie);
	}

	// 添加cookie; | UnsupportedEncodingException,转码异常
	public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) throws UnsupportedEncodingException {
		value = URLEncoder.encode(value, "UTF-8");
		Cookie cookie = new Cookie(name, value);
		cookie.setMaxAge(maxAge);// 保存maxAge秒
		cookie.setPath("/");
		response.addCookie(cookie);
	}

	// 得到指定的cookie;
	public static String getCookie(HttpServletRequest request, String cookieName) throws UnsupportedEncodingException {
		String value = "";
		Cookie[] cookies = request.getCookies();
		
		if(cookies != null){
			for(Cookie cookie : cookies){
				if(cookieName.equals(cookie.getName())){ // 获取具体的cookie
					value = URLDecoder.decode(cookie.getValue(), "UTF-8");
					
					return value;
				}
			}
		}
		return null;
	}

	// 删除指定的cookie
	public static Cookie delCookie(HttpServletRequest request, HttpServletResponse response, String cookieName){
		Cookie[] cookies = request.getCookies();
		
		if(cookies != null){
			for(Cookie cookie: cookies){
				if(cookieName.equals(cookie.getName())){
					cookie.setValue("");
					cookie.setMaxAge(0);
					cookie.setPath("/"); // 添加, 清除时需要加路径才能清除掉
					response.addCookie(cookie);
				}
			}
		}
		
		return null;
	}
}
