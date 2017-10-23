package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.ZaterialDesignerRankPO;

public interface ZaterialDesignerRankDao extends Dao<ZaterialDesignerRankPO> {
	
	public List<ZaterialDesignerRankPO> queryZaterialDesignerRank();
	
	public ZaterialDesignerRankPO queryZaterialDesignerRankByDesignerIdInit(String designerId,int company);
	
	public List<ZaterialDesignerRankPO> queryZaterialDesignerRankForTop(int top,int company);
	
	public List<?> queryZaterialDesignerRankForPlaceByDesignerId(String designerId,int company);

}
