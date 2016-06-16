/**
 * @File Name		: CarpentDrawingDao.java
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

import com.fanglin.construction.po.CarpentDrawingPO;
import com.fanglin.core.dao.Dao;

public interface CarpentDrawingDao extends Dao<CarpentDrawingPO> {
	
	public List<CarpentDrawingPO> queryCarpentDrawingByCsId(int csId);
	
	public List<CarpentDrawingPO> queryCarpentDrawingByCcsId(int ccsId);
	
	public List<CarpentDrawingPO> queryCarpentDrawingByType(short type);

}
