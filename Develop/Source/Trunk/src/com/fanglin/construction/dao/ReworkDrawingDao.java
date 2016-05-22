/**
 * @File Name		: ReworkDrawingDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ReworkDrawingPO;
import com.fanglin.core.dao.Dao;

public interface ReworkDrawingDao extends Dao<ReworkDrawingPO> {
	
	public List<ReworkDrawingPO> queryDrawingByReworkId(int reworkId);
	
}
