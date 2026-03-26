package com.fanglin.seiya.service;

import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.core.interceptor.FLException;

public interface A20260303Service {

	/**
	 * 同步楼盘数据（根据vid判断新增或更新）
	 *
	 * @param vid 楼盘ID（更新时使用，新增时为空）
	 * @param name 楼盘名称
	 * @param proper 区域名称（如：铁西区）
	 * @param city 城市名称（如：沈阳市）
	 * @param pvid 父级楼盘ID（可为空）
	 * @param company 公司ID
	 * @param no 楼盘编号（可选，为空时自动生成）
	 * @param ruleArray 规则数组（JSONArray格式，包含rule和comment字段）
	 * @param x X坐标（double类型，会乘以1000000转为整数）
	 * @param y Y坐标（double类型，会乘以1000000转为整数）
	 * @param companyDistance 公司距离（对应village中的mileage字段）
	 * @return 同步结果（包含操作类型、楼盘ID等信息）
	 * @throws FLException 业务异常
	 */
	public Map<String, Object> syncVillage(String vid, String name, String proper, String city, String pvid, Integer company, String no, JSONArray ruleArray, Double x, Double y, Long companyDistance) throws FLException;

}
