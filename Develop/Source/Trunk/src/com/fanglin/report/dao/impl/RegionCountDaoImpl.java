/**
 * @File Name		: RegionCountDaoImpl.java
 * @Package   	: com.fanglin.report.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.report.dao.RegionCountDao;
import com.fanglin.report.po.RegionCountPO;

@Repository("regionCountDao")
public class RegionCountDaoImpl extends DaoImpl<RegionCountPO> implements RegionCountDao {

	public RegionCountDaoImpl(){
		super(RegionCountPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<RegionCountPO> queryRegionCount() {
		return session().createCriteria(RegionCountPO.class).list();
	}

}
