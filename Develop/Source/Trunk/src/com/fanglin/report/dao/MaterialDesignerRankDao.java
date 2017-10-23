package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.MaterialDesignerRankPO;

public interface MaterialDesignerRankDao extends Dao<MaterialDesignerRankPO> {
	
	public MaterialDesignerRankPO queryMaterialDesignerRankByDesignerIdInit(String designerId,int company);
	
	public List<MaterialDesignerRankPO> queryMaterialDesignerRankForTop(int top,int company);
	
	public List<?> queryMaterialDesignerRankForPlaceByDesignerId(String designerId,int company);

}
