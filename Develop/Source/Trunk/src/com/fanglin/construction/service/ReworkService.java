/**
 * @File Name	: ReworkService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ReworkVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ReworkService {
	
	public void pageRework(Paging paging, List<Filter> filters);
	
	public void pageReworkByOrderId(Paging paging, List<Filter> filters, ReworkVO reworkVO);
	
	public int saveOrUpdateRework(ReworkVO reworkVO);
	
	public void updateRework(ReworkVO reworkVO);
	
	public void deleteReworkById(int reworkId);
	
	public void deleteRework(ReworkVO reworkVO);
	
	public void deleteRework(List<String> rwIds);

}
