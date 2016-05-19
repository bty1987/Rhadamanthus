/**
 * @File Name		: ChanDrawingDao.java
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

import com.fanglin.construction.po.ChanDrawingPO;
import com.fanglin.core.dao.Dao;

public interface ChanDrawingDao extends Dao<ChanDrawingPO> {
	
	public List<ChanDrawingPO> queryChanDrawingByCsId(int csId);
	
	public List<ChanDrawingPO> queryChanDrawingByCcsId(int ccsId);
	
	public List<ChanDrawingPO> queryChanDrawingByType(short type);

}
