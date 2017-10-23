package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.DecorationDesignerRankPO;

public interface DecorationDesignerRankDao extends Dao<DecorationDesignerRankPO> {
	
	public DecorationDesignerRankPO queryDecorationDesignerRankForInitByDesignerId(String designerId,int company);
	
	public List<DecorationDesignerRankPO> queryDecorationDesignerRankForTop(int top,int company);
	
	public List<?> queryDecorationDesignerRankForPlaceByDesignerId(String designerId,int company);

}
