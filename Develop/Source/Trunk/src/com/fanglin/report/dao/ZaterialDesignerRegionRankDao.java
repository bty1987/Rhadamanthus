package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.ZaterialDesignerRegionRankPO;

public interface ZaterialDesignerRegionRankDao extends Dao<ZaterialDesignerRegionRankPO> {
	
	public List<ZaterialDesignerRegionRankPO> queryZaterialDesignerRegionRank();
	
	public ZaterialDesignerRegionRankPO queryZaterialDesignerRegionRankByRegionIdInit(String regionId,int company);
	
	public List<ZaterialDesignerRegionRankPO> queryZaterialDesignerRegionRankForTop(int top,int company);

}
