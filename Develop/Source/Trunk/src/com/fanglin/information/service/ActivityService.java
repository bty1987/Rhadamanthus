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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.information.vo.ActivityVO;
import com.fanglin.utils.Paging;

public interface ActivityService {
	
	public void pageActivity(Paging paging, List<FilterVO> filters, String userId);
	
	public List<ActivityVO> queryActivityForValid();
	
	public void addActivity(ActivityVO activityVO, String userId, String userName);
	
	public void updateActivity(ActivityVO activityVO, String userId) throws FLException;
	
}
