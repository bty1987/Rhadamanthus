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

import com.fanglin.construction.po.OilDrawingPO;
import com.fanglin.core.dao.Dao;

public interface OilDrawingDao extends Dao<OilDrawingPO> {
	
	public List<OilDrawingPO> queryOilDrawingByCsId(int csId);
	
	public List<OilDrawingPO> queryOilDrawingByOcsId(int ocsId);
	
	public List<OilDrawingPO> queryOilDrawingByType(short type);
	
}
