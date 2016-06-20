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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.utils.Paging;

public interface VillageDao extends Dao<VillagePO> {
	
	public List<VillagePO> pageVillages(Paging paging, List<FilterVO> filters);
	
	public List<VillagePO> queryVillage(List<FilterVO> filters);
	
	public List<VillagePO> queryVillagesName(Paging paging, String pinyinName);
	
	public List<VillagePO> queryVillagesByCityProperId(String cityProperId);
	
	public int countVillageByCityProperId(String cityProperId);
}
