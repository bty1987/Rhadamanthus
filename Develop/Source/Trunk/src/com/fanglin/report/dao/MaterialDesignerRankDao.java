/**
 * @File Name		: MaterialDesignerRankDao.java
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
import com.fanglin.report.po.MaterialDesignerRankPO;

public interface MaterialDesignerRankDao extends Dao<MaterialDesignerRankPO> {
	
	public MaterialDesignerRankPO queryMaterialDesignerRankByDesignerIdInit(String designerId);
	
	public List<MaterialDesignerRankPO> queryMaterialDesignerRankForTop(int top);
	
	public List<?> queryMaterialDesignerRankForPlaceByDesignerId(String designerId);

}
