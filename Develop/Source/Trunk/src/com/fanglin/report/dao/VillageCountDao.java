/**
 * @File Name		: VillageCountDao.java
 * @Package   	: com.fanglin.report.dao
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.VillageCountPO;

public interface VillageCountDao extends Dao<VillageCountPO> {
	
	public List<VillageCountPO> queryVillageCountByXY(double x, double y, double range);

}
