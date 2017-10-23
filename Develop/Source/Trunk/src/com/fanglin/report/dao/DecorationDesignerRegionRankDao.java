package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.DecorationDesignerRegionRankPO;

public interface DecorationDesignerRegionRankDao extends Dao<DecorationDesignerRegionRankPO> {
	
	public DecorationDesignerRegionRankPO queryDecorationDesignerRegionRankForInitByRegionId(String regionId,int company);
	
	public List<DecorationDesignerRegionRankPO> queryDecorationDesignerRegionRankForTop(int top,int company);

}
