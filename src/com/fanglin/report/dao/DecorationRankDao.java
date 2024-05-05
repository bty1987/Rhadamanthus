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
import com.fanglin.report.po.DecorationRankPO;

public interface DecorationRankDao extends Dao<DecorationRankPO> {

	public DecorationRankPO queryDecorationRankForInitByDesignerId(String designerId, int company);

	public List<DecorationRankPO> queryDecorationRankForTop(int top, int month, Integer duid, Integer ddid, Integer drid, Short type, int company);

	public List<?> queryDecorationRankForPlaceByDesignerId(String designerId, int company);

}
