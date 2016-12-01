/**
 * @File Name		: MaterialDesignerRegionCountDao.java
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
import com.fanglin.report.po.MaterialDesignerRegionCountPO;

public interface MaterialDesignerRegionCountDao extends Dao<MaterialDesignerRegionCountPO> {
	
	public MaterialDesignerRegionCountPO	queryMaterialDesignerRegionCountByRegionIdTime(String regionId, String time);
	
	public List<MaterialDesignerRegionCountPO> queryMaterialDesignerRegionCount(List<Filter>filters);
	
	public List<Object> countMaterialDesignerRegionCount(List<Filter> filters);

}
