/**
 * @File Name	: DateUtil.java
 * @Package		: com.fanglin.utils 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 日期相关的工具类
 */

package com.fanglin.utils;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

public class DateUtil {

	/**
	 * 根据一个格式返回当前系统时间
	 */
	public static String current(String format) {
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
	public static Date parseDate(String date, String format) {

		if (!StringUtils.isNotEmpty(date)) return null;

		try {
			return new SimpleDateFormat(format).parse(date);
		} catch (ParseException e) {
			System.out.println(e.getMessage());
		}
		return null;
	}

	/**
	 * convert Date to Timestamp
	 * 
	 * @param date Data类型的日期
	 * @return Timestamp类型的日期
	 */
	public static Timestamp getDateToTimestamp(Date date) {
		return new Timestamp(date.getTime());
	}

	/**
	 * convert Timestamp to Date
	 * 
	 * @param date Timestamp类型的日期
	 * @return Date类型的日期
	 */
	public static Date getTimestampToDate(Timestamp tamp) {
		Date date = new Date();
		date = tamp;
		return date;
	}

	/**
	 * 获得当前系统时间串,格式如"yyyyMMddHHmmss"
	 * 
	 * @return "yyyyMMddHHmmss"格式的串
	 */
	public static String current() {
		return current("yyyyMMddHHmmss");
	}

	/**
	 * 将一个字符串类型的时间转换为另一种格式的字符串类型时间 Example : String formattedDate = DateUtil.format("20070906112351", "yyyyMMddHHmmss", "yyyy年MM月dd日 HH时mm分ss秒")
	 * 
	 * @param date 字符串时间.例如20070906112351
	 * @param sourceFormat 源时间的格式,上面为yyyyMMddHHmmss
	 * @param transFormat 要转换的目标格式
	 * @return 结果串
	 */
	public static String format(String date, String sourceFormat, String transFormat) {

		if (StringUtils.isEmpty(date)) return "";

		DateFormat _formater1 = new SimpleDateFormat(sourceFormat);
		DateFormat _formater2 = new SimpleDateFormat(transFormat);

		try {
			return _formater2.format(_formater1.parse(date));
		} catch (ParseException pe) {
			return date;
		}
	}

	/**
	 * 将"yyyyMMddHHmmss"格式的时间转换为目标格式的字符串类型时间 Example : String formattedDate = DateUtil.format("20070906112351", "yyyy年MM月dd日 HH时mm分ss秒")
	 * 
	 * @param date yyyyMMddHHmmss格式字符串时间.例如20070906112351
	 * @param transFormat 要转换的目标格式
	 * @return 结果串
	 */
	public static String formatMedium(String date, String transFormat) {
		return DateUtil.format(date, "yyyyMMddHHmmss", transFormat);
	}

	/**
	 * 将"yyyyMMddHHmmss"格式的时间转换为"yyyy年MM月dd日"格式的字符串类型时间 Example : String formattedDate = DateUtil.format("20070906112351")
	 * 
	 * @param date yyyyMMddHHmmss格式字符串时间.例如20070906112351
	 * @return 格式为"yyyy年MM月dd日"的结果串
	 */
	public static String formatShort(String date) {
		return formatMedium(date, "yyyy年MM月dd日");
	}

	/**
	 * 将"yyyyMMddHHmmss"格式的时间转换为"yyyy-MM-dd"格式的字符串类型时间 Example : String formattedDate = DateUtil.format("20070906112351")
	 * 
	 * @param date yyyyMMddHHmmss格式字符串时间.例如20070906112351
	 * @return 格式为"yyyy-MM-dd"的结果串
	 */
	public static String format(String date) {
		return formatMedium(date, "yyyy-MM-dd");
	}

	/**
	 * 将日期类型转换成串
	 */
	public static String getDateToDateString(Date date, String format) {
		SimpleDateFormat dateFormat = new SimpleDateFormat(format);

		return dateFormat.format(date);
	}

	/**
	 * 判断一个时间是否为上午
	 * 
	 * @param date 日期
	 * @return boolean 是否为上午
	 */
	public static boolean isAM(Date date) {

		boolean isTrue = true;

		DateFormat df = new SimpleDateFormat("HH");

		try {
			int integerHour = Integer.parseInt(df.format(date));

			return (integerHour >= 0 && integerHour <= 12);
		} catch (NumberFormatException nfe) {
			// 格式异常，忽略并返回默认值
		}

		return isTrue;
	}

	/**
	 * 判断当前时间是否为上午
	 * 
	 * @return boolean
	 */
	public static boolean isAM() {
		return isAM(new Date());
	}

	public static Date plusDay(Date date, int num) {

		Calendar cal = Calendar.getInstance();
		cal.setTime(date);

		cal.add(Calendar.DAY_OF_MONTH, num);

		return cal.getTime();
	}

	public static int diffDay(Timestamp start, Timestamp end) {

		if (start == null) return 0;
		if (end == null) return 0;

		else return (int) ((end.getTime() - start.getTime()) / 24L / 60L / 60L / 1000L);
	}

	/**
	 * 获得指定时间月的第一天
	 * 
	 * @return
	 */
	public static Date getFirstDay(Date theDate) {
		String temStr = getDateToDateString(theDate, "yyyy-MM") + "-01";
		return DateUtil.parseDate(temStr, "yyyy-MM-dd");
	}

	/**
	 * 获得指定时间月的最后一天
	 * 
	 * @return
	 */
	public static Date getLastDay(Date theDate) {
		String temStr = getDateToDateString(theDate, "yyyy-MM-dd") + " 23:59:59";
		Date tem = DateUtil.parseDate(temStr, "yyyy-MM-dd HH:mm:ss");

		Calendar cal = Calendar.getInstance();
		cal.setTime(tem);
		cal.set(Calendar.DAY_OF_MONTH, 1);
		cal.roll(Calendar.DAY_OF_MONTH, -1);
		return cal.getTime();
	}

	/**
	 * 判断给定日期是否为工作日
	 * 
	 * @param date 日期
	 * @return 如果是工作日返回true，否则返回false
	 */
	private static boolean isWorkingDay(Date date, Set<String> holidays) {

		SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);

		// 排除周六和周日
		int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
		if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) {
			return false;
		}

