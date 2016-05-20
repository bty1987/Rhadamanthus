/*
 * @File Name	: PinYin4Util.java
 * @Package		：com.fanglin.utils 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * Describing	: 汉字转换拼音的相关工具类
 */ 

package com.fanglin.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

public class PinYin4Util {

	/**
	 * 获得汉语串的全拼
	 * 
	 * @param in 要转换的串
	 * @return Map类型字符对应的全拼
	 */
	public Map<Character, List<String>> getQuanPin(String in){

		if(in.length() == 0){
			return null;
		}
		HanyuPinyinOutputFormat outputFormat = new HanyuPinyinOutputFormat();
		outputFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		outputFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
		outputFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		outputFormat.setVCharType(HanyuPinyinVCharType.WITH_V);

		HashMap<Character, List<String>> pinyin = new HashMap<Character, List<String>>();
		for(int i = 0; i < in.length(); ++i){
			List<String> charPinyinTem = Collections.emptyList();
			List<String> charPinyin = new ArrayList<String>();
			
			// 判断是否为汉字字符函数
			if(java.lang.Character.toString(in.charAt(i)).matches("[\\u4E00-\\u9FA5]+")){
				try {
					charPinyinTem = Arrays.asList(PinyinHelper.toHanyuPinyinStringArray(in.charAt(i), outputFormat));
				} catch (BadHanyuPinyinOutputFormatCombination e){
					Logger log = LoggerFactory.getLogger("PinYin4Util");
					log.debug(e.getStackTrace().toString());
					e.printStackTrace();
				}
			} else {
				charPinyinTem = new ArrayList<String>();
				charPinyinTem.add(java.lang.Character.toString(in.charAt(i)));
			}

			for(int j = 0; j < charPinyinTem.size(); ++j){

				if(!charPinyin.isEmpty() && charPinyin.contains(charPinyinTem.get(j))){
					continue;
				} else {
					charPinyin.add(charPinyinTem.get(j));
				}
			}
			pinyin.put(in.charAt(i), charPinyin);
		}

		return pinyin;
	}

	/**
	 * 获得汉语串的首字符串
	 * 
	 * @param in 要转换的串
	 * @return Map类型字符对应的首字符串
	 */
	public Map<Character, List<String>> getQuanPinHeadChar(String in){

		if(in.length() == 0){
			return null;
		}
		
		HanyuPinyinOutputFormat outputFormat = new HanyuPinyinOutputFormat();
		outputFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		outputFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
		outputFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		outputFormat.setVCharType(HanyuPinyinVCharType.WITH_V);

		HashMap<Character, List<String>> pinyin = new HashMap<Character, List<String>>();
		for(int i = 0; i < in.length(); ++i){
			List<String> charPinyinTem = Collections.emptyList();
			List<String> charPinyin = new ArrayList<String>();
			
			// 判断是否为汉字字符函数
			if(java.lang.Character.toString(in.charAt(i)).matches("[\\u4E00-\\u9FA5]+")){
				try {
					charPinyinTem = Arrays.asList(PinyinHelper.toHanyuPinyinStringArray(in.charAt(i), outputFormat));
				} catch (BadHanyuPinyinOutputFormatCombination e){
					Logger log = LoggerFactory.getLogger("PinYin4Util");
					log.debug(e.getStackTrace().toString());
					e.printStackTrace();
				}
			} else {
				charPinyinTem = new ArrayList<String>();
				charPinyinTem.add(java.lang.Character.toString(in.charAt(i)));
			}

			for(int j = 0; j < charPinyinTem.size(); ++j){

				if(!charPinyin.isEmpty() && charPinyin.contains(charPinyinTem.get(j).substring(0, 1))){
					continue;
				} else {
					charPinyinTem.get(j).substring(0, 1);
					charPinyin.add(charPinyinTem.get(j).substring(0, 1));
				}
			}
			pinyin.put(in.charAt(i), charPinyin);
		}

		return pinyin;
	}

	/**
	 * 合并列表
	 * 
	 * @param a 要合并的列表a
	 * @param b 要合并的列表b
	 * @return 合并后的列表
	 */
	private List<String> combineList(List<String> a, List<String> b){
		List<String> res = new ArrayList<String>();
		for(int i = 0; i < a.size(); ++i){
			for(int j = 0; j < b.size(); ++j){
				String tem = a.get(i) + b.get(j);
				res.add(tem);
			}
		}

		return res;
	}
	
	/**
	 * 获得汉语串的全拼串，多音字用,号分割
	 * 
	 * @param in 要转换的串
	 * @return 对应的全拼串，多音字用,号分割
	 */
	public static List<String> getPinyin(String in){

		PinYin4Util u = new PinYin4Util();

		Map<Character, List<String>> pinyin = u.getQuanPin(in);
		if(pinyin == null){
			return null;
		} else {
			List<String> res = pinyin.get(in.charAt(0));
			for(int i = 1; i < in.length(); ++i){
				res = u.combineList(res, pinyin.get(in.charAt(i)));
			}

			return res;
		}
	}

	/**
	 * 获得汉语串的首字符串
	 * 
	 * @param in 要转换的串
	 * @return 首字符串，多音字用,号分割
	 */
	public static List<String> getPinYinHeadChar(String in){
		PinYin4Util u = new PinYin4Util();

		Map<Character, List<String>> pinyin = u.getQuanPinHeadChar(in);
		if(pinyin == null){
			return null;
		} else {

			List<String> res =  pinyin.get(in.charAt(0));
			for(int i = 1; i < in.length(); ++i){
				res = u.combineList(res,  pinyin.get(in.charAt(i)));
			}

			return res;
		}
	}

	public static void main(String[] args){

		System.out.println(PinYin4Util.getPinyin("中华人民共和国"));
		System.out.println(PinYin4Util.getPinyin(" "));
		System.out.println(PinYin4Util.getPinyin(""));
		System.out.println(PinYin4Util.getPinyin("abc ad"));
		System.out.println(PinYin4Util.getPinYinHeadChar("中华人a民共和国!2单"));
		System.out.println(PinYin4Util.getPinyin("书香门地地板").toString().length());
		System.out.println(PinYin4Util.getPinyin("惠万家瓷砖"));
	}
}
