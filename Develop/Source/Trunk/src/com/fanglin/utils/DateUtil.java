/*
 * @File Name	: DateUtil.java
 * @Package		：com.fanglin.utils 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * Describing	: 日期相关的工具类
 */

package com.fanglin.utils;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

public class DateUtil {

	/**
	 * 根据一个格式返回当前系统时间
	 */
	public static String current(String format){
		DateFormat dateFormat = new SimpleDateFormat(format);
		return dateFormat.format(new Date());
	}

	/**
	 * set string to date
	 * 
	 * @param date 日期串
	 * @param format 格式串
	 * @return Date类型的日期
	 */
	public static Date parseDate(String date, String format){
		if(StringUtils.isNotEmpty(date)){
			try {
				return new SimpleDateFormat(format).parse(date);
			} catch (ParseException e){
				e.printStackTrace();
			}
		}
		return null;
	}

	/**
	 * convert Date to Timestamp
	 * 
	 * @param date Data类型的日期
	 * @return Timestamp类型的日期
	 */
	public static Timestamp getDateToTimestamp(Date date){
		return new Timestamp(date.getTime());
	}

	/**
	 * convert Timestamp to Date
	 * 
	 * @param date Timestamp类型的日期
	 * @return Date类型的日期
	 */
	public static Date getTimestampToDate(Timestamp tamp){
		Date date = new Date();
		date = tamp;
		return date;
	}

	/**
	 * 获得当前系统时间串，格式如“yyyyMMddHHmmss”
	 * 
	 * @return “yyyyMMddHHmmss”格式的串
	 */
	public static String current(){
		return current("yyyyMMddHHmmss");
	}

	/**
	 * 将一个字符串类型的时间转换为另一种格式的字符串类型时间 Example : String formattedDate =
	 * DateUtil.format("20070906112351", "yyyyMMddHHmmss",
	 * "yyyy年MM月dd日 HH时mm分ss秒")
	 * 
	 * @param date 字符串时间.例如20070906112351
	 * @param sourceFormat 源时间的格式,上面为yyyyMMddHHmmss
	 * @param transFormat  要转换的目标格式
	 * @return 结果串
	 */
	public static String format(String date, String sourceFormat,
			String transFormat){
		if(StringUtils.isEmpty(date)){
			return "";
		}

		DateFormat _formater1 = new SimpleDateFormat(sourceFormat);
		DateFormat _formater2 = new SimpleDateFormat(transFormat);

		try {
			return _formater2.format(_formater1.parse(date));
		} catch (ParseException pe){
			return date;
		}
	}

	/**
	 * 将”yyyyMMddHHmmss“格式的时间转换为目标格式的字符串类型时间 Example : String formattedDate =
	 * DateUtil.format("20070906112351", "yyyy年MM月dd日 HH时mm分ss秒")
	 * 
	 * @param date yyyyMMddHHmmss格式字符串时间.例如20070906112351
	 * @param transFormat 要转换的目标格式
	 * @return 结果串
	 */
	public static String formatMedium(String date, String transFormat){
		return DateUtil.format(date, "yyyyMMddHHmmss", transFormat);
	}

	/**
	 * 将”yyyyMMddHHmmss“格式的时间转换为“yyyy年MM月dd日”格式的字符串类型时间 Example : String formattedDate =
	 * DateUtil.format("20070906112351")
	 * 
	 * @param date
	 *            yyyyMMddHHmmss格式字符串时间.例如20070906112351
	 * @return 格式为“yyyy年MM月dd日”的结果串
	 */
	public static String formatShort(String date){
		return formatMedium(date, "yyyy年MM月dd日");
	}

	/**
	 * 将”yyyyMMddHHmmss“格式的时间转换为“yyyy-MM-dd”格式的字符串类型时间 Example : String formattedDate =
	 * DateUtil.format("20070906112351")
	 * 
	 * @param date
	 *            yyyyMMddHHmmss格式字符串时间.例如20070906112351
	 * @return 格式为“yyyy-MM-dd”的结果串
	 */
	public static String format(String date){
		return formatMedium(date, "yyyy-MM-dd");
	}

	/**
	 * 将日期类型转换成串
	 */
	public static String getDateToDateString(Date date,String format){
		SimpleDateFormat  dateFormat = new SimpleDateFormat(format);
		
		return dateFormat.format(date);
	}
	
	/**
	 * 判断一个时间是否为上午
	 * @param date 日期
	 * @return boolean 是否为上午
	 */
	public static boolean isAM(Date date){

		boolean isTrue = true;

		DateFormat df = new SimpleDateFormat("HH");

		try {
			int integerHour = Integer.parseInt(df.format(date));

			if(integerHour >= 0 && integerHour <= 12){
				isTrue = true;
			} else {
				isTrue = false;
			}
		} catch (NumberFormatException nfe){
			nfe.getStackTrace();
		}

		return isTrue;
	}

