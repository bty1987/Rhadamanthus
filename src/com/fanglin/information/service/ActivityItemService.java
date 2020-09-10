/**
 * @File Name		: ActivityItemService.java
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
import com.fanglin.information.vo.ActivityItemVO;
import com.fanglin.information.vo.ActivityVO;

public interface ActivityItemService {

	public List<ActivityItemVO> queryActivityItemByAid(ActivityVO activityVO);

	public int addActivityItem(ActivityVO activityVO, ActivityItemVO activityItemVO) throws FLException;

	public int deleteActivityItem(ActivityVO activityVO, ActivityItemVO activityItemVO);

}
