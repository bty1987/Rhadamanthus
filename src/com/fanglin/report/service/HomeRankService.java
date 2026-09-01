package com.fanglin.report.service;

import java.util.List;

import com.fanglin.common.vo.TopVO;

/**
 * 首页排名服务：实时聚合业务库生成设计/业务/工程三组 top 榜，替代荒废的 Python+Redis 采集链路。
 */
public interface HomeRankService {

	final static short TYPE_DESIGNER_INT = 0;

	final static short TYPE_SALESMAN_INT = 1;

	final static short TYPE_SUPERVISOR_INT = 2;

	/**
	 * 查询首页排名 top10（带进程内短缓存）。
	 *
	 * @param type 排名维度：0 设计师签单业绩 / 1 业务员签单业绩 / 2 监理在建工地
	 * @param month 签单业绩归月（yyyyMM），空取当月；工程维度忽略该参数
	 * @param company 公司
	 * @return topName 姓名 / topImg 头像 / topValue 设计·业务为业绩(万元,两位小数)，工程为工地数
	 */
	List<TopVO> queryHomeRankForTop(Short type, Integer month, int company);

}
