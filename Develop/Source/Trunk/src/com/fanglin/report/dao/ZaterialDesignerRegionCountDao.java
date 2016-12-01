/**
 * @File Name		: ZaterialDesignerRegionCountDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.ZaterialDesignerRegionCountPO;

public interface ZaterialDesignerRegionCountDao extends Dao<ZaterialDesignerRegionCountPO> {
	
	public ZaterialDesignerRegionCountPO queryZaterialDesignerRegionCountByRegionIdTime(String regionId, String time);
	
	public List<ZaterialDesignerRegionCountPO> queryZaterialDesignerRegionCount(List<Filter> filters);
	
	public List<Object> countZaterialDesignerRegionCount(List<Filter> filters);

}
