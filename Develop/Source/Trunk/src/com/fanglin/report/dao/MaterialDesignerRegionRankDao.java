package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.MaterialDesignerRegionRankPO;

public interface MaterialDesignerRegionRankDao extends Dao<MaterialDesignerRegionRankPO> {
	
	public MaterialDesignerRegionRankPO queryMaterialDesignerRegionRankByRegionIdInit(String regionId,int company);
	
	public List<MaterialDesignerRegionRankPO> queryMaterialDesignerRegionRankForTop(int top,int company);

}
