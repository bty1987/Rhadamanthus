package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;

/**
 * 首页排名 DAO：跨库实时聚合业务表，不落地中间表。
 *
 * <p>签单业绩取 decoration.decoration 按 contractTime 归月（与 metric 基建 sign_amount 同源），
 * 在建工地取 construction.construction 排除已竣工验收。
 */
public interface HomeRankDao extends Dao<Object> {

	/** 设计师当月签单业绩排名：返回 [userId, name, photo, amount(分)]。 */
	List<Object[]> queryDesignerSignRankForTop(String startTime, String endTime, int top, int company);

	/** 业务员当月签单业绩排名：返回 [userId, name, photo, amount(分)]。 */
	List<Object[]> querySalesmanSignRankForTop(String startTime, String endTime, int top, int company);

	/** 监理近一年在建工地数排名：返回 [userId, name, photo, sites]。 */
	List<Object[]> querySupervisorSiteRankForTop(String startTime, int top, int company);

}
