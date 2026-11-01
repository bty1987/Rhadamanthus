/**
 * @File Name		: ActivityService.java
 * @Package   	: com.fanglin.information.service
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.ActivityVO;
import com.fanglin.utils.Paging;

public interface ActivityService {

	public void pageActivity(Paging paging, List<Filter> filters, String userId, int company);

	public List<ActivityVO> queryActivityForValid(ActivityVO activityVO, int company);

	public void addActivity(ActivityVO activityVO, String userId, int company);

	public void updateActivity(ActivityVO activityVO) throws FLException;

	public void updateActivityForStatus(ActivityVO activityVO) throws FLException;

	public void updateActivityForDefault(ActivityVO activityVO) throws FLException;


	/**
	 * 抽奖券发放(收款/提现链插桩调用): 定位活动+Σ规则行算应得, 与已发有效券 diff 补发/回收
	 *
	 * @param orderId 订单号
	 * @param userId 操作人(收款/提现操作员)
	 * @return 本次补发张数(回收为负)
	 */
	public int issueActivityForLotteryByOrderId(String orderId, String userId) throws FLException;

	/**
	 * 抽奖券全量补发入口(上线当天手动触发一次, 幂等可重跑): 扫活动窗口内签约单逐单发放
	 *
	 * @param aid 活动ID
	 * @param userId 操作人
	 * @return 补发总张数
	 */
	public int issueActivityForLottery(long aid, String userId) throws FLException;
}
