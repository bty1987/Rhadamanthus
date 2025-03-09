/**
 * Title: VillageDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.VillagePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface VillageDao extends Dao<VillagePO> {

	public List<VillagePO> pageVillage(Paging paging, List<Filter> filters, Integer company);

	public List<VillagePO> queryVillageByPinyin(Paging paging, String name, Long pvid, Integer company);

	public List<VillagePO> queryVillageByCityProperId(Integer cityProperId);

	public int countVillageByCpid(Integer cpid);

	public int countVillageByNameACpid(String name, Integer cpid, Integer company);

}
