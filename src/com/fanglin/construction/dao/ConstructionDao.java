/**
 * @File Name	: ConstructionDao.java
 * @Package   	: com.fanglin.dao.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionDao extends Dao<ConstructionPO> {
	
	public List<ConstructionPO> pageConstruction(Paging paging, List<Filter> filters, Integer company);
	
	public List<ConstructionPO> pageConstructionForSupervision(Paging paging, List<Filter> filters, int suid);
	
	public List<ConstructionPO> pageConstructionForSupervisionByUserId(Paging paging, List<Filter> filters, String workTypeQuality, String userId);
	
	public List<ConstructionPO> pageConstructionForAcceptance(Paging paging, List<Filter> filters, Integer company);
	
	public List<ConstructionPO> queryConstructionForSupervisionByUserId(List<Filter> filters, String supervisionUserId);
	
	public ConstructionPO queryConstructionByOrderId(String orderId);

	public ConstructionPO queryConstructionByCid(long cid);
	
}
