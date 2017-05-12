/**
 * @File Name		: ConstructionScheduleDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionScheduleDao extends Dao<ConstructionSchedulePO> {
	
	public List<ConstructionSchedulePO> pageConstructionSchedule(Paging paging, List<Filter> filters);
	
	public List<ConstructionSchedulePO> pageConstructionScheduleForSupervision(Paging paging, List<Filter> filters);
	
	public List<ConstructionSchedulePO> pageConstructionScheduleForSupervisionByUserId(Paging paging, List<Filter> filters, String workTypeQuality, String userId);
	
	public List<ConstructionSchedulePO> pageConstructionScheduleForQuality(Paging paging, List<Filter> filters, List<Integer> schedules);
	
	public List<ConstructionSchedulePO> pageConstructionScheduleForAcceptance(Paging paging, List<Filter> filters);
	
	public List<ConstructionSchedulePO> queryConstructionScheduleForSupervisionByUserId(List<Filter> filters, String supervisionUserId);
	
	public ConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId);

	public ConstructionSchedulePO queryConstructionScheduleByCsId(Integer csId);
	
}
