/**
 * @File Name		: WaterwayCircuitPowerDrawingDao.java
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

import com.fanglin.construction.po.WaterwayCircuitCheckDrawingPO;
import com.fanglin.core.dao.Dao;

public interface WaterwayCircuitCheckDrawingDao extends Dao<WaterwayCircuitCheckDrawingPO> {
	
	public List<WaterwayCircuitCheckDrawingPO> queryWaterwayCircuitCheckDrawingByCsId(long csId);
	
	public List<WaterwayCircuitCheckDrawingPO> queryWaterwayCircuitCheckDrawingByWcccsId(int wcccsId);
	
	public List<WaterwayCircuitCheckDrawingPO> queryWaterwayCircuitCheckDrawingByType(short type);

}
