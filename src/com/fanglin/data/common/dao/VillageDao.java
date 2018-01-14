/**
 * Title: VillageDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.VillagePO;
import com.fanglin.utils.Paging;

public interface VillageDao extends Dao<VillagePO> {
	
	public List<VillagePO> pageVillage(Paging paging, List<Filter> filters);
	
	public List<VillagePO> queryVillageByPinyin(Paging paging, String name);
	
	public List<VillagePO> queryVillageByName(String pinyinName);
	
	public List<VillagePO> queryVillageByCityProperId(String cityProperId);
	
	public int countVillageByCityProperId(String cityProperId);
	
}
