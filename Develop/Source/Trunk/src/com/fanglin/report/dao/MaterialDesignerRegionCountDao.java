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
