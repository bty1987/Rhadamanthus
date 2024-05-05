/**
 * @File Name		: DecorationRankDao.java
 * @Package   	: com.fanglin.report.dao
 * @Version		: 1.0
 * @Date			: 2015-6-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.DecorationRegionRankPO;

public interface DecorationRegionRankDao extends Dao<DecorationRegionRankPO> {

	public DecorationRegionRankPO queryDecorationRegionRankForInitByRegionId(String regionId, int company);

	public List<DecorationRegionRankPO> queryDecorationRegionRankForTop(int top, int month, Integer drid, Short type, int company);

}
