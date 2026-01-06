/**
 * @FileName	: ResionDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */
package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.RegionPO;
import com.fanglin.utils.Paging;

public interface RegionDao extends Dao<RegionPO> {

	public List<RegionPO> pageRegion(Paging paging, List<Filter> filters);

	public List<RegionPO> pageRegionByName(Paging paging, String name);

	public List<RegionPO> queryRegion();

	public RegionPO queryRegion(String name);

}
