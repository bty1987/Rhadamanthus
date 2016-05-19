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

import com.fanglin.construction.po.WaterwayCircuitPowerDrawingPO;
import com.fanglin.core.dao.Dao;

public interface WaterwayCircuitPowerDrawingDao extends Dao<WaterwayCircuitPowerDrawingPO> {
	
	public List<WaterwayCircuitPowerDrawingPO> queryWaterwayCircuitPowerDrawingByCsId(int csId);
	
	public List<WaterwayCircuitPowerDrawingPO> queryWaterwayCircuitPowerDrawingByWcpcsId(int wcpcsId);
	
	public List<WaterwayCircuitPowerDrawingPO> queryWaterwayCircuitPowerDrawingByType(short type);

}
