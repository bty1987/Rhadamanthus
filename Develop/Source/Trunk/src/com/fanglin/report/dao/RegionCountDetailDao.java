/**
 * @File Name		: RegionCountDetailDao.java
 * @Package   	: com.fanglin.report.dao
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.text.ParseException;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.RegionCountDetailPO;
import com.fanglin.utils.Paging;

public interface RegionCountDetailDao extends Dao<RegionCountDetailPO> {
	
	public List<RegionCountDetailPO> pageRegionCountDetail(Paging paging, List<Filter> filters) throws ParseException;
	
	public List<RegionCountDetailPO> queryRegionCountDetail(List<Filter> filters) throws ParseException;

}
