/**
 * @File Name		: PutlineDrawingDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.PutlineDrawingPO;
import com.fanglin.core.dao.Dao;

public interface PutlineDrawingDao extends Dao<PutlineDrawingPO> {
	
	public List<PutlineDrawingPO> queryPutlineDrawingByCsId(int csId);
	
	public List<PutlineDrawingPO> queryPutlineDrawingByPlcsId(int plcsId);
	
	public List<PutlineDrawingPO> queryPutlineDrawingByType(short type);

}
