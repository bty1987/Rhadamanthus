package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.MaterialDesignerCountPO;

public interface MaterialDesignerCountDao extends Dao<MaterialDesignerCountPO> {
	
	public MaterialDesignerCountPO queryMaterialDesignerCountByDesignerIdATime(String designerId, String time);
	
	public List<MaterialDesignerCountPO> queryMaterialDesignerCount(List<Filter> filters);
	
	public List<Object> countMaterialDesignerCount(List<Filter> filters);

}