	/**
	 * 判断当前时间是否为上午
	 * @return boolean
	 */
	public static boolean isAM(){
		return isAM(new Date());
	}

	 /**
     * 获得指定时间月的第一天
     * @return
     */
	public static Date getFirstDay(Date theDate){
		String temStr = getDateToDateString(theDate, "yyyy-MM")+"-01";
        return DateUtil.parseDate(temStr, "yyyy-MM-dd");
    }
    
    /**
     * 获得指定时间月的最后一天
     * @return
     */
	public static Date getLastDay(Date theDate){
    	String temStr = getDateToDateString(theDate, "yyyy-MM-dd")+" 23:59:59";
        Date tem =  DateUtil.parseDate(temStr,"yyyy-MM-dd HH:mm:ss");
        
    	 Calendar cal = Calendar.getInstance();
         cal.setTime(tem);
         cal.set(Calendar.DAY_OF_MONTH, 1);
         cal.roll(Calendar.DAY_OF_MONTH, -1);
         return cal.getTime();
    }
    
	/**
	 * 获得条件的起止时间
	 */
	public static List<Date>  calStartAndEndTime(String kind, Date reportDate){

		Date endDate = new Date();
		Date startDate = new Date();
		List<Date> res = new ArrayList<Date>();
		if(kind.equals("天")){
			String temStr = getDateToDateString(reportDate, "yyyy-MM-dd");
	        startDate = DateUtil.parseDate(temStr,"yyyy-MM-dd");
	        
	        temStr = getDateToDateString(reportDate, "yyyy-MM-dd")+" 23:59:59";
	        endDate = DateUtil.parseDate(temStr,"yyyy-MM-dd HH:mm:ss");
		}else if(kind.equals("月")){
			startDate = DateUtil.getFirstDay(reportDate);
			endDate = DateUtil.getLastDay(reportDate);
		}else if(kind.equals("季度")){
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(reportDate);
			int monthIndex = calendar.get(Calendar.MONTH);
			int jd = monthIndex/3;
			int startMonth = jd*3;
			int endMonth = startMonth+2;
			
			calendar.set(Calendar.MONTH, startMonth);
			Date start = calendar.getTime();
			
			calendar.set(Calendar.MONTH, endMonth);
			Date end = calendar.getTime();
			
			startDate = DateUtil.getFirstDay(start);
			endDate  = DateUtil.getLastDay(end);
		}else if(kind.equals("半年")){
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(reportDate);
			int monthIndex = calendar.get(Calendar.MONTH);
			int jd = monthIndex/6;
			int startMonth = jd*6;
			int endMonth = startMonth+5;
			
			calendar.set(Calendar.MONTH, startMonth);
			Date start = calendar.getTime();
			
			calendar.set(Calendar.MONTH, endMonth);
			Date end = calendar.getTime();
			
			startDate = DateUtil.getFirstDay(start);
			endDate  = DateUtil.getLastDay(end);
		}else{//一年
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(reportDate);
			int monthIndex = calendar.get(Calendar.MONTH);
			int jd = monthIndex/12;
			int startMonth = jd*12;
			int endMonth = startMonth+11;
			
			calendar.set(Calendar.MONTH, startMonth);
			Date start = calendar.getTime();
			
			calendar.set(Calendar.MONTH, endMonth);
			Date end = calendar.getTime();
			
			startDate = DateUtil.getFirstDay(start);
			endDate  = DateUtil.getLastDay(end);
		}
		res.add(startDate);
		res.add(endDate);
		
		return res;
	}
	
	public static void main(String args[]){
		isAM();
		
		Date theDate = parseDate("2014-6-3 12:56:07", "yyyy-MM-dd HH:mm:ss");
//		Date start = new Date();
//		Date end = new Date();
		
		List<Date> res1 = calStartAndEndTime("天", theDate);
		System.out.println(res1);
		List<Date> res2 = calStartAndEndTime("月", theDate);

		List<Date> res3 = calStartAndEndTime("季度", theDate);
		List<Date> res4 = calStartAndEndTime("半年", theDate);
		List<Date> res5 = calStartAndEndTime("一年", theDate);
		
		System.out.println(res2);
		System.out.println(res3);
		System.out.println(res4);
		System.out.println(res5);
		
		System.out.println(DateUtil.getDateToTimestamp(DateUtil.getFirstDay(new Date())));
		
		System.out.println(DateUtil.getDateToTimestamp(new Date()));

	}
}
