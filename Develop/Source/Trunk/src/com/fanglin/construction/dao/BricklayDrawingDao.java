/**
 * @File Name		: BricklayDrawingDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.BricklayDrawingPO;
import com.fanglin.core.dao.Dao;

public interface BricklayDrawingDao extends Dao<BricklayDrawingPO> {
	
	public List<BricklayDrawingPO> queryBricklayDrawingByCsId(int csId);
	
	public List<BricklayDrawingPO> queryBricklayDrawingByBcsId(int bcsId);
	
	public List<BricklayDrawingPO> queryBricklayDrawingByType(short type);

}
