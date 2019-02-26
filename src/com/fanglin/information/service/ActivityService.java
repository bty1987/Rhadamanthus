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
	
	public void pageActivity(Paging paging, List<Filter> filters, String userId,int company);
	
	public List<ActivityVO> queryActivityForValid(ActivityVO activityVO, int company);
	
	public void addActivity(ActivityVO activityVO, String userId, String userName, int company);
	
	public void updateActivity(ActivityVO activityVO) throws FLException;
	
	public void updateActivityForStatus(ActivityVO activityVO) throws FLException;
	
	public void updateActivityForDefault(ActivityVO activityVO) throws FLException;
	
}
