/**
 * @File Name		: OilDrawingDao.java
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

import com.fanglin.construction.po.GroundLevelingDrawingPO;
import com.fanglin.core.dao.Dao;

public interface GroundLevelingDrawingDao extends Dao<GroundLevelingDrawingPO> {
	
	public List<GroundLevelingDrawingPO> queryGroundLevelingDrawingByCsId(long csId);
	
	public List<GroundLevelingDrawingPO> queryGroundLevelingDrawingByGlcsId(int glcsId);
	
	public List<GroundLevelingDrawingPO> queryGroundLevelingDrawingByType(short type);
	
}