		// 排除节假日
		String dateStr = DATE_FORMAT.format(date);
		return !holidays.contains(dateStr);
	}

	public static Set<String> initHoliday() {

		Set<String> holidays = new HashSet<String>(Arrays.asList("2025-01-01", // 元旦
				"2025-01-29", "2025-01-30", "2025-01-31", "2025-02-01", "2025-02-02", "2025-02-03", // 春节
				"2025-04-04", "2025-04-05", "2025-04-06", // 清明节
				"2025-05-01", "2025-05-02", "2025-05-03", "2025-05-04", // 劳动节
				"2025-05-31", "2025-06-01", "2025-06-02", // 端午节
				"2025-09-29", // 中秋节
				"2025-10-01", "2025-10-02", "2025-10-03", "2025-10-04", "2025-10-05", "2025-10-06", "2025-10-07") // 国庆节
		);

		return holidays;
	}

	/**
	 * 计算两个日期之间的工作日天数（排除周六、周日和节假日）
	 * 
	 * @param startDate 开始日期
	 * @param endDate 结束日期
	 * @return 工作日天数
	 */
	public static int getWorkDays(Date startDate, Date endDate) {

		Set<String> holidays = initHoliday();

		if (startDate.after(endDate)) {
			throw new IllegalArgumentException("开始日期不能晚于结束日期");
		}

		int workingDays = 0;
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(startDate);

		while (!calendar.getTime().after(endDate)) {
			if (isWorkingDay(calendar.getTime(), holidays)) {
				workingDays++;
			}
			calendar.add(Calendar.DAY_OF_MONTH, 1);
		}

		return workingDays;
	}

	/**
	 * 计算两个时间戳之间的工作日天数
	 * 
	 * @param startTs 开始时间戳
	 * @param endTs 结束时间戳
	 * @return 工作日天数
	 */
	public static int getWorkDays(Timestamp startTs, Timestamp endTs) {
		return getWorkDays(new Date(startTs.getTime()), new Date(endTs.getTime()));
	}

	/**
	 * 根据开始日期和工作日天数计算结束日期
	 * 
	 * @param startDate 开始日期
	 * @param workingDays 工作日天数
	 * @return 结束日期
	 */
	public static Date getEndWorkDate(Date startDate, int workingDays) {

		Set<String> holidays = initHoliday();

		if (workingDays <= 0) {
			return startDate;
		}

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(startDate);

		int countedDays = 0;

		while (countedDays < workingDays) {
			// 移动到下一天
			calendar.add(Calendar.DAY_OF_MONTH, 1);

			// 检查是否为工作日
			if (isWorkingDay(calendar.getTime(), holidays)) {
				countedDays++;
			}
		}

		return calendar.getTime();
	}

	public static void main(String args[]) {

		isAM();

		System.out.println(DateUtil.getDateToTimestamp(DateUtil.getFirstDay(new Date())));

		System.out.println(DateUtil.getDateToTimestamp(new Date()));

		System.out.println(DateUtil.getDateToDateString(new Date(), "yyyy-MM-dd"));

		System.out.println(DateUtil.plusDay(new Date(), -30));

		System.out.println(DateUtil.getDateToDateString(DateUtil.getFirstDay(parseDate("2022-02", "yyyy-MM")), "yyyy-MM-dd"));
		System.out.println(DateUtil.getDateToDateString(DateUtil.getLastDay(parseDate("2022-02", "yyyy-MM")), "yyyy-MM-dd"));

		Date startDate = parseDate("2025-10-01", "yyyy-MM-dd");
		Date endDate = parseDate("2025-10-31", "yyyy-MM-dd");

		int workingDays = getWorkDays(startDate, endDate);

		System.out.println("开始日期: " + new SimpleDateFormat("yyyy-MM-dd").format(startDate));
		System.out.println("结束日期: " + new SimpleDateFormat("yyyy-MM-dd").format(endDate));
		System.out.println("工作日天数: " + workingDays);

		Date endDate1 = getEndWorkDate(startDate, 31);

		System.out.println(new SimpleDateFormat("yyyy-MM-dd").format(endDate1));

	}
}
