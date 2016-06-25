/**
 * @File Name		: ZaterialDesignerRankDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.ZaterialDesignerRankPO;

public interface ZaterialDesignerRankDao extends Dao<ZaterialDesignerRankPO> {
	
	public List<ZaterialDesignerRankPO> queryZaterialDesignerRank();
	
	public ZaterialDesignerRankPO queryZaterialDesignerRankByDesignerIdInit(String designerId);
	
	public List<ZaterialDesignerRankPO> queryZaterialDesignerRankForTop(int top);
	
	public List<?> queryZaterialDesignerRankForPlaceByDesignerId(String designerId);

}
